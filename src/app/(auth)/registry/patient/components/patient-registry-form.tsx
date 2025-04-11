"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateRegistry, closeRegistry } from "@/actions/registy-actions";
import { useForm, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";

interface PatientRegistryProps {
  patientId: string;
  initialRegistry?: {
    id: string;
    contacted: boolean;
    comments?: string;
    isClosed: boolean;
    closedBy?: string;
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
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      contacted: initialRegistry?.contacted || false,
    },
  });

  const { data: session } = useSession();
  const [isClosing, setIsClosing] = useState(false);
  const onSubmit = async (data: FormData) => {
    try {
      if (!session?.user?.id) {
        throw new Error("User session is not available");
      }

      // Prepare the data to send, only including comments if it has content
      const submissionData: {
        patientId: string;
        registeredBy: string;
        contacted: boolean;
        comments?: string;
      } = {
        patientId,
        registeredBy: session.user.id,
        contacted: data.contacted,
      };

      // Only add comments if it has content
      if (data.comments && data.comments.trim().length > 0) {
        submissionData.comments = data.comments;
      }

      const response = await updateRegistry(submissionData);

      if (!response.success) {
        throw new Error(response.error || "Failed to update registry");
      }

      // Reset the form after successful submission
      reset({
        contacted: data.contacted, // Keep the contact status
        comments: "", // Clear the comments
      });

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

  const handleClose = async () => {
    if (!session?.user?.id) return;

    try {
      setIsClosing(true);
      if (!initialRegistry?.id || initialRegistry.id === "") return;
      // Add your close registry action here
      await closeRegistry(initialRegistry.id, session.user.id);
      router.refresh();
      toast({
        title: "Success",
        description: "Registry has been closed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to close registry" + error,
        variant: "destructive",
      });
    } finally {
      setIsClosing(false);
    }
  };

  if (initialRegistry?.isClosed) {
    return (
      <div className="rounded-lg border bg-muted p-4">
        <p className="text-sm text-muted-foreground">
          This registry is closed. No further updates can be made.
        </p>
      </div>
    );
  }

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
      <Button
        variant="destructive"
        onClick={handleClose}
        disabled={isClosing}
        className="w-full">
        {isClosing ? "Closing..." : "Close Registry"}
      </Button>
    </form>
  );
}
