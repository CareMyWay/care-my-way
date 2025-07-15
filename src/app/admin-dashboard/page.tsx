import { getCurrentUserServer } from "@/utils/amplify-server-utils";
import { getUserProfile } from "@/actions/getUserProfile";
// import HomeDashPage from "@/components/admin-dashboard-ui/home-dash-page";

export default async function AdminDashboardPage() {
  const user = await getCurrentUserServer();
  const userProfile = await getUserProfile(user.userId);

  if (!userProfile) return <p>User not found</p>;

  return (
    <>
      <p>
        <strong>Email:</strong> {userProfile.email}
      </p>
      <p>
        <strong>User Type:</strong> {userProfile.userType}
      </p>
      <div>Home dashboard here</div>
      {/* <HomeDashPage /> */}
    </>
  );
}
