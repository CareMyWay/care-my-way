import type React from "react";
import ProviderDashboardLayout from "@/components/layouts/provider-dashboard-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProviderDashboardLayout>{children}</ProviderDashboardLayout>;
}
