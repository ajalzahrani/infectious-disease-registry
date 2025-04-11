"use client";

import { useState } from "react";
import { usePatients } from "@/hooks/use-patients";
import { useDiseases } from "@/app/(auth)/diseases/hooks/use-diseases";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { PatientData } from "@/actions/patients-actions";
const patientSchema = z.object({
  mrn: z.string().min(1, "MRN is required"),
  name: z.string().min(1, "Name is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  contactInfo: z.string().min(1, "Contact information is required"),
  diseases: z.array(z.string()).min(1, "At least one disease must be selected"),
});

type PatientFormValues = z.infer<typeof patientSchema>;

export function EntryForm() {
  const [isFetchingMRN, setIsFetchingMRN] = useState(false);
  const { createPatient, isLoadingCreatePatient } = usePatients();
  const { diseasesOptions } = useDiseases();
  const { data: session } = useSession();

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      mrn: "",
      name: "",
      age: "",
      gender: "",
      contactInfo: "",
      diseases: [],
    },
  });

  const fetchPatientByMRN = async (mrn: string) => {
    setIsFetchingMRN(true);
    try {
      const response = await fetch(`/api/patients/mrn/${mrn}`);
      if (response.ok) {
        const data = await response.json();
        form.reset({
          ...data,
          diseases: [],
        });
        toast({
          title: "Patient Found",
          description: "Patient details have been loaded.",
        });
      } else {
        toast({
          title: "Patient Not Found",
          description: "Please enter patient details manually.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch patient details.",
        variant: "destructive",
      });
    } finally {
      setIsFetchingMRN(false);
    }
  };

  const onSubmit = async (data: PatientFormValues) => {
    try {
      const patientData = {
        mrn: data.mrn,
        name: data.name,
        age: parseInt(data.age),
        gender: data.gender,
        contactInfo: data.contactInfo,
        diseases: data.diseases,
        registeredBy: session?.user?.id,
      };

      createPatient(patientData as PatientData);

      toast({
        title: "Success",
        description: "Patient has been registered successfully.",
      });
      form.reset();
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to register patient",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="mrn"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>MRN</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input {...field} placeholder="Enter MRN" maxLength={10} />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => fetchPatientByMRN(field.value)}
                      disabled={!field.value || isFetchingMRN}>
                      {isFetchingMRN && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Fetch
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Patient name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="Patient age" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Information</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Phone number or email"
                    maxLength={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="diseases"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diseases</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    const currentDiseases = field.value || [];
                    if (!currentDiseases.includes(value)) {
                      field.onChange([...currentDiseases, value]);
                    }
                  }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select diseases" />
                  </SelectTrigger>
                  <SelectContent>
                    {diseasesOptions?.map((disease) => (
                      <SelectItem key={disease.id} value={disease.id || ""}>
                        {disease.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              {field.value?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {field.value.map((diseaseId) => {
                    const disease = diseasesOptions?.find(
                      (d) => d.id === diseaseId
                    );
                    return (
                      <div
                        key={diseaseId}
                        className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm">
                        <span>{disease?.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(
                              field.value.filter((id) => id !== diseaseId)
                            );
                          }}
                          className="text-muted-foreground hover:text-foreground">
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoadingCreatePatient}>
          {isLoadingCreatePatient && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Register Patient
        </Button>
      </form>
    </Form>
  );
}
