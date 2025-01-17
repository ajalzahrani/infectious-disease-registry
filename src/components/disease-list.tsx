"use client";

import { useDiseases } from "@/hooks/use-diseases";

export function DiseaseList() {
  const { diseases, isLoading } = useDiseases();

  if (isLoading) {
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
      {diseases.map((disease) => (
        <div
          key={disease.id}
          className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
          <h2 className="text-lg font-semibold">{disease.name}</h2>
          <p className="text-sm text-muted-foreground">{disease.description}</p>
        </div>
      ))}
    </div>
  );
}
