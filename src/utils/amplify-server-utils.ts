import { createServerRunner } from "@aws-amplify/adapter-nextjs";
<<<<<<< HEAD
import { getCurrentUser } from "aws-amplify/auth";
=======
import { getCurrentUser } from "aws-amplify/auth/server";
// eslint-disable-next-line no-restricted-imports
>>>>>>> 1b87dd5 (Complete navbar with auth functionality)
import config from "../../amplify_outputs.json";
import { cookies } from "next/headers";

//use runWithAmplifyServerContext to call Amplify APIs within isolated request contexts - keeping it within the server
// and not leaking to the client
export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

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
>>>>>>> 1b87dd5 (Complete navbar with auth functionality)
