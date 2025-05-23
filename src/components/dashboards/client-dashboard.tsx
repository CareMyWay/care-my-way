import React from "react";

// Update the import path below if the file is located elsewhere
import { isAuthenticated } from "@/utils/amplify-server-utils";
import { redirect } from "next/navigation";

export default async function ClientDashboard() {
  const loggedIn = await isAuthenticated();
  if (!loggedIn) redirect("/login");
  return <div>ClientDashboard</div>;
}
