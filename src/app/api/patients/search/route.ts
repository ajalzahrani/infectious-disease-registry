import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mrn = searchParams.get("mrn");

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
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: patient });
  } catch (error) {
    console.error("Error searching for patient:", error);
    return NextResponse.json(
      { error: "Failed to search for patient" },
      { status: 500 }
    );
  }
}
