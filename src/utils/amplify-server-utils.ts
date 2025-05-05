import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { getCurrentUser } from "aws-amplify/auth";
// eslint-disable-next-line no-restricted-imports
import config from "../../amplify_outputs.json";
import { cookies } from "next/headers";

export const { runWithAmplifyServerContext } = createServerRunner({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  config,
});

//check if user is logged in

export async function GetAuthCurrentUserServer() {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (context) => getCurrentUser(context),
    });
    return currentUser;
  } catch (error) {
    console.log(error);
  }
}
