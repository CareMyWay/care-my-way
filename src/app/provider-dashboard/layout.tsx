import type React from "react";
import { SidebarNav } from "@/components/provider-dashboard-ui/careprovider-sidenav";
import NavBar from "@/components/nav-bars/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-dashboard-bg font-manrope">
      <aside className="w-64 h-screen fixed top-0 left-0 z-20 bg-white border-r border-gray-200">
        <SidebarNav />
      </aside>

      <div className="ml-64 flex flex-col min-h-screen w-full">
        <header className="w-full border-b border-gray-200 bg-white z-10">
          <NavBar />
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
