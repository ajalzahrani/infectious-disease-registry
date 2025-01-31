"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { useDiseases } from "@/app/(auth)/diseases/hooks/use-diseases";

interface RegistryFiltersProps {
  onFilter: (filters: any) => void;
}

export function RegistryFilters({ onFilter }: RegistryFiltersProps) {
  const { diseases } = useDiseases();
  const [filters, setFilters] = useState({
    mrn: "",
    disease: "",
    status: "",
    dateRange: {
      from: undefined,
      to: undefined,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search by name or MRN"
          value={filters.mrn}
          onChange={(e) => setFilters({ ...filters, mrn: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="disease">Disease</Label>
        <Select
          onValueChange={(value) => setFilters({ ...filters, disease: value })}>
          <SelectTrigger id="disease">
            <SelectValue placeholder="Select disease" />
          </SelectTrigger>
          <SelectContent>
            {diseases?.map((disease) => (
              <SelectItem key={disease.id} value={disease.id}>
                {disease.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="not-contacted">Not Contacted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Date Range</Label>
        <DatePickerWithRange />
      </div>
      <Button type="submit" className="w-full">
        Apply Filters
      </Button>
    </form>
  );
}
