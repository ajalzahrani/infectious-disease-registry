"use client";

import { usePatients } from "@/hooks/use-patients";

export function PatientList() {
  const { patients, isLoading } = usePatients();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <p className="text-muted-foreground">Loading patients...</p>
      </div>
    );
  }

  if (!patients?.length) {
    return (
      <div className="flex items-center justify-center h-24">
        <p className="text-muted-foreground">No patients found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {patients.map((patient: any) => (
        <div
          key={patient.id}
          className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
          <h2 className="text-lg font-semibold">{patient.name}</h2>
          <p className="text-sm text-muted-foreground">MRN: {patient.mrn}</p>
        </div>
      ))}
    </div>
  );
}
