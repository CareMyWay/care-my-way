"use client";
import { SignUpCardClientSupport } from "@/components/auth/signup-card-client-support";
import { SignUpCardProvider } from "@/components/auth/signup-card-provider";

export default function UserTypeSignUp() {
  return (
    <div className="min-h-screen py-12 flex flex-col justify-center items-center">
      <div className="mb-10 px-4">
        <h4 className="mb-4 text-h4-size text-medium text-center">
          Sign Up to Care My Way.
        </h4>
        <h6 className="text-h6-size text-medium text-center">
          Select the option that best describes you.
        </h6>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 px-4 w-full max-w-5xl">
        <div className="flex">
          <SignUpCardClientSupport />
        </div>
        <div className="flex">
          <SignUpCardProvider />
        </div>
      </div>
    </div>
  );
}
