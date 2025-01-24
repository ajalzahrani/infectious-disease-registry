import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Patient } from "@prisma/client";

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
      if (!response.ok) {
        throw new Error("Failed to create patient");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (error) => {
      console.error("Error creating patient:", error);
    },
  });

  return {
    patients,
    isLoading,
    error,
    createPatient: createPatient.mutate,
  };
}
