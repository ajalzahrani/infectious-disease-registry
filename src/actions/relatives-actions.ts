"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const relativeSchema = z.object({
  relativeName: z.string().min(1, "Name is required"),
  relation: z.string().min(1, "Relationship is required"),
  relativeContact: z.string().min(1, "Contact information is required"),
});

export async function createRelative(patientId: string, formData: FormData) {
  const rawData = {
    relativeName: formData.get("name") as string,
    relation: formData.get("relationship") as string,
    relativeContact: formData.get("phone") as string,
  };

  try {
    // Validate the data
    const validatedData = relativeSchema.parse(rawData);

    const relative = await prisma.relative.create({
      data: {
        ...validatedData,
        patientId,
      },
    });

    return { success: true, data: relative };
  } catch (error) {
    console.error("Error creating relative:", error);
    return { success: false, error: "Failed to create relative" };
  }
}

export async function getRelatives(patientId: string) {
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
    return { success: true, data: relatives };
  } catch (error) {
    console.error("Error fetching relatives:", error);
    return { success: false, error: "Failed to fetch relatives" };
  }
}
