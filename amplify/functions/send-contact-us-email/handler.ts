import type { Schema } from "../../data/resource";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import fetch from "node-fetch";

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
});

export const handler: Schema["sendContactUsEmail"]["functionHandler"] = async (
  event
) => {
  const { fullname, email, subject, message, recaptchaToken } = event.arguments;

  // Verify reCAPTCHA token
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (!recaptchaSecret) {
    throw new Error("reCAPTCHA secret key is not configured");
  }
  const recaptchaResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`,
    { method: "POST" }
  );
  const recaptchaResult = (await recaptchaResponse.json()) as {
    success: boolean;
    score?: number;
  };

  if (!recaptchaResult.success) {
    throw new Error("reCAPTCHA verification failed");
  }

  const fromEmail = "your-verified-email@example.com"; // Replace with SES-verified email
  const toEmail = "recipient@example.com"; // Replace with support email

  const emailBody = `
    New contact form submission:
    FullName: ${fullname}
    Email: ${email}
    Subject: ${subject}
    Message: ${message}
  `;

  const command = new SendEmailCommand({
    Source: fromEmail,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: { Data: subject || "Contact Form Submission" },
      Body: { Text: { Data: emailBody } },
    },
  });

  try {
    await sesClient.send(command);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
