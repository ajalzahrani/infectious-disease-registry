import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create default user
  const defaultUser = await prisma.user.upsert({
    where: { username: "default" },
    update: {},
    create: {
      id: "default-user-id",
      username: "default",
      role: "ADMIN",
      passwordHash: "default",
    },
  });

  console.log({ defaultUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
