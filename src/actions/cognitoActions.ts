import { redirect } from "next/navigation";
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  resendSignUpCode,
  autoSignIn,
} from "aws-amplify/auth";
import { getErrorMessage } from "@/utils/get-error-message";

export async function handleSignUp(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const userType = formData.get("userType") as string;
    if (!userType) {
      throw new Error("User type is required");
    }
    // const { isSignUpComplete, userId, nextStep } = await signUp({
    const { } = await signUp({
      username: String(formData.get("email")),
      password: String(formData.get("password")),
      options: {
        userAttributes: {
          email: String(formData.get("email")),
          given_name: String(formData.get("firstName")),
          family_name: String(formData.get("lastName")),
          "custom:userType": String(formData.get("userType")), // e.g., "Provider"
        },
        // optional
        autoSignIn: true,
      },
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect(
    `/sign-up/confirm-sign-up?email=${encodeURIComponent(String(formData.get("email")))}`
  );
}

export async function handleSendEmailVerificationCode(
  prevState: { message: string; errorMessage: string },
  formData: FormData
) {
  let currentState;
  try {
    await resendSignUpCode({
      username: String(formData.get("email")),
    });
    currentState = {
      ...prevState,
      message: "Code sent successfully",
    };
  } catch (error) {
    currentState = {
      ...prevState,
      errorMessage: getErrorMessage(error),
    };
  }

  return currentState;
}

export async function handleConfirmSignUp(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    const email = String(formData.get("email"));
    const code = String(formData.get("code"));

    await confirmSignUp({
      username: email,
      confirmationCode: code,
    });

    try {
      await autoSignIn(); // try, but don’t crash if it fails
      return "/auth/redirect-after-login";
    } catch {
      console.log("Auto sign-in failed, redirecting to login.");
      return "/login?confirmed=true"; // or let them log in manually
    }
  } catch (error) {
    return error instanceof Error ? error.message : "Unknown error";
  }
}

// export async function handleConfirmSignUp(
//   prevState: string | undefined,
//   formData: FormData
// ): Promise<string | undefined> {
//   try {
//     const email = String(formData.get("email"));
//     const code = String(formData.get("code"));

//     await confirmSignUp({
//       username: email,
//       confirmationCode: code,
//     });

//     await autoSignIn();

//     return "/auth/redirect-after-login";
//   } catch (error) {
//     return error instanceof Error ? error.message : "Unknown error";
//   }
// }

export async function handleSignIn(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    // const { isSignedIn, nextStep } = await signIn({
    const { nextStep } = await signIn({
      username: String(formData.get("email")),
      password: String(formData.get("password")),
    });

    if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
      await resendSignUpCode({
        username: String(formData.get("email")),
      });
      return `/sign-up/confirm-sign-up?email=${formData.get("email")}`;
    }

    return "/auth/redirect-after-login";
  } catch (error) {
    return getErrorMessage(error);
  }
}

export async function handleSignOut() {
  try {
    await signOut();
  } catch (error) {
    console.log(getErrorMessage(error));
  }
  redirect("/login");
}
