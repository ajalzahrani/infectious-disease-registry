import { PatientInfo } from "@/components/patient-info"
import { DiseaseList } from "@/components/disease-list"
import { RelativesList } from "@/components/relatives-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PatientProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Patient Profile</h1>
      <PatientInfo patientId={params.id} />
      <Tabs defaultValue="diseases" className="mt-6">
        <TabsList>
          <TabsTrigger value="diseases">Diseases</TabsTrigger>
          <TabsTrigger value="relatives">Relatives</TabsTrigger>
        </TabsList>
        <TabsContent value="diseases">
          <DiseaseList patientId={params.id} />
        </TabsContent>
        <TabsContent value="relatives">
          <RelativesList patientId={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

