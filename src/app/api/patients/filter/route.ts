import { getFilteredPatients } from "@/actions/patients-actions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mrn = searchParams.get("mrn");
  const disease = searchParams.get("disease");
  const status = searchParams.get("status");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const result = await getFilteredPatients({
    mrn: mrn || undefined,
    disease: disease || undefined,
    status: status || undefined,
    from: from || undefined,
    to: to || undefined,
  });

  if (result.success) {
    return NextResponse.json(result.data);
  } else {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
}
