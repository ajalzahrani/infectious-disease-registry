import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { patientId: string } }
) {
  const patientId = context.params.patientId;

  if (!patientId) {
    return NextResponse.json(
      { error: "Patient ID is required" },
      { status: 400 }
    );
  }

  try {
    const relatives = await prisma.relative.findMany({
      where: {
        patientId,
      },
      include: {
        patient: {
          select: {
            name: true,
            mrn: true,
          },
        },
      },
    });

    return NextResponse.json({ relatives });
  } catch (error) {
    console.error("Error fetching relatives:", error);
    return NextResponse.json(
      { error: "Failed to fetch relatives" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: { patientId: string } }
) {
  const patientId = context.params.patientId;

  if (!patientId) {
    return NextResponse.json(
      { error: "Patient ID is required" },
      { status: 400 }
    );
  }

  try {
    const json = await request.json();
    const relative = await prisma.relative.create({
      data: {
        ...json,
        patientId,
      },
      include: {
        patient: {
          select: {
            name: true,
            mrn: true,
          },
        },
      },
    });

    return NextResponse.json({ relative });
  } catch (error) {
    console.error("Error creating relative:", error);
    return NextResponse.json(
      { error: "Failed to create relative" },
      { status: 500 }
    );
  }
}
