import React from "react";
import ProviderDashboard from "@/components/dashboards/provider-dashboard";
import NavBar from "@/components/navbars/navbar";

export default async function ProviderDashboardPage() {
  return (
    <div>
      <NavBar />
      <ProviderDashboard />
    </div>
  );
}
