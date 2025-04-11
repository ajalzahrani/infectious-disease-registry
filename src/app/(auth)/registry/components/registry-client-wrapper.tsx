"use client";

import { useState } from "react";
import { RegistryFilters } from "./registry-filters";
import { RegistryList } from "./registry-list";
import { Patient, Registry, Disease } from "@prisma/client";

// Define the RegistryFilters interface to match the one in registry-filters.tsx
interface RegistryFilters {
  mrn: string;
  disease: string;
  status: string;
  dateRange: { from: Date | undefined; to: Date | undefined };
}

// Define the expected type for RegistryList
interface RegistryListPatient {
  id: string;
  name: string;
  mrn: string;
  registries: {
    disease: { name: string };
    createdAt: Date;
    contacted: boolean;
  }[];
}

// Define the Patient type with included registries
type PatientWithRegistries = Patient & {
  registries: (Registry & {
    disease: Disease;
  })[];
};

interface RegistryClientWrapperProps {
  initialPatients: PatientWithRegistries[];
}

export function RegistryClientWrapper({
  initialPatients,
}: RegistryClientWrapperProps) {
  const [filteredPatients, setFilteredPatients] = useState<
    RegistryListPatient[]
  >(
    initialPatients.map((patient) => ({
      id: patient.id,
      name: patient.name,
      mrn: patient.mrn,
      registries: patient.registries.map((registry) => ({
        disease: { name: registry.disease.name },
        createdAt: registry.createdAt,
        contacted: registry.contacted,
      })),
    }))
  );

  const handleFilter = async (filters: RegistryFilters) => {
    const queryParams = new URLSearchParams();
    if (filters.mrn) queryParams.append("mrn", filters.mrn);
    if (filters.disease) queryParams.append("disease", filters.disease);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.dateRange?.from)
      queryParams.append("from", filters.dateRange.from.toISOString());
    if (filters.dateRange?.to)
      queryParams.append("to", filters.dateRange.to.toISOString());

    const response = await fetch(`/api/patients/filter?${queryParams}`);
    const result = await response.json();

    if (result.success) {
      // Transform the API response to match the RegistryListPatient type
      const transformedPatients: RegistryListPatient[] = result.data.map(
        (patient: PatientWithRegistries) => ({
          id: patient.id,
          name: patient.name,
          mrn: patient.mrn,
          registries: patient.registries.map((registry) => ({
            disease: { name: registry.disease.name },
            createdAt: new Date(registry.createdAt),
            contacted: registry.contacted,
          })),
        })
      );

      setFilteredPatients(transformedPatients);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      <aside>
        <RegistryFilters onFilter={handleFilter} />
      </aside>
      <main>
        <RegistryList patients={filteredPatients} />
      </main>
    </div>
  );
}
