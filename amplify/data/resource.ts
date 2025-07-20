import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";
/*== STEP 1 ===============================================================
The section below creates a UserProfile database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "UserProfile" records.
=========================================================================*/
const schema = a
  .schema({
    UserProfile: a
      .model({
        userId: a.string().required(),
        // We don't want people to change their email directly in the db. Better if we allow them to change it via Cognito, and then update it in the db using a Lambda function.
        // Also, we don't want other people to see other people's email addresses. Note the use of ownerDefinedIn("profileOwner") in the email field.
        email: a
          .string()
          .authorization((allow) => [
            allow.group("Admin"),
            allow.ownerDefinedIn("profileOwner").to(["read"]),
          ]),
        userType: a
          .string()
          .default("Client")
          .authorization((allow) => [
            allow.ownerDefinedIn("profileOwner").to(["read", "create"]),
            allow.groups(["Admin"]).to(["read", "update", "create"]),
          ]),
        profileOwner: a
          .string()
          .authorization((allow) => [
            allow.ownerDefinedIn("profileOwner").to(["read"]),
            allow.group("Admin"),
            allow.authenticated().to(["read"]),
          ]),
      })
      .secondaryIndexes((index) => [index("userId")])

      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner").to(["read", "update"]),
        allow.group("Admin"),
        allow.guest().to(["read"]),
        allow.authenticated().to(["read"]),
      ]),

    ClientProfile: a
      .model({
        userId: a.string().required(),
        userType: a.string().default("Client"),
        profileOwner: a
          .string()
          .authorization((allow) => [
            allow.ownerDefinedIn("profileOwner").to(["read", "create"]),
            allow.group("Admin").to(["read", "update"]),
          ]),
        firstName: a.string(),
        lastName: a.string(),
        gender: a.string(),
        dateOfBirth: a.date(),
        email: a.string(),
        phoneNumber: a.string(),
        address: a.string(),
        city: a.string(),
        province: a.string(),
        postalCode: a.string(),
        emergencyContactFirstName: a.string(),
        emergencyContactLastName: a.string(),
        emergencyRelationship: a.string(),
        emergencyContactPhone: a.string(),
        hasRepSupportPerson: a.boolean(),
        supportFirstName: a.string(),
        supportLastName: a.string(),
        supportRelationship: a.string(),
        supportContactPhone: a.string(),
        medicalConditions: a.string(),
        surgeriesOrHospitalizations: a.string(),
        chronicIllnesses: a.string(),
        allergies: a.string(),
        medications: a.string(),
        mobilityStatus: a.string(),
        cognitiveDifficulties: a.string(),
        cognitiveDifficultiesOther: a.string(),
        sensoryImpairments: a.string(),
        sensoryImpairmentsOther: a.string(),
        typicalDay: a.string(),
        physicalActivity: a.string(),
        dietaryPreferences: a.string(),
        sleepHours: a.string(),
        hobbies: a.string(),
        socialTime: a.string(),
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner").to(["read", "update", "create"]),
        allow.groups(["Admin"]).to(["read", "update", "create", "delete"]),
        allow.groups(["Provider"]).to(["read"]),
        allow.authenticated().to(["read", "create"]), // Add "create" for regular users
      ]),
  })
  .authorization((allow) => [allow.resource(postConfirmation)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
