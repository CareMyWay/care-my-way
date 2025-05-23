import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { getCurrentUser } from "aws-amplify/auth/server";
import config from "../../amplify_outputs.json";
import { cookies } from "next/headers";

export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

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
