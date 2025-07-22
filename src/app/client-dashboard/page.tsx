import { getCurrentUserServer } from "@/utils/amplify-server-utils";
import { getUserProfile } from "@/actions/getUserProfile";
import HomeDashPage from "@/components/client-dashboard/home-dash-page";

export default async function ClientDashboardPage() {
  const user = await getCurrentUserServer();
  const userProfile = await getUserProfile(user.userId);

  if (!userProfile) return <p>User not found</p>;

  return (
    <>
      {/* <p>
        <strong>Email:</strong> {userProfile.email}
      </p>
      <p>
        <strong>Email:</strong> {userProfile.email}
      </p>
      <p>
        <strong>User Type:</strong> {userProfile.userType}
      </p> */}
      <HomeDashPage />
    </>
  );
}
