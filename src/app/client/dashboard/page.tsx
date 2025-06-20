import React from "react";
import ClientDashboard from "@/components/dashboards/client-dashboard";
import { getCurrentUserServer } from "@/utils/amplify-server-utils";

export default async function ClientDashboardPage() {
  const currentSignedInUser = await getCurrentUserServer();

  if (!currentSignedInUser) {
    return <p>You are not signed in.</p>;
  }
  return (
    <div>
      <ClientDashboard params={{ id: currentSignedInUser.userId }} />
    </div>
  );
}
