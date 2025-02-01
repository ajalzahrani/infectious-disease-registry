import { PrismaClient } from "@prisma/client";
import pkg from "bcryptjs";
const { hash } = pkg;

const prisma = new PrismaClient();

async function main() {
  // Clear existing users
  await prisma.user.deleteMany({});

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
