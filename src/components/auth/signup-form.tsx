"use client";

import Link from "next/link";
import React, { useActionState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { useFormStatus } from "react-dom";
import OrangeButton from "@/components/buttons/orange-button";
import { handleSignUp } from "@/actions/cognitoActions";
import { useSearchParams } from "next/navigation";
// import { AuthUser } from "aws-amplify/auth";

import CMWStackedHeader from "../headers/cmw-stacked-header";

// const SignUpForm = ({ user }: { user?: AuthUser }) => {
const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const [, dispatch] = useActionState(handleSignUp, undefined);
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType"); // Get from query

  const passwordErrors = [];
  if (password.length < 8) {
    passwordErrors.push("At least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    passwordErrors.push("At least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    passwordErrors.push("At least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    passwordErrors.push("At least one number");
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    passwordErrors.push("At least one special character");
  }

  return (
    <div className="relative min-h-screen px-4">
      <Link
        href="/sign-up/user"
        className="absolute top-4 left-0 flex items-center text-md text-darkest-green hover:underline z-10"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />{" "}
        <p className="text-xl">Return to roles</p>
      </Link>
      <main className="flex items-center justify-center pt-20">
        {/* Back to home */}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                {password && passwordErrors.length > 0 && (
                  <ul className="text-sm text-red-700 space-y-1 mt-1 list-disc list-inside">
                    {passwordErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                )}

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
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

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

export default SignUpForm;
