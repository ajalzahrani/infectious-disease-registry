import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const diseases = await prisma.disease.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(diseases);
  } catch (error) {
    console.error("Error fetching diseases:", error);
    return NextResponse.json(
      { error: "Error fetching diseases" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const disease = await prisma.disease.create({
      data: json,
    });
    return NextResponse.json(disease);
  } catch (error) {
    console.error("Error creating disease:", error);
    return NextResponse.json(
      { error: "Error creating disease" },
      { status: 500 }
    );
  }
}
