"use client";

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

interface RegistryListProps {
  patients: {
    id: string;
    name: string;
    mrn: string;
    registries: {
      disease: { name: string };
      createdAt: Date;
      contacted: boolean;
    }[];
  }[];
}

export function RegistryList({ patients }: RegistryListProps) {
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
          {patients?.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.mrn}</TableCell>
              <TableCell>{patient.registries[0].disease.name}</TableCell>
              <TableCell>
                {new Date(patient.registries[0].createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {patient.registries[0].contacted
                  ? "Contacted"
                  : "Not Contacted"}
              </TableCell>
              <TableCell>
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/registry/patient/${patient.id}`}>
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
