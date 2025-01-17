import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { mrn: string } }
) {
  try {
    const patient = await prisma.patient.findUnique({
      where: {
        mrn: params.mrn,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { error: "Error fetching patient" },
      { status: 500 }
    );
  }
}
