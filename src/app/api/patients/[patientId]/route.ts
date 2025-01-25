import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { patientId } = await request.json();
  // const patientId = context.params.patientId;

  if (!patientId) {
    return NextResponse.json(
      { error: "Patient ID is required" },
      { status: 400 }
    );
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
      include: {
        registries: {
          include: {
            disease: true,
            registeredBy: true,
          },
        },
        relatives: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ patient });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient" },
      { status: 500 }
    );
  }
}
