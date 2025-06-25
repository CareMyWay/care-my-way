import type React from "react";
import { SidebarNav } from "@/components/provider-dashboard-ui/careprovider-sidenav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen dashboard-bg-primary font-manrope">
      <div className="flex">
        <SidebarNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
