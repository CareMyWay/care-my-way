"use client";

import { handleSendEmailVerificationCode } from "@/lib/cognitoActions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/button";

export default function SendVerificationCode() {
  const [response, dispatch] = useActionState(handleSendEmailVerificationCode, {
    message: "",
    errorMessage: "",
  });
  const { pending } = useFormStatus();
  return (
    <>
      <Button
        className="mt-2 w-full"
        aria-disabled={pending}
        formAction={dispatch}
      >
        Resend Verification Code{" "}
      </Button>
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
