"use client";

import { handleSendEmailVerificationCode } from "@/actions/cognitoActions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import OrangeButton from "../buttons/orange-button";

export default function SendVerificationCode({ email }: { email: string }) {
  const [response, dispatch] = useActionState(handleSendEmailVerificationCode, {
    message: "",
    errorMessage: "",
  });
  const { pending } = useFormStatus();

  return (
    <form action={dispatch} className="mt-4">
      <input type="hidden" name="email" value={email} />
      <OrangeButton
        type="submit"
        variant="action"
        className="w-full"
        aria-disabled={pending}
      >
        {pending ? "Sending..." : "Resend Verification Code"}
      </OrangeButton>
      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {response?.errorMessage && (
          <p className="text-sm text-red-800">{response.errorMessage}</p>
        )}
        {response?.message && (
          <p className="text-sm text-darkest-green">{response.message}</p>
        )}
      </div>
    </form>
  );
}
