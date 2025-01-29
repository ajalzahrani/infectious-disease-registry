import { NotificationList } from "@/components/notification-list";
import { NotificationFilters } from "@/components/notification-filters";

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <aside>
          <NotificationFilters />
        </aside>
        <main>
          <NotificationList />
        </main>
      </div>
    </div>
  );
}
