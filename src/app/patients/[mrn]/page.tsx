import { PatientInfo } from "@/components/patient-info";
import { DiseaseList } from "@/components/disease-list";
import { RelativesList } from "@/components/relatives-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { PatientRegistry } from "@/components/patient-registry-form";

interface PatientProfilePageProps {
  params: {
    mrn: string;
  };
}

export default async function PatientProfilePage({
  params,
}: PatientProfilePageProps) {
  const patient = await prisma.patient.findUnique({
    where: {
      mrn: params.mrn,
    },
    include: {
      registries: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!patient) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Patient Not Found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Patient Profile</h1>
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <PatientInfo patientId={patient.id} />
          <Tabs defaultValue="diseases" className="mt-6">
            <TabsList>
              <TabsTrigger value="diseases">Diseases</TabsTrigger>
              <TabsTrigger value="relatives">Relatives</TabsTrigger>
            </TabsList>
            <TabsContent value="diseases">
              <DiseaseList patientId={patient.id} />
            </TabsContent>
            <TabsContent value="relatives">
              <RelativesList patientId={patient.id} />
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Registry Status</h3>
              <PatientRegistry
                patientId={patient.id}
                initialRegistry={{
                  id: patient.registries[0].id,
                  contacted: patient.registries[0].contacted,
                  comments: patient.registries[0].comments || undefined,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
