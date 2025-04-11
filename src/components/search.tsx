"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export function Search() {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!search.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/patients/search?mrn=${encodeURIComponent(search.trim())}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        setSearch("");
        // Navigate to the patient profile
        router.push(`/registry/patient/${data.data.id}`);
      } else {
        toast({
          title: "Patient not found",
          description: "No patient found with this MRN",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error searching for patient:", error);
      toast({
        title: "Error",
        description: "Failed to search for patient",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full md:w-auto">
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Enter patient MRN..."
        className="pl-8 md:w-[300px]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disabled={isLoading}
      />
    </form>
  );
}
