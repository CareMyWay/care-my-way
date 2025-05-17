import { defineFunction } from "@aws-amplify/backend";

export const PostConfirmation = defineFunction({
  name: "post-confirmation", // optional parameter to specify a function name.
  entry: "./handler.ts", // optional path to the function code. Defaults to ./handler.ts
  runtime: 20,
});
