"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import OrangeButton from "@/components/buttons/orange-button";
import { handleSignIn } from "@/actions/cognitoActions";
import CMWStackedHeader from "../headers/cmw-stacked-header";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [state, dispatch] = useActionState(handleSignIn, undefined);

  useEffect(() => {
    if (state && typeof state === "string" && state.startsWith("/")) {
      router.push(state);
    }
  }, [state, router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 my-14 mt-2 md:mt-4">
      <form action={dispatch} className="space-y-3">
        <CMWStackedHeader title="Login to Care My Way" />

        <div className="flex flex-row w-full justify-center">
          <p className="text-h6-size mb-12 text-darkest-green">
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
                className="text-darkest-green mb-3 mt-5 std-form-label"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="std-form-input pr-10"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {state && !state.startsWith("/") && (
              <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
              >
                <p className="text-sm text-red-700">{state}</p>
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
                Don&apos;t have an account? &nbsp;
                <Link href="/sign-up/user" className="underline">
                  Sign Up
                </Link>
              </p>
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
