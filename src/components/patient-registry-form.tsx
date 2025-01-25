"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface PatientRegistryProps {
  patientId: string;
  initialRegistry?: {
    id: string;
    contacted: boolean;
    comments?: string;
  };
}

export function PatientRegistry({
  patientId,
  initialRegistry,
}: PatientRegistryProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [contacted, setContacted] = useState(
    initialRegistry?.contacted || false
  );
  const [comments, setComments] = useState(initialRegistry?.comments || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/registry/${patientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contacted,
          comments,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update registry");
      }

      toast({
        title: "Success",
        description: "Registry updated successfully",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update registry",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="contacted">Contact Status</Label>
          <Switch
            id="contacted"
            checked={contacted}
            onCheckedChange={setContacted}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="comments">Comments</Label>
          <Textarea
            id="comments"
            placeholder="Add your comments here..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            disabled={isLoading}
            className="min-h-[100px]"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Registry"}
      </Button>
    </form>
  );
}
