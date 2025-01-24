import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const json = await request.json();

    if (!json.patientId) {
      return NextResponse.json(
        { error: "Patient ID is required" },
        { status: 400 }
      );
    }

    const relative = await prisma.relative.create({
      data: {
        relativeName: json.relativeName,
        relation: json.relation,
        relativeContact: json.relativeContact,
        patientId: json.patientId,
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
