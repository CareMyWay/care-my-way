import { cookieBasedClient } from "../utils/amplify-server-utils";
import { isAuthenticated } from "../utils/amplify-server-utils";

export interface UserProfileData {
  id: string;
  userId: string;
  userType: string;
  email: string;
}

export const getUserProfile = async (
  userId: string
): Promise<UserProfileData | null> => {
  const isSignedIn = await isAuthenticated();
  let userProfileData: UserProfileData | null = null;

  try {
    const { data, errors } =
      await cookieBasedClient.models.UserProfile.listUserProfileByUserId(
        {
          userId: userId,
        },
        {
          authMode: isSignedIn ? "userPool" : "iam",
        }
      );

    console.log("data", data);
    console.log("errors", errors);

    if (errors) {
      console.error("errors", errors);
      return null;
    }

    if (data.length === 0) {
      console.error("No data found");
      return null;
    }

    userProfileData = data[0] as UserProfileData;
  } catch (error) {
    console.error("error", error);
    return null;
  }

  return userProfileData;
};
