import { prisma } from "@/lib/prisma";
import { RegistryClientWrapper } from "@/app/(auth)/registry/components/registry-client-wrapper";
import { getTodayRegistryPatients } from "@/actions/patients-actions";

export default async function RegistryPage() {
  // Fetch initial data (today's patients)
  const patients = await getTodayRegistryPatients();
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Registry</h1>
      <RegistryClientWrapper initialPatients={patients} />
    </div>
  );
}
