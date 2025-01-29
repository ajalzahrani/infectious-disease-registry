import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create users
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: await bcrypt.hash("password123", 10),
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { username: "labdoctor" },
    update: {},
    create: {
      username: "labdoctor",
      password: await bcrypt.hash("password123", 10),
      role: "LAB_DOCTOR",
    },
  });

  await prisma.user.upsert({
    where: { username: "infectiousdoctor" },
    update: {},
    create: {
      username: "infectiousdoctor",
      password: await bcrypt.hash("password123", 10),
      role: "INFECTIOUS_DOCTOR",
    },
  });

  console.log("Seed completed");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
