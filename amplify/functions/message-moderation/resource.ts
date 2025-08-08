import { defineFunction } from "@aws-amplify/backend";

export const messageModerationFunction = defineFunction({
  entry: "./handler.ts",
});
