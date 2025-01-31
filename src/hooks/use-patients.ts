import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Patient } from "@prisma/client";
import { toast } from "@/hooks/use-toast";

interface PatientWithRelations extends Patient {
  registries: any[];
  relatives: any[];
}

export function usePatients() {
  const queryClient = useQueryClient();

  const {
    data: patients,
    isLoading,
    error,
  } = useQuery<PatientWithRelations[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await fetch("/api/patients");
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      return response.json();
    },
  });

  const createPatient = useMutation({
    mutationFn: async (newPatient: Partial<Patient>) => {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPatient),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create patient");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (error) => {
      console.error("Error creating patient:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    patients,
    isLoading,
    error,
    createPatient: createPatient.mutate,
  };
}
