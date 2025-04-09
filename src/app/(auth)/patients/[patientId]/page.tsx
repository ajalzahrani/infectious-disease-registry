import { PatientInfo } from "@/app/(auth)/patients/components/patient-info";
import { RelativesList } from "@/app/(auth)/patients/components/relatives-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { PatientRegistry } from "@/app/(auth)/registry/components/patient-registry-form";
import { PatientDiseaseList } from "../components/patient-diease-list";
import { RegistryUpdates } from "@/app/(auth)/registry/components/registry-updates";

interface PatientProfilePageProps {
  params: {
    patientId: string;
  };
}

export default async function PatientProfilePage({
  params,
}: PatientProfilePageProps) {
  const { patientId } = await params;

  const patient = await prisma.patient.findUnique({
    where: {
      id: patientId,
    },
    include: {
      registries: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        include: {
          comments: {
            include: {
              createdBy: {
                select: {
                  name: true,
                },
              },
            },
          },
          updates: {
            include: {
              updatedBy: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
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
              <TabsTrigger value="updates">Registry Updates</TabsTrigger>
            </TabsList>
            <TabsContent value="diseases">
              <PatientDiseaseList patientId={patient.id} />
            </TabsContent>
            <TabsContent value="relatives">
              <RelativesList patientId={patient.id} />
            </TabsContent>
            <TabsContent value="updates">
              <RegistryUpdates
                updates={patient.registries[0].updates}
                comments={patient.registries[0].comments}
              />
            </TabsContent>
          </Tabs>
        </div>
        <div className="space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Registry Status</h3>
              <PatientRegistry
                patientId={patient.id}
                initialRegistry={{
                  id: patient.registries[0].id,
                  contacted: patient.registries[0].contacted,
                  isClosed: patient.registries[0].isClosed,
                  comments: patient.registries[0].comments[0]?.comment,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
