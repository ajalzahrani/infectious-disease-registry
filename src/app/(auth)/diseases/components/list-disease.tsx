"use client";

import { useRouter } from "next/navigation";
import { Disease } from "@prisma/client";
import { useDiseases } from "@/app/(auth)/diseases/hooks/use-diseases";

import { Pencil, Trash, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteDisease } from "@/actions/diseases-actions";

export function DiseaseList() {
  const router = useRouter();
  const { diseases, isLoadingDiseases, queryClient } = useDiseases();

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

  function handleEdit(disease: Disease) {
    router.push(`/diseases/${disease.id}`);
  }

  function handleDelete(diseaseId: string) {
    deleteDisease(diseaseId);
    queryClient.invalidateQueries({ queryKey: ["diseases"] });
  }

  return (
    <div className="space-y-4">
      {diseases?.map((disease: Disease) => (
        <div
          key={disease.id}
          className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{disease.name}</h2>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => handleEdit(disease)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleDelete(disease.id)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{disease.description}</p>
        </div>
      ))}
    </div>
  );
}
