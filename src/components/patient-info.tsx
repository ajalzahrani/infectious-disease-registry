import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

interface PatientInfoProps {
  patientId: string;
}

export async function PatientInfo({ patientId }: PatientInfoProps) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      registries: true,
      relatives: true,
    },
  });

  if (!patient) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">MRN</p>
            <p className="text-sm text-muted-foreground">{patient.mrn}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Name</p>
            <p className="text-sm text-muted-foreground">{patient.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Age</p>
            <p className="text-sm text-muted-foreground">{patient.age}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Gender</p>
            <p className="text-sm text-muted-foreground">{patient.gender}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Contact Information</p>
            <p className="text-sm text-muted-foreground">
              {patient.contactInfo}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Address</p>
            <p className="text-sm text-muted-foreground">
              {patient.address || "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
