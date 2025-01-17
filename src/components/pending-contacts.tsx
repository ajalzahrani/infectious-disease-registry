import { Phone } from 'lucide-react'
import { Button } from "@/components/ui/button"

const pendingContacts = [
  { id: 1, name: "Alice Brown", disease: "COVID-19", dueDate: "2023-06-15" },
  { id: 2, name: "Bob Wilson", disease: "Influenza", dueDate: "2023-06-16" },
  { id: 3, name: "Carol Davis", disease: "Tuberculosis", dueDate: "2023-06-17" },
]

export function PendingContacts() {
  return (
    <div className="space-y-4">
      {pendingContacts.map((contact) => (
        <div key={contact.id} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{contact.name}</p>
            <p className="text-sm text-muted-foreground">{contact.disease}</p>
            <p className="text-xs text-muted-foreground">Due: {contact.dueDate}</p>
          </div>
          <Button size="sm" variant="outline">
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </div>
      ))}
    </div>
  )
}

