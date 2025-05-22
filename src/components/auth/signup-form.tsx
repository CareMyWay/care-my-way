"use client";

import Link from "next/link";
import React, { useActionState } from "react";
import Image from "next/image";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/button";
import OrangeButton from "@/components/buttons/orange-button";
import { handleSignUp } from "@/lib/cognitoActions";
import { useSearchParams } from "next/navigation";

import CMWStackedHeader from "../headers/cmw-stacked-header";

export default function SignUpForm() {
  const [errorMessage, dispatch] = useActionState(handleSignUp, undefined);
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType"); // Get from query

  return (
    <main>
      <form action={dispatch} className="space-y-3">
        <CMWStackedHeader title="Sign up to Care My Way" />
        <input type="hidden" name="userType" value={userType ?? ""} />

        <div>
          <div className="flex flex-row w-full justify-center">
            <p className="mb-4 text-h6-size text-darkest-green">
              Create your account today.
            </p>
          </div>
          <div className="flex flex-col w-full justify-center items-center gap-6">
            <div className="space-y-5 w-[458px]">
              <div className="space-y-2">
                <label
                  htmlFor="first-name"
                  className=" text-darkest-green mb-3 mt-5 std-form-label"
                >
                  First Name
                </label>
                <input
                  id="first-name"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  className="std-form-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="last-name"
                  className=" text-darkest-green mb-3 mt-5 std-form-label"
                >
                  Last Name
                </label>
                <input
                  id="last-name"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  className="std-form-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className=" text-darkest-green mb-3 mt-5 std-form-label"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Email"
                  className="std-form-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className=" text-darkest-green mb-3 mt-5 std-form-label"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="std-form-input"
                  minLength={6}
                  required
                />
              </div>

              <div className="justify-center flex flex-row self-center">
                <SignUpButton />
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm">— OR —</p>

              <div className="flex justify-center mt-4">
                <button className="transparent-button rounded-full flex flex-row flex-nowrap font-bold px-10 py-4 gap-2 border-1 border-gray-400">
                  <Image
                    src="/svgs/icon-google.svg"
                    alt="Sign up with Google Button"
                    width={24}
                    height={24}
                  />
                  Sign up with Google
                </button>
              </div>

              <div className="mt-6">
                <p>
                  Already have an account? &nbsp;
                  <Link href="/login" className="underline">
                    Sign In
                  </Link>
                </p>
              </div>
              {errorMessage && (
                <div
                  className="flex h-8 items-end space-x-1"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

function SignUpButton() {
  const { pending } = useFormStatus();

  return (
    <OrangeButton
      className="mt-4 w-full"
      variant="action"
      type="submit"
      aria-disabled={pending}
    >
      {pending ? "Creating Account..." : "Create Account"}
    </OrangeButton>
  );
}
