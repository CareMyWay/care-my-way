import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { getCurrentUser } from "aws-amplify/auth/server";
// eslint-disable-next-line no-restricted-imports
import config from "../../amplify_outputs.json";
import { cookies } from "next/headers";

//use runWithAmplifyServerContext to call Amplify APIs within isolated request contexts - keeping it within the server
// and not leaking to the client
export const { runWithAmplifyServerContext } = createServerRunner({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  config,
});

//check if user is logged in

export const isAuthenticated = async () =>
  await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec) {
      try {
        const user = await getCurrentUser(contextSpec);
        return !!user;
      } catch (error) {
        return false;
      }
    },
  });

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
