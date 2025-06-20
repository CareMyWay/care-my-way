"use client";

import Link from "next/link";
import React, { useActionState } from "react";
import Image from "next/image";

import { useFormStatus } from "react-dom";
import OrangeButton from "@/components/buttons/orange-button";
import { handleSignIn } from "@/actions/cognitoActions";
import CMWStackedHeader from "../headers/cmw-stacked-header";

export default function LoginForm() {
  const [errorMessage, dispatch] = useActionState(handleSignIn, undefined);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 my-14 mt-2 md:mt-4">
      <form action={dispatch} className="space-y-3">
        <CMWStackedHeader title="Login to Care My Way" />

        <div>
          <div className="flex flex-row w-full justify-center">
            <p className=" text-h6-size mb-12 text-darkest-green">
              Please login to your account to continue.
            </p>
          </div>
          <div className="flex flex-col w-full justify-center items-center gap-6">
            <div className="space-y-5 w-[458px]">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="std-form-label text-darkest-green"
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
                  className="std-form-label text-darkest-green"
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
              {errorMessage && (
                <div
                  className="flex h-8 items-end space-x-1"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-darkest-green hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="justify-center flex flex-row self-center">
                <LoginButton />
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
                  Sign in with Google
                </button>
              </div>

              <div className="mt-6">
                <p>
                  Don't have an account? &nbsp;
                  <Link href="/sign-up/user" className="underline">
                    Sign Up
                  </Link>
                </p>
              </div>
              {/* {errorMessage && (
                <div
                  className="flex h-8 items-end space-x-1"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <OrangeButton
      variant="action"
      type="submit"
      className="mt-4 w-full"
      aria-disabled={pending}
    >
      {pending ? "Logging in..." : "Login"}
    </OrangeButton>
  );
}
