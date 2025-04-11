// src/app/(auth)/registry/components/registry-updates.tsx
"use client";

import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UpdateType } from "@prisma/client";

interface RegistryUpdate {
  id: string;
  type: UpdateType;
  details: string | null;
  createdAt: Date;
  updatedBy: {
    name: string | null;
  };
}

interface RegistryComment {
  id: string;
  comment: string;
  createdAt: Date;
  createdBy: {
    name: string | null;
  };
}

interface RegistryUpdatesProps {
  updates: RegistryUpdate[];
  comments: RegistryComment[];
}

type CombinedUpdate =
  | (RegistryUpdate & { isComment: false })
  | (RegistryComment & { isComment: true; type: UpdateType });

export function RegistryUpdates({ updates, comments }: RegistryUpdatesProps) {
  const allUpdates: CombinedUpdate[] = [
    ...updates.map((update) => ({
      ...update,
      isComment: false as const,
    })),
    ...comments.map((comment) => ({
      ...comment,
      type: "COMMENT_ADDED" as UpdateType,
      isComment: true as const,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {allUpdates.map((update) => (
          <div
            key={update.id}
            className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge
                variant={
                  update.type === "CONTACT_STATUS_CHANGED"
                    ? "default"
                    : "secondary"
                }>
                {update.type.replace(/_/g, " ")}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(update.createdAt, { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm">
              {update.isComment ? update.comment : update.details}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              By:{" "}
              {update.isComment ? update.createdBy.name : update.updatedBy.name}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
