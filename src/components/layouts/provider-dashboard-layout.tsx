import {
  getCurrentUserServer,
  checkIsInGroup,
} from "@/utils/amplify-server-utils";
import { getUserProfile } from "@/actions/getUserProfile";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { SidebarNav } from "@/components/provider-dashboard-ui/careprovider-sidenav";

export default async function ProviderDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isProvider = await checkIsInGroup("Provider");
  if (!isProvider) redirect("/not-found");

  const currentUser = await getCurrentUserServer();
  const userProfileData = await getUserProfile(currentUser.userId);

  if (!userProfileData) return <p>User not found</p>;

  return (
    <div className="min-h-screen flex bg-dashboard-bg font-manrope">
      {/* Sidebar - now responsive */}
      <SidebarNav />
      
      {/* Main content */}
      <div className="flex flex-col min-h-screen w-full lg:ml-0">
        <main className="flex-1 p-6 lg:pt-6 pt-20 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
