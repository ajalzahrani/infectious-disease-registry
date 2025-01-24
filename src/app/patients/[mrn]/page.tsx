import { PatientInfo } from "@/components/patient-info";
import { DiseaseList } from "@/components/disease-list";
import { RelativesList } from "@/components/relatives-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";

interface PatientProfilePageProps {
  params: {
    mrn: string;
  };
}

export default async function PatientProfilePage({
  params,
}: PatientProfilePageProps) {
  // Get the patient data first to get the patientId
  const patient = await prisma.patient.findUnique({
    where: {
      mrn: params.mrn,
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
  );
}
