import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PUT(
  request: Request,
  props: { params: Promise<{ patientId: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contacted, comments } = await request.json();
    const patientId = params.patientId;

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
          contactDate: contacted ? new Date() : null,
          registeredBy: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });

      // Add comment if provided
      if (comments && comments.trim().length > 0) {
        await tx.registryComment.create({
          data: {
            registryId: registry.id,
            comment: comments,
            userId: session.user.id,
          },
        });
      }

      // Create activity
      await tx.activity.create({
        data: {
          type: contacted ? "PATIENT_CONTACTED" : "REGISTRY_UPDATED",
          description: contacted
            ? `Contacted patient: ${registry.patient.name}`
            : `Updated registry for ${registry.patient.name}`,
          patientId,
          userId: session.user.id,
        },
      });

      return updatedRegistry;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating registry:", error);
    return NextResponse.json(
      { error: "Failed to update registry" },
      { status: 500 }
    );
  }
}
