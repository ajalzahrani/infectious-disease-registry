import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const { contacted, comments } = await request.json();
    const patientId = params.patientId;

    // Find the most recent registry for the patient
    const registry = await prisma.registry.findFirst({
      where: {
        patientId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!registry) {
      return NextResponse.json(
        { error: "Registry not found" },
        { status: 404 }
      );
    }

    // Update the registry
    const updatedRegistry = await prisma.registry.update({
      where: {
        id: registry.id,
      },
      data: {
        contacted,
        comments,
        contactDate: contacted ? new Date() : null,
      },
    });

    return NextResponse.json(updatedRegistry);
  } catch (error) {
    console.error("Error updating registry:", error);
    return NextResponse.json(
      { error: "Failed to update registry" },
      { status: 500 }
    );
  }
}
