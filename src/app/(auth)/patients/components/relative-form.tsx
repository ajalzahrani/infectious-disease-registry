"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { usePatients } from "@/hooks/use-patients";

// Define the validation schema
const relativeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  phone: z.string().min(1, "Phone number is required"),
});

type RelativeFormValues = z.infer<typeof relativeSchema>;

interface RelativeFormProps {
  patientId: string;
  onCancel: () => void;
}

export function RelativeForm({ patientId, onCancel }: RelativeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { createRelative, isLoadingCreateRelative } = usePatients();
  const form = useForm<RelativeFormValues>({
    resolver: zodResolver(relativeSchema),
    defaultValues: {
      name: "",
      relationship: "",
      phone: "",
    },
  });

  const handleSubmit = async (data: RelativeFormValues) => {
    setIsLoading(true);
    try {
      createRelative({
        patientId,
        relativeName: data.name,
        relation: data.relationship,
        relativeContact: data.phone,
      });
      form.reset();
      onCancel();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Relative's name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Parent, Sibling" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} type="tel" placeholder="Phone number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Add Relative
          </Button>
        </div>
      </form>
    </Form>
  );
}
