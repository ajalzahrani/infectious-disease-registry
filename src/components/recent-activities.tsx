import { Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { prisma } from "@/lib/prisma";

async function getRecentActivities() {
  return await prisma.activity.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      patient: true,
      user: true,
    },
  });
}

export async function RecentActivities() {
  const activities = await getRecentActivities();

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4">
          <Activity className="h-5 w-5 mt-0.5 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.description}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
      {activities.length === 0 && (
        <div className="text-center text-muted-foreground">
          No recent activities
        </div>
      )}
    </div>
  );
}
