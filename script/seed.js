import { PrismaClient } from "@prisma/client";
import pkg from "bcryptjs";
const { hash } = pkg;

const prisma = new PrismaClient();

async function main() {
  // Clear existing users
  await prisma.user.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.disease.deleteMany({});

  const users = [
    {
      email: "admin@example.com",
      name: "Admin User",
      username: "admin",
      password: await hash("123456", 12),
      role: "ADMIN",
    },
    {
      email: "labdoctor@example.com",
      name: "Lab Doctor",
      username: "labdoctor",
      password: await hash("123456", 12),
      role: "LAB_DOCTOR",
    },
    {
      email: "infectiousdoctor@example.com",
      name: "Infectious Disease Doctor",
      username: "inficdoc",
      password: await hash("123456", 12),
      role: "INFECTIOUS_DOCTOR",
    },
  ];

  const diseases = [
    {
      name: "COVID-19",
      description:
        "COVID-19 is a respiratory disease caused by the SARS-CoV-2 virus.",
    },
    {
      name: "Influenza",
      description:
        "Influenza is a respiratory disease caused by the influenza virus.",
    },
    {
      name: "Tuberculosis",
      description:
        "Tuberculosis is a respiratory disease caused by the tuberculosis bacillus.",
    },
    {
      name: "Malaria",
      description:
        "Malaria is a parasitic disease caused by the Plasmodium parasite.",
    },
    {
      name: "Hepatitis",
      description: "Hepatitis is a viral disease that attacks the liver.",
    },
    {
      name: "Dengue Fever",
      description:
        "Dengue Fever is a viral disease caused by the dengue virus.",
    },
  ];

  for (const disease of diseases) {
    await prisma.disease.create({
      data: disease,
    });
  }

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
