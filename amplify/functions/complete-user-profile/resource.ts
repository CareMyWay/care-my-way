import { defineFunction } from "@aws-amplify/backend";

export const completeUserProfile = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: "complete-user-profile",
  // optionally specify a path to your handler (defaults to "./handler.ts")
  runtime: 20,
  entry: "./handler.ts",
});
