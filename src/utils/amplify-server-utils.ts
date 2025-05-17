import { type Schema } from "@../../amplify/data/resource";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
<<<<<<< HEAD
import { getCurrentUser } from "aws-amplify/auth";
=======
import { getCurrentUser } from "aws-amplify/auth/server";
<<<<<<< HEAD
// eslint-disable-next-line no-restricted-imports
>>>>>>> 1b87dd5 (Complete navbar with auth functionality)
=======
>>>>>>> 94e6bc2 (In progress of adding user to user pool groups)
import config from "../../amplify_outputs.json";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";

//use runWithAmplifyServerContext to call Amplify APIs within isolated request contexts - keeping it within the server
// and not leaking to the client
export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

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
