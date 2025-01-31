import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Disease } from "@prisma/client";
import {
  getDiseases,
  createDisease,
  updateDisease,
  deleteDisease,
  getDiseaseById,
  getDiseasesOptions,
} from "@/actions/diseases-actions";

export function useDiseases() {
  const queryClient = useQueryClient();

  const {
    data: diseases,
    isLoading: isLoadingDiseases,
    error: errorDiseases,
  } = useQuery<Disease[]>({
    queryKey: ["diseases"],
    queryFn: async () => {
      const response = await getDiseases();
      return response;
    },
  });

  const { data: diseasesOptions } = useQuery<Partial<Disease>[]>({
    queryKey: ["diseasesOptions"],
    queryFn: async () => {
      const response = await getDiseasesOptions();
      return response;
    },
  });

  const { mutate: createDiseaseMutation, isPending: isLoadingCreateDisease } =
    useMutation({
      mutationFn: async (newDisease: Partial<Disease>) => {
        const response = await createDisease(newDisease as Disease);
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["diseases"] });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to add disease. Please try again.",
          variant: "destructive",
        });
      },
    });

  const { mutate: updateDiseaseMutation, isPending: isLoadingUpdateDisease } =
    useMutation({
      mutationFn: async (disease: Disease) => {
        const response = await updateDisease(disease);
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["diseases"] });
      },
    });

  return {
    diseases,
    diseasesOptions,
    isLoadingDiseases,
    errorDiseases,
    createDisease: createDiseaseMutation,
    isLoadingCreateDisease,
    updateDisease: updateDiseaseMutation,
    isLoadingUpdateDisease,
    queryClient,
  };
}
