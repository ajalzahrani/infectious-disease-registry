import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Patient, Relative } from "@prisma/client";
import { toast } from "@/hooks/use-toast";
import {
  createPatient,
  getPatients,
  updatePatient,
} from "@/actions/patients-actions";
import { createRelative, getRelatives } from "@/actions/relatives-actions";

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
      const response = await getPatients();
      if (!response) {
        throw new Error("Failed to fetch patients");
      }
      return response;
    },
  });

  const { mutate: createPatientMutation, isPending: isLoadingCreatePatient } =
    useMutation({
      mutationFn: async (newPatient: Partial<Patient>) => {
        const response = await createPatient(newPatient);
        if (!response.success) {
          throw new Error(response.error || "Failed to create patient");
        }
        return response.data;
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

  const { mutate: updatePatientMutation, isPending: isLoadingUpdatePatient } =
    useMutation({
      mutationFn: async (patient: Patient) => {
        const response = await updatePatient(patient);
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["patients"] });
      },
    });

  const { mutate: createRelativeMutation, isPending: isLoadingCreateRelative } =
    useMutation({
      mutationFn: async (relative: Partial<Relative>) => {
        const response = await createRelative(relative);
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["relatives"] });
      },
    });

  return {
    patients,
    isLoading,
    error,
    createPatient: createPatientMutation,
    isLoadingCreatePatient,
    updatePatient: updatePatientMutation,
    isLoadingUpdatePatient,
    queryClient,
    createRelative: createRelativeMutation,
    isLoadingCreateRelative,
  };
}
