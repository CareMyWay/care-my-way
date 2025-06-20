import { getUserProfile } from "@/actions/getUserProfile";

interface UserProfilePageProps {
  params: { id: string };
}

const ClientDashboard = async ({ params }: UserProfilePageProps) => {
  const userProfileData = await getUserProfile(params.id);
  console.log("userProfileData", userProfileData);
  if (!userProfileData) {
    return <p>User not found</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>

      <p>
        <strong>Email:</strong>{" "}
        {userProfileData.email || "Visible only to profile owner"}
      </p>
      <p>
        <strong>User Type:</strong>{" "}
        {userProfileData.userType || "Visible only to profile owner"}
      </p>
    </div>
  );
};

export default ClientDashboard;
