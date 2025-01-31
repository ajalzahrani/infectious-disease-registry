"use server";
import { prisma } from "@/lib/prisma";
import { Disease } from "@prisma/client";

interface DiseaseOption {
  value: string;
  label: string;
}

export async function getDiseasesOptions(): Promise<Partial<Disease>[]> {
  // Replace this with your actual database query
  const diseases = await prisma.disease.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return diseases;
}

export async function getDiseases(): Promise<Disease[]> {
  const diseases = await prisma.disease.findMany();
  return diseases;
}

export async function getDiseaseById(id: string): Promise<Disease | null> {
  const disease = await prisma.disease.findUnique({
    where: { id },
  });
  return disease;
}

export async function getDiseasesByPatientId(
  patientId: string
): Promise<Disease[]> {
  const diseases = await prisma.disease.findMany({
    where: {
      registries: {
        some: { patientId: patientId },
      },
    },
  });
  return diseases;
}

export async function createDisease(disease: Disease): Promise<Disease> {
  const newDisease = await prisma.disease.create({
    data: disease,
  });
  return newDisease;
}

export async function updateDisease(disease: Disease): Promise<Disease> {
  const updatedDisease = await prisma.disease.update({
    where: { id: disease.id },
    data: disease,
  });
  return updatedDisease;
}

export async function deleteDisease(id: string): Promise<void> {
  await prisma.disease.delete({
    where: { id },
  });
}
