import { type Schema } from "@../../amplify/data/resource";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { getCurrentUser } from "aws-amplify/auth/server";
import config from "../../amplify_outputs.json";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";

//use runWithAmplifyServerContext to call Amplify APIs within isolated request contexts - keeping it within the server
// and not leaking to the client
export const { runWithAmplifyServerContext } = createServerRunner({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  config,
});

// export const cookiesClient = generateServerClientUsingCookies<Schema>({
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   config,
//   cookies,
// });

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
