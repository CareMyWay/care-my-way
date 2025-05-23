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

export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

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
>>>>>>> c27aa6c (In process of fixing authentication flow)
