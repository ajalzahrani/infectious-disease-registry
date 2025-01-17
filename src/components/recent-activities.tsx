import { Activity } from 'lucide-react'

const activities = [
  { id: 1, description: "New patient added: John Doe", time: "2 hours ago" },
  { id: 2, description: "Updated registry for Jane Smith", time: "4 hours ago" },
  { id: 3, description: "Contacted patient: Mike Johnson", time: "1 day ago" },
]

export function RecentActivities() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4">
          <Activity className="h-5 w-5 mt-0.5 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{activity.description}</p>
            <p className="text-sm text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

