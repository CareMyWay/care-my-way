import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { sendContactUsEmail } from "./functions/send-contact-us-email/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  sendContactUsEmail,
});

// Grant SES permissions to the Lambda role
backend.sendContactUsEmail.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["ses:SendEmail", "ses:SendRawEmail"],
    resources: ["*"], // Restrict to specific ARNs if needed for security - CHANGE THIS ONCE YOU HAVE SES PERMISSIONS SET UP
    // resources: ["arn:aws:ses:<region>:<account-id>:identity/<email-address>"], // Restrict to specific ARNs if needed for security
  })
);
