import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Phone } from 'lucide-react'

interface DiseaseListProps {
  patientId: string
}

export function DiseaseList({ patientId }: DiseaseListProps) {
  // In a real application, you would fetch disease data based on the patientId
  const diseases = [
    { id: 1, name: "COVID-19", status: "Contacted", dateRegistered: "2023-06-01", callStatus: "Completed" },
    { id: 2, name: "Influenza", status: "Not Contacted", dateRegistered: "2023-06-05", callStatus: "Pending" },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Diseases</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Disease
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Disease Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Registered</TableHead>
            <TableHead>Call Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {diseases.map((disease) => (
            <TableRow key={disease.id}>
              <TableCell>{disease.name}</TableCell>
              <TableCell>{disease.status}</TableCell>
              <TableCell>{disease.dateRegistered}</TableCell>
              <TableCell>{disease.callStatus}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline">
                  <Phone className="mr-2 h-4 w-4" /> Update Status
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

