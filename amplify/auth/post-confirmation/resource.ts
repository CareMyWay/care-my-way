import { defineFunction } from "@aws-amplify/backend";

// export const PostConfirmation = defineFunction({
//   name: "post-confirmation", // optional parameter to specify a function name.
//   entry: "./handler.ts", // optional path to the function code. Defaults to ./handler.ts
//   runtime: 20,
// });

export const postConfirmation = defineFunction({
  name: "post-confirmation",
  // optionally define an environment variable for your group name
  // environment: {
  //   DEFAULT_GROUP_NAME: "Client",
  // },
  // entry: "./handler.ts", // optional path to the function code. Defaults to ./handler.ts
  // runtime: 20,
  // resourceGroupName: "auth",
});
