import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { User } from "aws-cdk-lib/aws-iam";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  User: a
    .model({
      id: a.string().required(),
      firstName: a.string(),
      lastName: a.string(),
      email: a.string(),
      role: a
        .string()
        .default("Client")
        .authorization((allow) => [
          allow.ownerDefinedIn("profileOwner").to(["read", "create"]),
          allow.groups(["Admin"]).to(["read", "update", "create"]),
        ]),
      gender: a.string(),
      dateOfBirth: a.date(),
      address: a.string(),
      country: a.string(),
      city: a.string(),
      postalCode: a.string(),
      emergencyContactFullName: a.string(),
      emergencyRelationshipStatus: a.string(),
      emergencyContactPhone: a.string(),
      hasRepSupportPerson: a.boolean(),
      supportFullName: a.string(),
      supportRelationshipStatus: a.string(),
      supportContactPhone: a.string(),
      // profileOwner: a.string().array(),
    })
    .authorization((allow) => [
      allow.groups(["Admin"]).to(["read", "create", "update", "delete"]),
      allow.ownerDefinedIn("profileOwner").to(["read", "update", "create"]),
      allow.authenticated().to(["read", "create"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
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
