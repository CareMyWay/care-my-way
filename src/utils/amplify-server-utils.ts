import { createServerRunner } from "@aws-amplify/adapter-nextjs";
<<<<<<< HEAD
<<<<<<< HEAD
import { getCurrentUser } from "aws-amplify/auth";
=======
import { getCurrentUser } from "aws-amplify/auth/server";
<<<<<<< HEAD
// eslint-disable-next-line no-restricted-imports
>>>>>>> 1b87dd5 (Complete navbar with auth functionality)
=======
>>>>>>> 94e6bc2 (In progress of adding user to user pool groups)
=======
import {
  getCurrentUser,
  fetchAuthSession,
  fetchUserAttributes,
} from "aws-amplify/auth/server";
import { FetchUserAttributesOutput } from "aws-amplify/auth";
>>>>>>> 2e3d7ee (Complete functionality to fetch user profile data)
import config from "../../amplify_outputs.json";
import { cookies } from "next/headers";
import { type Schema } from "@/../amplify/data/resource";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

<<<<<<< HEAD
<<<<<<< HEAD
// export const cookiesClient = generateServerClientUsingCookies<Schema>({
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   config,
//   cookies,
// });

//check if user is logged in

<<<<<<< HEAD
export async function GetAuthCurrentUserServer() {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: () => getCurrentUser(),
    });
    return currentUser;
  } catch (error) {
    console.log(error);
  }
}
=======
export const isAuthenticated = async () =>
  await runWithAmplifyServerContext({
=======
=======
// Return the current signed-in user
// Use to return current user information
export const getCurrentUserServer = async () => {
  return await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec) {
      return await getCurrentUser(contextSpec);
    },
  });
};

// Check if the user is authenticated
>>>>>>> 2e3d7ee (Complete functionality to fetch user profile data)
export const isAuthenticated = async (): Promise<boolean> => {
  const result = await runWithAmplifyServerContext({
>>>>>>> c27aa6c (In process of fixing authentication flow)
    nextServerContext: { cookies },
    async operation(contextSpec) {
      try {
        const currentUser = await getCurrentUser(contextSpec);
        return !!currentUser;
      } catch (error) {
        // This catches the UserUnAuthenticatedException inside the server context
        console.log("User not authenticated:", error);
        return false;
      }
    },
  });

<<<<<<< HEAD
// export async function GetAuthCurrentUserServer() {
//   try {
//     const currentUser = await runWithAmplifyServerContext({
//       nextServerContext: { cookies },
//       operation: (context) => getCurrentUser(context),
//     });
//     return currentUser;
//   } catch (error) {
//     console.log(error);
//   }
// }
>>>>>>> 1b87dd5 (Complete navbar with auth functionality)
=======
  return result;
};
<<<<<<< HEAD
>>>>>>> c27aa6c (In process of fixing authentication flow)
=======

//Checks if use belongs to  the Admin group
// Use for admin-only pages or features
// Enables admin specific functionality
export const checkIsAdmin = async (): Promise<boolean> => {
  return await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec) {
      let isAdmin = false;
      try {
        const session = await fetchAuthSession(contextSpec);
        const tokens = session.tokens;
        if (tokens && Object.keys(tokens).length > 0) {
          const groups = tokens.accessToken.payload["cognito:groups"];
          if (Array.isArray(groups) && groups.includes("Admin")) {
            isAdmin = true;
          }
        }
        return isAdmin;
      } catch (error) {
        return false;
      }
    },
  });
};

//fetches user profile data from Cognito
//Use to populate user profile data or prefill registration forms
export const fetchUserAttributesServer =
  async (): Promise<FetchUserAttributesOutput> => {
    return await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      async operation(contextSpec) {
        return await fetchUserAttributes(contextSpec);
      },
    });
  };

export const checkIsInGroup = async (groupName: string): Promise<boolean> => {
  return await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec) {
      try {
        const session = await fetchAuthSession(contextSpec);
        const rawGroups =
          session.tokens?.accessToken?.payload["cognito:groups"];

        // Safely ensure it's an array before using includes
        if (Array.isArray(rawGroups)) {
          return rawGroups.includes(groupName);
        }

        // 🔄 Some Cognito configurations may return a comma-separated string
        if (typeof rawGroups === "string") {
          return rawGroups.split(",").includes(groupName);
        }
      } catch {
        return false;
      }
    },
  });
};

//Generate strongly typed Amplify Data Client using cookies for auth
// Used to run queries and mutations against the Amplify Data API
export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config,
  cookies,
  authMode: "userPool",
});
<<<<<<< HEAD
>>>>>>> 2e3d7ee (Complete functionality to fetch user profile data)
=======

export const getRedirectLinkForGroup = async (): Promise<string> => {
  return await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec) {
      const session = await fetchAuthSession(contextSpec);
      const rawGroups = session.tokens?.accessToken?.payload["cognito:groups"];

      if (Array.isArray(rawGroups)) {
        if (rawGroups.includes("Admin")) return "/admin/dashboard";
        if (rawGroups.includes("Provider")) return "/provider/dashboard";
        if (rawGroups.includes("Client")) return "/client/dashboard";
      }

      if (typeof rawGroups === "string") {
        const groups = rawGroups.split(",");
        if (groups.includes("Admin")) return "/admin/dashboard";
        if (groups.includes("Provider")) return "/provider/dashboard";
        if (groups.includes("Client")) return "/client/dashboard";
      }

      return "/unauthorized";
    },
  });
};
>>>>>>> 86140a8 (Complete functionality for role based registration, display user attributes in dashboard, and clean up code)
