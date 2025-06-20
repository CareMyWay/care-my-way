import React from "react";
import { getUserProfile } from "@/actions/getUserProfile";

interface UserProfilePageProps {
  params: { id: string };
}

// Update the import path below if the file is located elsewhere
import { isAuthenticated } from "@/utils/amplify-server-utils";
import { redirect } from "next/navigation";

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const loggedIn = await isAuthenticated();
  if (!loggedIn) redirect("/login");

  const userProfileData = await getUserProfile(params.id);
  if (!userProfileData) {
    return <p>User profile not found</p>;
  }
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>

      <p>
        <strong>Role:</strong> {userProfileData.userType}
      </p>
      <p>
        <strong>Email:</strong>{" "}
        {userProfileData.email || "Visible only to profile owner"}
      </p>
    </div>
  );
}
