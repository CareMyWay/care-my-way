"use client";
import { Button } from "@/components/button";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { handleConfirmSignUp } from "@/lib/cognitoActions";
import SendVerificationCode from "./send-verification-code-form";

export default function ConfirmSignUpForm() {
  const [errorMessage, dispatch] = useActionState(
    handleConfirmSignUp,
    undefined
  );

  return (
    <main>
      <form action={dispatch} className="space-y-3">
        <div
          className="flex flex-col w-full justify-center items-center mt-12
        "
        >
          <h4 className="text-h4-size font-weight-bold">
            Verify Your Account.
          </h4>
          <p className="text-center my-6 text-h6-size text-dark-green">
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
                  // className="peer block w-full rounded-md border-input-border-gray py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500"
                  className="std-form-input"
                  id="code"
                  type="text"
                  name="code"
                  placeholder="Enter code"
                  // required
                  minLength={6}
                />
              </div>
            </div>
          </div>
          {/* <div className="flex flex-row w-full justify-center gap-6 mt-6">
          <input id="idx1" type="text" className="std-input px-3.5 w-[40px]" />
          <input id="idx2" type="text" className="std-input px-3.5 w-[40px]" />
          <input id="idx3" type="text" className="std-input px-3.5 w-[40px]" />
          <input id="idx4" type="text" className="std-input px-3.5 w-[40px]" />
          <input id="idx5" type="text" className="std-input px-3.5 w-[40px]" />
          <input id="idx6" type="text" className="std-input px-3.5 w-[40px]" />
        </div> */}
          <ConfirmButton />
          <div className="flex h-8 items-end space-x-1 ">
            <div
              className="flex h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {errorMessage && (
                <>
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </>
              )}
            </div>
          </div>
          <SendVerificationCode />
          {/* <div className="my-12">
          <button className=" s-btn orange-button self-center min-w-[220px] mb-4">
            CONTINUE
          </button>
        </div>

        <div className="space-y-8">
          <p className="underline self-center ">Resend Code</p>
        </div> */}
        </div>
      </form>
    </main>
  );
}

function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-2 w-full" aria-disabled={pending}>
      {pending ? "Confirming..." : "Confirm"}
    </Button>
  );
}
