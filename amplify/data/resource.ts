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
        // allow.ownerDefinedIn("profileOwner").to(["read", "update"]),
        allow.group("Admin"),
        allow.guest().to(["read"]),
        allow.authenticated().to(["read"]),
      ]),

    ProviderProfile: a
      .model({
        userId: a.string().required(),
        profileOwner: a.string().required(),

        // Personal & Contact Information
        firstName: a.string(),
        lastName: a.string(),
        // Lowercase versions for case-insensitive search
        firstNameLower: a.string(),
        lastNameLower: a.string(),
        dob: a.date(),
        gender: a.string(),
        languages: a.string().array(), // Array of language names
        phone: a.string(),
        email: a.string(),
        preferredContact: a.string(),
        profilePhoto: a.string(), // Base64 or URL

        // Address Information
        address: a.string(),
        city: a.string(),
        province: a.string(),
        postalCode: a.string(),

        // Emergency Contact
        emergencyContactName: a.string(),
        emergencyContactPhone: a.string(),
        emergencyContactRelationship: a.string(),

        // Professional Summary
        profileTitle: a.string(),
        bio: a.string(),
        yearsExperience: a.string(),
        // Numeric representation for filtering and sorting
        yearExperienceFloat: a.float(),
        askingRate: a.float(),
        responseTime: a.string(),
        servicesOffered: a.string().array(), // Array of service names

        // Credentials & Work History (stored as JSON strings)
        education: a.json(), // Array of education objects
        certifications: a.json(), // Array of certification objects
        workExperience: a.json(), // Array of work experience objects

        // Availability
        availability: a.string().array(), // "yyyy-mm-dd:HH24" (e.g., "2025-07-20:09" for July 20, 2025, at 9:00 AM).

        // Profile completion status
        isProfileComplete: a.boolean().default(false),

        // Public visibility settings
        isPubliclyVisible: a.boolean().default(true),
      })
      .secondaryIndexes((index) => [
        index("userId"),
        index("city"),
        index("province"),
        index("yearExperienceFloat"), // Add index for experience filtering
        index("askingRate"), // Add index for rate filtering
        index("firstNameLower"), // Add index for name searching
        index("lastNameLower"), // Add index for name searching
      ])
      .authorization((allow) => [
        // Provider owns their profile - full access
        allow
          .ownerDefinedIn("profileOwner")
          .to(["create", "read", "update", "delete"]),
        // Admins have full access
        allow.group("Admin").to(["create", "read", "update", "delete"]),
        // Authenticated users can read profiles (for marketplace)
        allow.authenticated().to(["read"]),
        // Guests can read profiles (for marketplace browsing)
        allow.guest().to(["read"]),
      ]),

    // Booking schema
    Booking: a
      .model({
        id: a.string().required(),
        providerId: a.string().required(), // Include this field after DynamoDB is set up to record provider ID
        providerName: a.string().required(),
        providerRate: a.string().required(),
        date: a.string().required(),
        time: a.string().required(),
        clientId: a.string().required(),
        clientName: a.string(),
        bookingStatus: a.string().default("For Confirmation"),
        duration: a.float().required(),
        totalCost: a.float(),
      })
      .authorization((allow) => [
        allow.authenticated().to(["create", "read", "update"]),
        allow.group("Admin"),
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
