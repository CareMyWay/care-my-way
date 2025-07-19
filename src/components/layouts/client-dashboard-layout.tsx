import {
  getCurrentUserServer,
  checkIsInGroup,
} from "@/utils/amplify-server-utils";
import { getUserProfile } from "@/actions/getUserProfile";

import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function ClientDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isClient = await checkIsInGroup("Client");
  if (!isClient) redirect("/not-found");

  const currentUser = await getCurrentUserServer();
  const userProfileData = await getUserProfile(currentUser.userId);

  if (!userProfileData) return <p>User not found</p>;

  return (
    <div>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
