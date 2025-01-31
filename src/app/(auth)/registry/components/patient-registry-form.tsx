"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateRegistry } from "@/actions/registy-actions";
import { useForm, Controller } from "react-hook-form";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";

interface PatientRegistryProps {
  patientId: string;
  initialRegistry?: {
    id: string;
    contacted: boolean;
    comments?: string;
  };
}

interface FormData {
  contacted: boolean;
  comments: string;
}

export function PatientRegistry({
  patientId,
  initialRegistry,
}: PatientRegistryProps) {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      contacted: initialRegistry?.contacted || false,
      comments: initialRegistry?.comments || "",
    },
  });

  const { data: session } = useSession();

  const onSubmit = async (data: FormData) => {
    try {
      if (!session?.user?.id) {
        throw new Error("User session is not available");
      }

      const response = await updateRegistry({
        patientId,
        registeredBy: session.user.id,
        ...data,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to update registry");
      }

      toast({
        title: "Success",
        description: "Registry updated successfully",
      });

      router.refresh();
    } catch (error) {
      console.error("Error during form submission:", error);

      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update registry",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="contacted">Contact Status</Label>
          <Controller
            name="contacted"
            control={control}
            render={({ field }) => (
              <Switch
                id="contacted"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="comments">Comments</Label>
          <Controller
            name="comments"
            control={control}
            render={({ field }) => (
              <Textarea
                id="comments"
                placeholder="Add your comments here..."
                {...field}
                disabled={isSubmitting}
                className="min-h-[100px]"
              />
            )}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update Registry"}
      </Button>
    </form>
  );
}
