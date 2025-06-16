/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getUserProfile = /* GraphQL */ `query GetUserProfile($id: ID!) {
  getUserProfile(id: $id) {
    address
    city
    createdAt
    dateOfBirth
    email
    emergencyContactFirstName
    emergencyContactLastName
    emergencyContactPhone
    emergencyRelationship
    firstName
    gender
    hasRepSupportPerson
    id
    lastName
    postalCode
    profileOwner
    province
    role
    supportContactPhone
    supportFirstName
    supportLastName
    supportRelationship
    updatedAt
    userId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserProfileQueryVariables,
  APITypes.GetUserProfileQuery
>;
export const listUserProfiles = /* GraphQL */ `query ListUserProfiles(
  $filter: ModelUserProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      address
      city
      createdAt
      dateOfBirth
      email
      emergencyContactFirstName
      emergencyContactLastName
      emergencyContactPhone
      emergencyRelationship
      firstName
      gender
      hasRepSupportPerson
      id
      lastName
      postalCode
      profileOwner
      province
      role
      supportContactPhone
      supportFirstName
      supportLastName
      supportRelationship
      updatedAt
      userId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserProfilesQueryVariables,
  APITypes.ListUserProfilesQuery
>;
