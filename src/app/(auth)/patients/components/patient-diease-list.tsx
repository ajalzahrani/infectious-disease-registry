"use client";

import { Disease } from "@prisma/client";
import { getDiseasesByPatientId } from "@/actions/diseases-actions";
import { useQuery } from "@tanstack/react-query";

export function PatientDiseaseList({ patientId }: { patientId: string }) {
  const { data: diseases, isLoading: isLoadingDiseases } = useQuery({
    queryKey: ["diseasesByPatientId", patientId],
    queryFn: async () => {
      const response = await getDiseasesByPatientId(patientId);
      return response;
    },
  });

  if (isLoadingDiseases) {
    return (
      <div className="flex items-center justify-center h-24">
        <p className="text-muted-foreground">Loading diseases...</p>
      </div>
    );
  }

  if (!diseases?.length) {
    return (
      <div className="flex items-center justify-center h-24">
        <p className="text-muted-foreground">No diseases found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {diseases?.map((disease: Disease) => (
        <div
          key={disease.id}
          className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{disease.name}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}
