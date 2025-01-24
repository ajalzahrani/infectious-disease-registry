"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { usePatient } from "@/hooks/use-patient";
import { RelativeForm } from "@/components/relative-form";
import { Relative } from "@prisma/client";

interface RelativesListProps {
  patientId: string;
}

export function RelativesList({ patientId }: RelativesListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { relatives, relativesLoading } = usePatient(patientId);

  if (relativesLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <p className="text-muted-foreground">Loading relatives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Relatives</h3>
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          Add Relative
        </Button>
      </div>

      {relatives && relatives.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Relationship</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relatives.map((relative: Relative) => (
              <TableRow key={relative.id}>
                <TableCell>{relative.relativeName}</TableCell>
                <TableCell>{relative.relation}</TableCell>
                <TableCell>{relative.relativeContact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center h-24">
          <p className="text-muted-foreground">No relatives found.</p>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg">
            <RelativeForm
              patientId={patientId}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
