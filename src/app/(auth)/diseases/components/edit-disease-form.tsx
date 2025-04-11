"use client";

import { useRouter } from "next/navigation";
import { useDiseases } from "@/app/(auth)/diseases/hooks/use-diseases";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getDiseaseById } from "@/actions/diseases-actions";
import { Disease } from "@prisma/client";

interface FormData {
  name: string;
  description: string;
}

export function EditDiseaseForm({ diseaseId }: { diseaseId: string }) {
  const router = useRouter();
  const { updateDisease, isLoadingUpdateDisease } = useDiseases();
  const { data: disease, isLoading: isLoadingDisease } =
    useQuery<Disease | null>({
      queryKey: ["disease", diseaseId],
      queryFn: () => getDiseaseById(diseaseId),
      enabled: !!diseaseId, // Only run the query if diseaseId is truthy
    });

  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: disease?.name || "",
      description: disease?.description || "",
    },
  });

  // Reset form values when disease data is loaded
  React.useEffect(() => {
    if (disease) {
      reset({
        name: disease.name,
        description: disease.description,
      });
    }
  }, [disease, reset]);

  const onSubmit = (data: FormData) => {
    try {
      updateDisease({ ...data, id: diseaseId });
      toast({
        title: "Success",
        description: "Disease has been updated successfully.",
      });
      router.push("/diseases");
    } catch {
      toast({
        title: "Error",
        description: "Failed to update disease. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingDisease) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Disease Name
        </label>
        <Input
          id="name"
          {...register("name", { required: true })}
          placeholder="Enter disease name"
          disabled={isLoadingUpdateDisease}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          {...register("description", { required: true })}
          placeholder="Enter disease description"
          disabled={isLoadingUpdateDisease}
          rows={5}
          cols={50}
        />
      </div>
      <Button type="submit" disabled={isLoadingUpdateDisease}>
        {isLoadingUpdateDisease ? "Updating..." : "Update Disease"}
      </Button>
    </form>
  );
}
