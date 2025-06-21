import React from "react";
import ClientDashboard from "@/components/dashboards/client-dashboard";
import NavBar from "@/components/navbars/navbar";

export default async function ClientDashboardPage() {
  return (
    <div>
      <NavBar />
      <ClientDashboard />
    </div>
  );
}
