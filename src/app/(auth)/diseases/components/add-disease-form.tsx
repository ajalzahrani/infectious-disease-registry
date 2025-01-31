"use client";

import { useDiseases } from "@/app/(auth)/diseases/hooks/use-diseases";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export function AddDiseaseForm() {
  const { createDisease, isLoadingCreateDisease } = useDiseases();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    try {
      createDisease({ name, description });
      toast({
        title: "Success",
        description: "Disease has been added successfully.",
      });
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add disease. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Disease Name
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Enter disease name"
          required
          disabled={isLoadingCreateDisease}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter disease description"
          required
          disabled={isLoadingCreateDisease}
        />
      </div>
      <Button type="submit" disabled={isLoadingCreateDisease}>
        {isLoadingCreateDisease ? "Adding..." : "Add Disease"}
      </Button>
    </form>
  );
}
