import { defineAuth, secret } from "@aws-amplify/backend";
import { PostConfirmation } from "./PostConfirmation/resource";
// import { AddUserToGroup } from "../function/BusinessLogic/AddUserToGroup/resource";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  groups: ["Admin", "Client", "Support", "Provider"],
  loginWith: {
    email: true,
    externalProviders: {
      // google: {
      //   clientId: secret("GOOGLE_CLIENT_ID"),
      //   clientSecret: secret("GOOGLE_CLIENT_SECRET"),
      //   scopes: ["email"],
      // },
      callbackUrls: ["http://localhost:3000/"],
      logoutUrls: ["http://localhost:3000/"],
    },
  },
  triggers: {
    postConfirmation: PostConfirmation,
  },
  access: (allow) => [
    allow.resource(PostConfirmation).to(["addUserToGroup"]),
    // allow.resource(AddUserToGroup).to(["addUserToGroup"]),
  ],
});
