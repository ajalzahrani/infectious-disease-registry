import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'

interface RelativesListProps {
  patientId: string
}

export function RelativesList({ patientId }: RelativesListProps) {
  // In a real application, you would fetch relatives data based on the patientId
  const relatives = [
    { id: 1, name: "Jane Doe", relation: "Spouse", contactInfo: "jane.doe@example.com", address: "123 Main St, Anytown, USA" },
    { id: 2, name: "Mike Doe", relation: "Son", contactInfo: "mike.doe@example.com", address: "456 Elm St, Anytown, USA" },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Relatives</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Relative
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Relation</TableHead>
            <TableHead>Contact Information</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {relatives.map((relative) => (
            <TableRow key={relative.id}>
              <TableCell>{relative.name}</TableCell>
              <TableCell>{relative.relation}</TableCell>
              <TableCell>{relative.contactInfo}</TableCell>
              <TableCell>{relative.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

