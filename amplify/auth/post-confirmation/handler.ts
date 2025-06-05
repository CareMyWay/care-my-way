import type { PostConfirmationTriggerHandler } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient();

// add user to group
export const handler: PostConfirmationTriggerHandler = async (event) => {
  const group = event.request.userAttributes["custom:userType"];

  if (!group) {
    console.error("Group name not found in user attributes or environment.");
    return event;
  }

  const command = new AdminAddUserToGroupCommand({
    GroupName: group,
    Username: event.userName,
    UserPoolId: event.userPoolId,
  });

  const response = await client.send(command);
  console.log("processed", response.$metadata.requestId);

  console.log(`Added ${event.userName} to group ${group}`);
  return event;
};
