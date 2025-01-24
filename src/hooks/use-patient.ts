import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Patient, Relative } from "@prisma/client";

interface PatientWithRelations extends Patient {
  registries: any[];
  relatives: any[];
}

const getPatientById = async (patientId: string) => {
  const response = await fetch(`/api/patients/${patientId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch patient");
  }
  const data = await response.json();
  return data.patient;
};

const getDiseasesByPatientId = async (patientId: string) => {
  const response = await fetch(`/api/diseases/${patientId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch diseases");
  }
  const data = await response.json();
  return data.diseases;
};

const createPatient = async (patient: Patient) => {
  const response = await fetch("/api/patients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patient),
  });

  if (!response.ok) {
    throw new Error("Failed to create patient");
  }

  const data = await response.json();
  return data.patient;
};

const getRelativesByPatientId = async (patientId: string) => {
  const response = await fetch(`/api/relatives/${patientId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch relatives");
  }
  const data = await response.json();
  return data.relatives;
};

const createRelative = async (relative: {
  patientId: string;
  relativeName: string;
  relation: string;
  relativeContact: string;
}) => {
  const response = await fetch(`/api/relatives`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(relative),
  });

  if (!response.ok) {
    throw new Error("Failed to create relative");
  }

  const data = await response.json();
  return data.relative;
};

export const usePatient = (patientId: string) => {
  const queryClient = useQueryClient();

  const {
    data: patient,
    isLoading,
    error,
  } = useQuery<PatientWithRelations>({
    queryKey: ["patient", patientId],
    queryFn: () => getPatientById(patientId),
    enabled: !!patientId,
  });

  const { data: diseases, isLoading: diseasesLoading } = useQuery({
    queryKey: ["diseases", patientId],
    queryFn: () => getDiseasesByPatientId(patientId),
    enabled: !!patientId,
  });

  const { mutate: createPatientMutation } = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
    },
  });

  const { data: relatives, isLoading: relativesLoading } = useQuery({
    queryKey: ["relatives", patientId],
    queryFn: () => getRelativesByPatientId(patientId),
    enabled: !!patientId,
  });

  const { mutate: createRelativeMutation } = useMutation({
    mutationFn: createRelative,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relatives", patientId] });
    },
  });

  return {
    patient,
    isLoading,
    error,
    diseases,
    diseasesLoading,
    relatives,
    relativesLoading,
    createPatientMutation,
    createRelativeMutation,
  };
};
