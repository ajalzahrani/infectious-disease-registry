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
import { RelativeForm } from "@/app/(auth)/registry/patient/components/relative-form";
import { Relative } from "@prisma/client";
import { getRelatives } from "@/actions/relatives-actions";
import { useQuery } from "@tanstack/react-query";

interface RelativesListProps {
  patientId: string;
}

export function RelativesList({ patientId }: RelativesListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: relatives, isLoading: isLoadingRelatives } = useQuery<
    Relative[]
  >({
    queryKey: ["relatives", patientId],
    queryFn: () => getRelatives(patientId),
    enabled: !!patientId, // Only run the query if patientId is truthy
  });

  if (isLoadingRelatives) {
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
