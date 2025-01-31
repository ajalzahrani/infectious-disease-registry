"use client";

import { useState } from "react";
import { RegistryFilters } from "./registry-filters";
import { RegistryList } from "./registry-list";

interface RegistryClientWrapperProps {
  initialPatients: any[]; // Replace 'any' with your Patient type
}

export function RegistryClientWrapper({
  initialPatients,
}: RegistryClientWrapperProps) {
  const [filteredPatients, setFilteredPatients] = useState(initialPatients);

  const handleFilter = async (filters: {
    mrn?: string;
    disease?: string;
    status?: string;
    dateRange?: { from: Date; to: Date };
  }) => {
    const queryParams = new URLSearchParams();
    if (filters.mrn) queryParams.append("mrn", filters.mrn);
    if (filters.disease) queryParams.append("disease", filters.disease);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.dateRange?.from)
      queryParams.append("from", filters.dateRange.from.toISOString());
    if (filters.dateRange?.to)
      queryParams.append("to", filters.dateRange.to.toISOString());

    const response = await fetch(`/api/patients/filter?${queryParams}`);
    const data = await response.json();
    setFilteredPatients(data);
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
