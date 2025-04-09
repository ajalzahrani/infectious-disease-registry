import { PrismaClient } from "@prisma/client";
import { createPatient } from "../src/actions/patients-actions";

const prisma = new PrismaClient();

function randomizeArray<T>(array: T[], count: number): T[] {
  return array.sort(() => Math.random() - 0.5).slice(0, count);
}

function randomizeName(): string {
  return `${Math.random().toString(36).substring(2, 15)} ${Math.random()
    .toString(36)
    .substring(2, 15)}`;
}

function randomizePhone(): string {
  return `+20${Math.floor(Math.random() * 1000000000000)}`;
}

function randomizeMRN(): string {
  return Math.floor(Math.random() * 1000000000000).toString();
}

async function registerPatient(): Promise<void> {
  const diseases = await prisma.disease.findMany();
  const diseasesToRegister = randomizeArray(diseases, 2);
  const registeredBy = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
  });

  try {
    const patient = await createPatient({
      name: randomizeName(),
      age: Math.floor(Math.random() * 100),
      gender: "MALE",
      contactInfo: randomizePhone(),
      diseases: diseasesToRegister.map((disease) => disease.id),
      registeredBy: registeredBy?.id,
      mrn: randomizeMRN(),
    });

    console.log("Patient registered:", patient);
  } catch (error) {
    console.error("Error registering patient:", error);
  } finally {
    await prisma.$disconnect();
  }
}

registerPatient();
