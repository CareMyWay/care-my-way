import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { getCurrentUser } from "aws-amplify/auth";
import config from "../../amplify_outputs.json";
import { cookies } from "next/headers";

export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

//check if user is logged in

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
