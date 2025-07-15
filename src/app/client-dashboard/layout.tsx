// app/client/dashboard/layout.tsx
import ClientDashboardLayout from "@/components/layouts/client-dashboard-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClientDashboardLayout>{children}</ClientDashboardLayout>;
}
