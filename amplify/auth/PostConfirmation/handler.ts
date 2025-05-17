// import { Amplify } from "aws-amplify";
// import { generateClient } from "aws-amplify/api";
// import type { PostConfirmationTriggerHandler } from "aws-lambda";

// // import { data } from "@/amplify/auth/PostConfirmation/amplify_outputs.json";
// import { type Schema } from "@/amplify/data/resource";
// import {
//   AdminAddUserToGroupCommand,
//   CognitoIdentityProviderClient,
// } from "@aws-sdk/client-cognito-identity-provider";

// const client = new CognitoIdentityProviderClient();

// export const dataClient = generateClient<Schema>();

// // add user to group
// export const handler: PostConfirmationTriggerHandler = async (event) => {
//   console.log("event", event);
//   const command = new AdminAddUserToGroupCommand({
//     GroupName: "Client",
//     Username: event.userName,
//     UserPoolId: event.userPoolId,
//   });
//   const response = await client.send(command);
//   console.log("processed", response.$metadata.requestId);
//   return event;
// };
