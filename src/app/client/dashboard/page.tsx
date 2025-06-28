import React from "react";
import ClientDashboard from "@/components/dashboards/client-dashboard";
import NavBar from "@/components/nav-bars/navbar";

export default async function ClientDashboardPage() {
  return (
    <div>
      <NavBar />
      <ClientDashboard />
    </div>
  );
}
