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
    const diseases = await prisma.disease.findMany({
      where: {
        registries: {
          some: {
            patientId,
          },
        },
      },
    });

    return NextResponse.json({ diseases });
  } catch (error) {
    console.error("Error fetching diseases:", error);
    return NextResponse.json(
      { error: "Failed to fetch diseases" },
      { status: 500 }
    );
  }
}
