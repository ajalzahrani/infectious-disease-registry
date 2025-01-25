import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mrn = searchParams.get("mrn");
  const disease = searchParams.get("disease");
  const status = searchParams.get("status");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  try {
    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          mrn
            ? {
                mrn: { contains: mrn },
              }
            : {},
          disease
            ? {
                registries: {
                  some: {
                    diseaseId: disease,
                  },
                },
              }
            : {},
          status
            ? {
                registries: {
                  some: {
                    contacted: status === "contacted",
                  },
                },
              }
            : {},
          from && to
            ? {
                createdAt: {
                  gte: new Date(from),
                  lte: new Date(to),
                },
              }
            : {},
        ],
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Failed to fetch filtered patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}
