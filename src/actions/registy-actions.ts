// src/actions/registy-actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const registrySchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  contacted: z.boolean().optional(),
  comments: z.string().optional(),
  registeredBy: z.string().min(1, "Registered By is required"),
});

type RegistryResponse = {
  success: boolean;
  data?: {
    patientId: string;
    contacted: boolean;
    id: string;
    diseaseId: string;
    contactDate: Date | null;
    isClosed: boolean;
    closedAt: Date | null;
    closedById: string | null;
    userId: string;
    createdAt: Date;
  };
  error?: string;
  details?: unknown;
};

// Define a type for the partial registry data that can be passed to updateRegistry
type RegistryUpdateData = {
  patientId: string;
  registeredBy: string;
  contacted?: boolean;
  comments?: string;
};

export async function updateRegistry(
  data: RegistryUpdateData
): Promise<RegistryResponse> {
  try {
    const validatedData = registrySchema.parse(data);
    const { contacted, comments, patientId, registeredBy } = validatedData;

    const result = await prisma.$transaction(async (tx) => {
      // Find the most recent registry
      const registry = await tx.registry.findFirst({
        where: { patientId },
        include: {
          patient: true,
          comments: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
      });

      if (!registry) {
        throw new Error("Registry not found");
      }

      if (registry.isClosed) {
        throw new Error("Cannot update a closed registry");
      }

      // Check if contact status is actually changing
      const contactStatusChanged =
        contacted !== undefined && contacted !== registry.contacted;

      // Check if a comment is actually provided and different from the last comment
      const lastComment = registry.comments[0]?.comment || "";
      const newComment = comments || "";
      const commentChanged =
        newComment.trim() !== "" && newComment.trim() !== lastComment.trim();

      // Update the registry
      const updatedRegistry = await tx.registry.update({
        where: { id: registry.id },
        data: {
          contacted,
          contactDate:
            contactStatusChanged && contacted
              ? new Date()
              : registry.contactDate,
          registeredBy: {
            connect: {
              id: registeredBy,
            },
          },
        },
      });

      // Add comment if provided and different from the last comment
      if (commentChanged) {
        await tx.registryComment.create({
          data: {
            registryId: registry.id,
            comment: newComment,
            userId: registeredBy,
          },
        });
      }

      // Create update record ONLY for contact status changes, not for comments
      if (contactStatusChanged) {
        await tx.registryUpdate.create({
          data: {
            registryId: registry.id,
            type: "CONTACT_STATUS_CHANGED",
            userId: registeredBy,
            details: `Contact status updated to ${contacted}`,
          },
        });
      }

      // Determine the activity type based on the actual action performed
      let activityType:
        | "PATIENT_CONTACTED"
        | "COMMENT_ADDED"
        | "REGISTRY_UPDATED";
      let activityDescription: string;

      if (contactStatusChanged) {
        activityType = "PATIENT_CONTACTED";
        activityDescription = `Contacted patient: ${registry.patient.name}`;
      } else if (commentChanged) {
        activityType = "COMMENT_ADDED";
        activityDescription = `Added comment for ${registry.patient.name}`;
      } else {
        activityType = "REGISTRY_UPDATED";
        activityDescription = `Updated registry for ${registry.patient.name}`;
      }

      // Create new activity with more specific type
      await tx.activity.create({
        data: {
          type: activityType,
          description: activityDescription,
          patientId,
          userId: registeredBy,
        },
      });

      return updatedRegistry;
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating registry:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors
      switch (error.code) {
        case "P2002":
          return {
            success: false,
            error: "A unique constraint would be violated.",
            details: error,
          };
        case "P2025":
          return {
            success: false,
            error: "Record not found.",
            details: error,
          };
        default:
          return {
            success: false,
            error: "Database error occurred.",
            details: error,
          };
      }
    }

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.errors,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
      details: error,
    };
  }
}

export async function closeRegistry(registryId: string, userId: string) {
  try {
    const registry = await prisma.registry.findUnique({
      where: { id: registryId },
      include: {
        patient: true,
      },
    });

    if (!registry) {
      throw new Error("Registry not found");
    }

    if (registry.isClosed) {
      throw new Error("Registry is already closed");
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update the registry to mark it as closed
      const updatedRegistry = await tx.registry.update({
        where: { id: registryId },
        data: {
          isClosed: true,
          closedAt: new Date(),
          closedBy: {
            connect: {
              id: userId,
            },
          },
        },
      });

      // Create a registry update record for closing the registry
      await tx.registryUpdate.create({
        data: {
          registryId: registryId,
          type: "REGISTRY_CLOSED",
          userId: userId,
          details: `Registry closed for patient: ${registry.patient.name}`,
        },
      });

      // Create an activity record
      await tx.activity.create({
        data: {
          type: "REGISTRY_CLOSED",
          description: `Registry closed for patient: ${registry.patient.name}`,
          patientId: registry.patientId,
          userId: userId,
        },
      });

      return updatedRegistry;
    });

    return result;
  } catch (error) {
    console.error("Error closing registry:", error);
    throw error;
  }
}
