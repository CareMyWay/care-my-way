"use client";

import { handleSendEmailVerificationCode } from "@/actions/cognitoActions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import OrangeButton from "../buttons/orange-button";

export default function SendVerificationCode() {
  const [response, dispatch] = useActionState(handleSendEmailVerificationCode, {
    message: "",
    errorMessage: "",
  });
  const { pending } = useFormStatus();
  return (
    <>
      <OrangeButton
        className="mt-2 w-full"
        type="submit"
        variant="action"
        aria-disabled={pending}
        formAction={dispatch}
      >
        Resend Verification Code{" "}
      </OrangeButton>
      <div className="flex h-8 items-end space-x-1">
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {response?.errorMessage && (
            <>
              <p className="text-sm text-red-800">{response.errorMessage}</p>
            </>
          )}
          {response?.message && (
            <p className="text-sm text-darkest-green">{response.message}</p>
          )}
        </div>
      </div>
    </>
  );
}
