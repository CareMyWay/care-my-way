"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import OrangeButton from "@/components/buttons/orange-button";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { handleConfirmSignUp } from "@/actions/cognitoActions";
import SendVerificationCode from "./send-verification-code-form";

export default function ConfirmSignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const [state, dispatch] = useActionState(handleConfirmSignUp, undefined);

  useEffect(() => {
    if (state && typeof state === "string" && state.startsWith("/")) {
      router.push(state);
    }
  }, [state, router]);

  return (
    <main>
      <form action={dispatch} className="space-y-3">
        <div
          className="flex flex-col w-full justify-center items-center mt-4
        "
        >
          <h4 className="text-h4-size font-weight-bold text-darkest-green">
            Verify Your Account.
          </h4>
          <p className="text-center my-6 text-h6-size text-darkest-green">
            Enter the six digit code we sent to your email address to verify
            your <br /> new Care My Way Account
          </p>
          <div className="w-full">
            <div>
              <label
                className=" text-darkest-green mb-3 mt-5 std-form-label"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="std-form-input"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  defaultValue={emailFromQuery}
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                // className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                className="mb-3 mt-5 std-form-label"
                htmlFor="code"
              >
                Code
              </label>
              <div className="relative mb-10">
                <input
                  className="std-form-input"
                  id="code"
                  type="text"
                  name="code"
                  placeholder="Enter code"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>
        </div>
        <ConfirmButton />
        {state && !state.startsWith("/") && (
          <p className="text-h4-size text-red-600 text-center">{state}</p>
        )}
        <SendVerificationCode />
      </form>
    </main>
  );
}

function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <OrangeButton
      className="mt-2 w-full"
      type="submit"
      variant="action"
      aria-disabled={pending}
    >
      {pending ? "Confirming..." : "Confirm"}
    </OrangeButton>
  );
}
