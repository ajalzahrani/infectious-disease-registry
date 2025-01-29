import { prisma } from "@/lib/prisma";
import { RegistryClientWrapper } from "@/components/registry-client-wrapper";

export default async function RegistryPage() {
  // Fetch initial data (today's patients)
  const today = new Date();
  const patients = await prisma.patient.findMany({
    include: {
      registries: {
        include: {
          disease: true,
          registeredBy: true,
        },
      },
      relatives: true,
    },
    where: {
      createdAt: {
        gte: new Date(today.setHours(0, 0, 0, 0)),
        lt: new Date(today.setHours(23, 59, 59, 999)),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Registry</h1>
      <RegistryClientWrapper initialPatients={patients} />
    </div>
  );
}
