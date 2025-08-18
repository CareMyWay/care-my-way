import {
  getCurrentUserServer,
  checkIsAdmin,
  checkIsSuperAdmin,
} from "@/utils/amplify-server-utils";
import { getUserProfile } from "@/actions/getUserProfile";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Shield, ShieldCheck, User } from "lucide-react";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) redirect("/not-found");

  const isSuperAdmin = await checkIsSuperAdmin();
  const currentUser = await getCurrentUserServer();
  const userProfileData = await getUserProfile(currentUser.userId);

  if (!userProfileData) return <p>User not found</p>;

  return (
    <div className="min-h-screen bg-primary-white font-manrope">
      {/* Header */}
      <header className="bg-white border-b-2 border-light-green shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-darkest-green rounded-lg flex items-center justify-center">
                {isSuperAdmin ? (
                  <ShieldCheck className="text-white" size={20} />
                ) : (
                  <Shield className="text-white" size={20} />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-darkest-green">Admin Portal</h1>
                <p className="text-sm text-medium-green">
                  {isSuperAdmin ? "Super Administrator" : "Administrator"} Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-dark-green">
                  {userProfileData.email}
                </p>
                <p className="text-xs text-medium-green">
                  {isSuperAdmin ? "Super Admin" : "Admin"}
                </p>
              </div>
              <div className="w-10 h-10 bg-medium-green rounded-full flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">{children}</main>
    </div>
  );
}
