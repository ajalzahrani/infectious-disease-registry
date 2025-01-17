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
    const patient = await prisma.patient.create({
      data: json,
      include: {
        registries: true,
        relatives: true,
      },
    });
    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { error: "Error creating patient" },
      { status: 500 }
    );
  }
}
