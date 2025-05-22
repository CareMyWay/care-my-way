"use client";
import { SignUpCardClientSupport } from "@/components/auth/signup-card-client-support";
import { SignUpCardProvider } from "@/components/auth/signup-card-provider";

export default function UserTypeSignUp() {
  return (
    <div className="min-h-screen py-12 flex flex-col justify-center items-center">
      <div className="mb-6 px-4">
        <h6 className="text-h6-size text-medium text-center">
          What are you looking for? Pick an option.
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
