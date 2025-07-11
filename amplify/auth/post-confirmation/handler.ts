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
import { createUserProfile } from "./graphql/mutations";

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

  const dynamoDBResponse = await dataClient
    .graphql({
      query: createUserProfile,
      variables: {
        input: {
          userId: event.request.userAttributes.sub,
          email: event.request.userAttributes.email,
          userType: group,
          profileOwner: `${event.request.userAttributes.sub}::${event.userName}`,

          // gender: "",
          // dateOfBirth: "",
          // address: "",
          // province: "",
          // city: "",
          // postalCode: "",
          // emergencyContactFirstName: "",
          // emergencyContactLastName: "",
          // emergencyRelationship: "",
          // emergencyContactPhone: "",
          // hasRepSupportPerson: false,
          // supportFirstName: "",
          // supportLastName: "",
          // supportRelationship: "",
          // supportContactPhone: "",
          // profileOwner: `${event.request.userAttributes.sub}::${event.userName}`,
        },
      },
    })
    .then((user) => {
      if (user.errors) {
        console.error(user.errors);
        throw new Error("Failed to create user in DB");
      }
      console.log("User created", user);
      return user;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });

  // If user is a Provider, also create a basic ProviderProfile
  if (group === "Provider") {
    console.log("Creating ProviderProfile for Provider user:", event.request.userAttributes.sub);

    try {
      const providerProfileData = {
        userId: event.request.userAttributes.sub,
        profileOwner: `${event.request.userAttributes.sub}::${event.userName}`,
        firstName: event.request.userAttributes.given_name || "",
        lastName: event.request.userAttributes.family_name || "",
        email: event.request.userAttributes.email,
        isProfileComplete: false,
        isPubliclyVisible: false,
        languages: [],
        servicesOffered: [],
        education: null,
        certifications: null,
        workExperience: null,
      };

      console.log("ProviderProfile data to create:", JSON.stringify(providerProfileData, null, 2));

      const providerProfileResponse = await dataClient.models.ProviderProfile.create(providerProfileData);

      console.log("ProviderProfile creation response:", JSON.stringify(providerProfileResponse, null, 2));

      if (providerProfileResponse.errors) {
        console.error("Failed to create ProviderProfile - GraphQL errors:", JSON.stringify(providerProfileResponse.errors, null, 2));
        // Don't throw here - we don't want to fail the entire sign-up process
        // if the ProviderProfile creation fails, but log it clearly
      } else {
        console.log("ProviderProfile created successfully:", JSON.stringify(providerProfileResponse.data, null, 2));
      }
    } catch (error) {
      console.error("Error creating ProviderProfile - Exception caught:", error);
      console.error("Error stack:", (error as Error)?.stack);
      // Don't throw here - we don't want to fail the entire sign-up process
      // if the ProviderProfile creation fails
    }
  } else {
    console.log("User is not a Provider, skipping ProviderProfile creation. User type:", group);
  }

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
