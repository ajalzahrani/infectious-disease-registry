// src/actions/registy-actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const registrySchema = z
  .object({
    patientId: z.string().min(1, "Patient ID is required"),
    contacted: z.boolean().optional(),
    comments: z.string().optional(),
    registeredBy: z.string().min(1, "Registered By is required"),
  })
  .refine(
    (data) => {
      // Add custom validation if needed
      return true;
    },
    {
      message: "Custom validation failed",
    }
  );

type RegistryResponse = {
  success: boolean;
  data?: any; // Replace 'any' with your specific type
  error?: string;
  details?: unknown;
};

export async function updateRegistry(data: any): Promise<RegistryResponse> {
  console.log("Received data:", data); // Debugging line
  try {
    const validatedData = registrySchema.parse(data);
    const { contacted, comments, patientId, registeredBy } = validatedData;

    const result = await prisma.$transaction(async (tx) => {
      // Find the most recent registry
      const registry = await tx.registry.findFirst({
        where: { patientId },
        include: { patient: true },
        orderBy: { createdAt: "desc" },
      });

      if (!registry) {
        throw new Error("Registry not found");
      }

      // Update the registry
      const updatedRegistry = await tx.registry.update({
        where: { id: registry.id },
        data: {
          contacted,
          comments,
          contactDate: contacted ? new Date() : null,
          registeredBy: {
            connect: {
              id: registeredBy,
            },
          },
        },
      });

      // Create activity
      await tx.activity.create({
        data: {
          type: contacted ? "PATIENT_CONTACTED" : "REGISTRY_UPDATED",
          description: contacted
            ? `Contacted patient: ${registry.patient.name}`
            : `Updated registry for ${registry.patient.name}`,
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
