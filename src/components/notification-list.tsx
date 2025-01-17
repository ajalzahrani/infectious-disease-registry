import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, User } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Overdue Follow-up",
    description: "Patient John Doe (MRN001) is overdue for a follow-up call.",
    type: "overdue",
    date: "2023-06-15",
  },
  {
    id: 2,
    title: "New Disease Outbreak",
    description: "A new outbreak of Influenza has been reported in your area.",
    type: "alert",
    date: "2023-06-14",
  },
  {
    id: 3,
    title: "Incomplete Entry",
    description:
      "Patient Jane Smith (MRN002) has an incomplete disease registry entry.",
    type: "incomplete",
    date: "2023-06-13",
  },
];

export function NotificationList() {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.id}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Bell className="h-8 w-8 text-blue-500" />
            <div className="grid gap-1">
              <CardTitle>{notification.title}</CardTitle>
              <CardDescription>{notification.date}</CardDescription>
            </div>
            <Badge
              variant={
                notification.type === "alert" ? "destructive" : "secondary"
              }
              className="ml-auto">
              {notification.type}
            </Badge>
          </CardHeader>
          <CardContent>
            <p>{notification.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
