import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentActivities } from "@/components/recent-activities"
import { Notifications } from "@/components/notifications"
import { PendingContacts } from "@/components/pending-contacts"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates in the registry</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivities />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Contacts</CardTitle>
            <CardDescription>Patients requiring follow-up</CardDescription>
          </CardHeader>
          <CardContent>
            <PendingContacts />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Important alerts and reminders</CardDescription>
          </CardHeader>
          <CardContent>
            <Notifications />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

