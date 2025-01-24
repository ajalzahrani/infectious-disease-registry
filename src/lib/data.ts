import { prisma } from "./prisma";

interface Disease {
  value: string;
  label: string;
}

export async function getDiseases(): Promise<Disease[]> {
  // Replace this with your actual database query
  const diseases = await prisma.disease.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return diseases.map((disease) => ({
    value: disease.id,
    label: disease.name,
  }));
}
