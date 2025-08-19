"use client";

import Link from "next/link";
import React, { useActionState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import OrangeButton from "@/components/buttons/orange-button";
import { handleSignUp } from "@/actions/cognitoActions";
import { useSearchParams } from "next/navigation";
import CMWStackedHeader from "../headers/cmw-stacked-header";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const [, dispatch] = useActionState(handleSignUp, undefined);
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType");

  const passwordErrors: string[] = [];
  if (password.length < 8) passwordErrors.push("At least 8 characters");
  if (!/[A-Z]/.test(password))
    passwordErrors.push("At least one uppercase letter");
  if (!/[a-z]/.test(password))
    passwordErrors.push("At least one lowercase letter");
  if (!/[0-9]/.test(password)) passwordErrors.push("At least one number");
  if (!/[^A-Za-z0-9]/.test(password))
    passwordErrors.push("At least one special character");

  return (
    <div className="relative min-h-screen px-2 md:px-6 lg:px-8">
      <main className="flex items-center justify-center pt-20 pb-10">
        {/* Back link */}
        <Link
          href="/sign-up/user"
          className="absolute top-4 left-4 flex items-center text-sm sm:text-base text-darkest-green hover:underline z-10"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <p className="text-base sm:text-lg">Return to Who You Are</p>
        </Link>

        {/* Form */}
        <form
          action={dispatch}
          className="w-full max-w-4xl space-y-5 md:bg-white rounded-2xl md:px-6 md:py-12 md:shadow-2xl mx-auto"
        >
          <CMWStackedHeader title="Sign up to Care My Way" />
          <input type="hidden" name="userType" value={userType ?? ""} />

          <p className="text-center text-base sm:text-lg text-darkest-green">
            Create your account today.
          </p>

          <div className="space-y-5 md:w-[600px] sm:max-w-xl md:max-w-8xl lg:max-w-5xl xl:max-w-4xl mx-auto">
            {" "}
            {/* First Name */}
            <div className="space-y-2">
              <label
                htmlFor="first-name"
                className="text-darkest-green std-form-label "
              >
                First Name
              </label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                placeholder="First Name"
                className="std-form-input w-full"
                required
              />
            </div>
            {/* Last Name */}
            <div className="space-y-2">
              <label
                htmlFor="last-name"
                className="text-darkest-green std-form-label"
              >
                Last Name
              </label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                placeholder="Last Name"
                className="std-form-input w-full"
                required
              />
            </div>
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-darkest-green std-form-label"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                className="std-form-input w-full"
                required
              />
            </div>
            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-darkest-green std-form-label"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="std-form-input pr-10 w-full"
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
            {/* Password errors */}
            {password && passwordErrors.length > 0 && (
              <ul className="text-xs sm:text-sm text-red-700 space-y-1 mt-1 list-disc list-inside">
                {passwordErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            )}
            {/* Submit */}
            <div className="flex justify-center">
              <SignUpButton />
            </div>
          </div>

          {/* Divider & Google */}
          <div className="text-center">
            <p className="text-gray-500 text-xs sm:text-sm">— OR —</p>

            <div className="flex justify-center mt-4">
              <button className="transparent-button rounded-full flex items-center font-bold px-6 sm:px-10 py-3 sm:py-4 gap-2 border border-gray-400 text-sm sm:text-base">
                <Image
                  src="/svgs/icon-google.svg"
                  alt="Sign up with Google Button"
                  width={20}
                  height={20}
                />
                Sign up with Google
              </button>
            </div>

            <div className="mt-6 text-sm sm:text-base">
              <p>
                Already have an account? &nbsp;
                <Link href="/login" className="underline">
                  Sign In
                </Link>
              </p>
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
