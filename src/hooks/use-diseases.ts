import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Disease } from "@prisma/client";

export function useDiseases() {
  const queryClient = useQueryClient();

  const {
    data: diseases,
    isLoading,
    error,
  } = useQuery<Disease[]>({
    queryKey: ["diseases"],
    queryFn: async () => {
      const response = await fetch("/api/diseases");
      if (!response.ok) {
        throw new Error("Failed to fetch diseases");
      }
      return response.json();
    },
  });

  const createDisease = useMutation({
    mutationFn: async (newDisease: Partial<Disease>) => {
      const response = await fetch("/api/diseases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDisease),
      });
      if (!response.ok) {
        throw new Error("Failed to create disease");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diseases"] });
    },
  });

  return {
    diseases,
    isLoading,
    error,
    createDisease: createDisease.mutate,
  };
}
