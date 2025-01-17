import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        registries: {
          include: {
            disease: true,
            registeredBy: true,
          },
        },
        relatives: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Error fetching patients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { diseases, ...patientData } = json;

    if (!diseases || !Array.isArray(diseases)) {
      return NextResponse.json(
        { error: "Diseases array is required" },
        { status: 400 }
      );
    }

    // Create the patient with registries in a transaction
    const patient = await prisma.$transaction(async (tx) => {
      // First create the patient
      const newPatient = await tx.patient.create({
        data: {
          ...patientData,
          registries: {
            create: diseases.map((diseaseId: string) => ({
              disease: {
                connect: { id: diseaseId },
              },
              registeredBy: {
                connect: { id: "1" },
              },
              contacted: false,
            })),
          },
        },
        include: {
          registries: {
            include: {
              disease: true,
              registeredBy: true,
            },
          },
        },
      });
      return newPatient;
    });

    return NextResponse.json(patient);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error creating patient:", errorMessage);

    return NextResponse.json(
      { error: `Failed to create patient: ${errorMessage}` },
      { status: 500 }
    );
  }
}
