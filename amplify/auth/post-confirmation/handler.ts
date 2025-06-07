import type { PostConfirmationTriggerHandler } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/post-confirmation";

const { resourceConfig, libraryOptions } =
  await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const cognitoClient = new CognitoIdentityProviderClient();

export const dataClient = generateClient<Schema>();
// This function is triggered after a user confirms their sign-up in Cognito.

// add user to group
export const handler: PostConfirmationTriggerHandler = async (event) => {
  console.log("event", event);
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

  const cognitoGroupResponse = await cognitoClient.send(command);

  const dynamoDBResponse = await dataClient.models.UserProfile.create({
    id: event.request.userAttributes.sub,
    email: event.request.userAttributes.email,
    role: group,
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    country: "",
    city: "",
    postalCode: "",
    emergencyContactFullName: "",
    emergencyRelationshipStatus: "",
    emergencyContactPhone: "",
    hasRepSupportPerson: false,
    supportFirstName: "",
    supportLastName: "",
    supportRelationshipStatus: "",
    supportContactPhone: "",
    profileOwner: `${event.request.userAttributes.sub}::${event.userName}`,
  })
    .then((user) => {
      if (user.errors) {
        console.error(user.errors);
        throw new Error("Failed to create user in DB");
      }
      console.log("User created", user);
      return event;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });

  if (
    cognitoGroupResponse.$metadata.httpStatusCode !== 200 &&
    dynamoDBResponse
  ) {
    throw new Error("Failed to add user to group");
  }
  if (!dynamoDBResponse) {
    throw new Error("Failed to create user in DB");
  }

  console.log("processed", cognitoGroupResponse.$metadata.requestId);

  console.log(`Added ${event.userName} to group ${group}`);
  return event;
};
