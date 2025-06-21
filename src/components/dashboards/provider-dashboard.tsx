// app/provider/dashboard/page.tsx
import { getCurrentUserServer } from "@/utils/amplify-server-utils";
import { getUserProfile } from "@/actions/getUserProfile";
import { redirect } from "next/navigation";
import { checkIsInGroup } from "@/utils/amplify-server-utils";

export default async function ProviderDashboard() {
  const isProvider = await checkIsInGroup("Provider");
  if (!isProvider) redirect("/not-found");

  const currentUser = await getCurrentUserServer();
  const userProfileData = await getUserProfile(currentUser.userId);

  if (!userProfileData) return <p>User not found</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold">Provider Dashboard</h1>
      <p>
        <strong>Email:</strong> {userProfileData.email}
      </p>
      <p>
        <strong>User Type:</strong> {userProfileData.userType}
      </p>
    </div>
  );
}
