import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PatientInfoProps {
  patientId: string
}

export function PatientInfo({ patientId }: PatientInfoProps) {
  // In a real application, you would fetch patient data based on the patientId
  const patient = {
    mrn: "MRN001",
    name: "John Doe",
    age: 35,
    gender: "Male",
    contactInfo: "john.doe@example.com",
    address: "123 Main St, Anytown, USA",
  }

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
            <p className="text-sm text-muted-foreground">{patient.contactInfo}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Address</p>
            <p className="text-sm text-muted-foreground">{patient.address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

