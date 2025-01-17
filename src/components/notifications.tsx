import { Bell } from 'lucide-react'

const notifications = [
  { id: 1, message: "Overdue follow-up: Patient #12345", time: "1 hour ago" },
  { id: 2, message: "New disease outbreak alert", time: "3 hours ago" },
  { id: 3, message: "Incomplete entry for Patient #67890", time: "1 day ago" },
]

export function Notifications() {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="flex items-start space-x-4">
          <Bell className="h-5 w-5 mt-0.5 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{notification.message}</p>
            <p className="text-sm text-muted-foreground">{notification.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

