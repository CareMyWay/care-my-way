import { getCurrentUserServer } from "@/utils/amplify-server-utils";
import { getUserProfile } from "@/actions/getUserProfile";
import HomeDashPage from "@/components/client-dashboard/home-dash-page";

export default async function ClientDashboardPage() {
  return (
    <>
      <HomeDashPage />
    </>
  );
}
