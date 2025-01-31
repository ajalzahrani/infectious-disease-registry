import { Suspense } from "react";
import { DiseaseList } from "@/app/(auth)/diseases/components/list-disease";
import { AddDiseaseForm } from "@/app/(auth)/diseases/components/add-disease-form";

export default function DiseasesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Diseases</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Disease</h2>
          <AddDiseaseForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Disease List</h2>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-24">
                <p className="text-muted-foreground">Loading diseases...</p>
              </div>
            }>
            <DiseaseList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
