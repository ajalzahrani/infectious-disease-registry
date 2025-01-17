import { Suspense } from "react";
import { PatientList } from "@/components/patient-list";

export default function PatientsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patients</h1>
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-24">
            <p className="text-muted-foreground">Loading patients...</p>
          </div>
        }>
        <PatientList />
      </Suspense>
    </div>
  );
}
