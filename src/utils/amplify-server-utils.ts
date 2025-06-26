import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import {
  getCurrentUser,
  fetchAuthSession,
  fetchUserAttributes,
} from "aws-amplify/auth/server";
import { FetchUserAttributesOutput } from "aws-amplify/auth";
import config from "../../amplify_outputs.json";
import { cookies } from "next/headers";
import { type Schema } from "@/../amplify/data/resource";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

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
export const isAuthenticated = async (): Promise<boolean> => {
  const result = await runWithAmplifyServerContext({
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

  return result;
};

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
        return error;
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

export const getRedirectLinkForGroup = async (): Promise<string> => {
  return await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec) {
      const session = await fetchAuthSession(contextSpec);
      const rawGroups = session.tokens?.accessToken?.payload["cognito:groups"];

      if (Array.isArray(rawGroups)) {
        if (rawGroups.includes("Admin")) return "/admin/dashboard";
        if (rawGroups.includes("Provider")) return "/provider-dashboard";
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
