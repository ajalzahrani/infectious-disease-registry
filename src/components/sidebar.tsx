"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { rolePermissions } from "@/lib/permissions";
import { Home, Users, FileText, Bell, Pill } from "lucide-react";

const icons = {
  Home,
  FileText,
  Bell,
  Pill,
  Users,
} as const;

export function Sidebar({ className }: React.ComponentProps<"div">) {
  const { data: session } = useSession();
  const userRole = session?.user?.role as keyof typeof rolePermissions;
  const navItems = rolePermissions[userRole]?.navItems || [];

  return (
    <div className={cn("pb-12 w-64 bg-background border-r", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Menu
          </h2>
          <div className="space-y-1">
            <SidebarNav items={navItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarNav({
  items,
}: {
  items: (typeof rolePermissions)[keyof typeof rolePermissions]["navItems"];
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1">
      {items.map((item) => {
        const Icon = icons[item.icon as keyof typeof icons];
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "transparent"
            )}>
            <Icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
