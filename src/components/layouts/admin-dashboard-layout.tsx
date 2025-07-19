import {
  getCurrentUserServer,
  checkIsInGroup,
} from "@/utils/amplify-server-utils";
import { getUserProfile } from "@/actions/getUserProfile";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
// import { SidebarNav } from "../Admin-dashboard-ui/careAdmin-sidenav";
export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAdmin = await checkIsInGroup("Admin");
  if (!isAdmin) redirect("/not-found");

  const currentUser = await getCurrentUserServer();
  const userProfileData = await getUserProfile(currentUser.userId);

  if (!userProfileData) return <p>User not found</p>;

  return (
    <div className="min-h-screen flex bg-dashboard-bg font-manrope">
      <div className="ml-64 flex flex-col min-h-screen w-full">
        <p>
          <strong>Email:</strong> {userProfileData.email}
        </p>
        <p>
          <strong>User Type:</strong> {userProfileData.userType}
        </p>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
