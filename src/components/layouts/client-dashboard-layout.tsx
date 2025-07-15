import {
  getCurrentUserServer,
  checkIsInGroup,
} from "@/utils/amplify-server-utils";
import { getUserProfile } from "@/actions/getUserProfile";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import NavBar from "@/components/nav-bars/navbar";
import NotificationsSideNav from "../client-dashboard-ui/notifications-sidenav";

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
    <div className="min-h-screen flex bg-dashboard-bg font-manrope">
      <aside className="w-64 h-screen fixed top-0 left-0 z-20 bg-white border-r border-gray-200">
        <NotificationsSideNav />
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
