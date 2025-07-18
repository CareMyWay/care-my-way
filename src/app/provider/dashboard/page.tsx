import React from "react";
import ProviderDashboard from "@/components/dashboards/provider-dashboard";
import NavBar from "@/components/nav-bars/navbar";

export default async function ProviderDashboardPage() {
  return (
    <div>
      <NavBar />
      <ProviderDashboard />
    </div>
  );
}
