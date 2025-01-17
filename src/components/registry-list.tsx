import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

const registryEntries = [
  {
    id: 1,
    patientName: "John Doe",
    mrn: "MRN001",
    disease: "COVID-19",
    registrationDate: "2023-06-01",
    status: "Contacted",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    mrn: "MRN002",
    disease: "Influenza",
    registrationDate: "2023-06-05",
    status: "Not Contacted",
  },
  {
    id: 3,
    patientName: "Mike Johnson",
    mrn: "MRN003",
    disease: "Tuberculosis",
    registrationDate: "2023-06-10",
    status: "Contacted",
  },
];

export function RegistryList() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>MRN</TableHead>
            <TableHead>Disease</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registryEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.patientName}</TableCell>
              <TableCell>{entry.mrn}</TableCell>
              <TableCell>{entry.disease}</TableCell>
              <TableCell>{entry.registrationDate}</TableCell>
              <TableCell>{entry.status}</TableCell>
              <TableCell>
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/patients/${entry.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
