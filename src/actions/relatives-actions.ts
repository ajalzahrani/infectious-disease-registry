"use server";

import { prisma } from "@/lib/prisma";
import { Relative } from "@prisma/client";
import { z } from "zod";

const relativeSchema = z.object({
  relativeName: z.string().min(1, "Name is required"),
  relation: z.string().min(1, "Relationship is required"),
  relativeContact: z.string().min(1, "Contact information is required"),
  patientId: z.string().min(1, "Patient ID is required"),
});

export async function createRelative(relative: Partial<Relative>) {
  const rawData = {
    relativeName: relative.relativeName,
    relation: relative.relation,
    relativeContact: relative.relativeContact,
    patientId: relative.patientId,
  };

  try {
    // Validate the data
    const validatedData = relativeSchema.parse(rawData);
    console.log(validatedData);
    const patientId = validatedData.patientId;

    const relative = await prisma.relative.create({
      data: {
        ...validatedData,
        patientId: patientId,
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

    return { success: true, data: relative };
  } catch (error) {
    console.error("Error creating relative:", error);
    return { success: false, error: "Failed to create relative" };
  }
}

export async function getRelatives(patientId: string): Promise<Relative[]> {
  try {
    const relatives = await prisma.relative.findMany({
      where: { patientId },
      include: {
        patient: {
          select: {
            name: true,
            mrn: true,
          },
        },
      },
    });
    return relatives;
  } catch (error) {
    console.error("Error fetching relatives:", error);
    return [];
  }
}
