import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

async function getPendingContacts() {
  try {
    return {
      data: await prisma.registry.findMany({
        where: {
          contacted: false,
          isClosed: false,
        },
        take: 5,
        orderBy: {
          createdAt: "asc",
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              contactInfo: true,
            },
          },
        },
      }),
      error: null,
    };
  } catch (error) {
    console.error("Error fetching pending contacts:", error);
    return {
      data: null,
      error: "Failed to load pending contacts",
    };
  }
}

export async function PendingContacts() {
  const pendingContacts = await getPendingContacts();

  if (pendingContacts.error) {
    return (
      <div className="text-center text-muted-foreground">
        {pendingContacts.error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingContacts.data &&
        pendingContacts.data.map((contact) => (
          <div key={contact.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{contact.patient.name}</p>
              {/* <p className="text-sm text-muted-foreground">
                {contact.disease.name}
              </p> */}
              <p className="text-xs text-muted-foreground">
                Due:{" "}
                {formatDistanceToNow(contact.createdAt, { addSuffix: true })}
              </p>
            </div>
            <Button asChild size="sm" variant="outline">
              <a href={`/patients/${contact.patient.id}`}>
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </a>
            </Button>
          </div>
        ))}
      {pendingContacts.data && pendingContacts.data.length === 0 && (
        <div className="text-center text-muted-foreground">
          No pending contacts
        </div>
      )}
    </div>
  );
}
