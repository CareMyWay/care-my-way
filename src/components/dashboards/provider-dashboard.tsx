import { getCurrentUserServer } from "@/utils/amplify-server-utils";
import { getUserProfile } from "@/actions/getUserProfile";
import { redirect } from "next/navigation";
import { checkIsInGroup } from "@/utils/amplify-server-utils";
import HomeDashPage from "../provider-dashboard-ui/home-dash-page";

export default async function ProviderDashboard() {
  const isProvider = await checkIsInGroup("Provider");
  if (!isProvider) redirect("/not-found");

  const currentUser = await getCurrentUserServer();
  const userProfileData = await getUserProfile(currentUser.userId);

  if (!userProfileData) return <p>User not found</p>;

  return (
    <div>
      <h1 className="text-h3-size text-darkest-green my-4">Welcome Jane!</h1>
      <HomeDashPage />
    </div>
  );
}
