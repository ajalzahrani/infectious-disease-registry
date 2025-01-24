import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { mrn: string } }
) {
  const mrn = context.params.mrn;

  if (!mrn) {
    return NextResponse.json({ error: "MRN is required" }, { status: 400 });
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: {
        mrn,
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
