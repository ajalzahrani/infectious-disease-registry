import { Suspense } from "react";
import { EditDiseaseForm } from "../components/edit-disease-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditDiseasePage({
  params,
}: {
  params: Promise<{ diseaseId: string }>;
}) {
  const diseaseId = (await params).diseaseId;
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center space-x-4">
        <h1 className="text-3xl font-bold">Diseases</h1>
        <Link href="/diseases">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Edit Disease</h2>
          <EditDiseaseForm diseaseId={diseaseId} />
        </div>
      </div>
    </div>
  );
}
