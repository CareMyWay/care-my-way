import { secret, defineFunction } from "@aws-amplify/backend";

export const sendContactUsEmail = defineFunction({
  name: "send-contact-us-email",
  entry: "./handler.ts",
  environment: {
    RECAPTCHA_SECRET_KEY: secret("GOOGLE_RECAPTCHA_SECRET_KEY"),
  },
});
