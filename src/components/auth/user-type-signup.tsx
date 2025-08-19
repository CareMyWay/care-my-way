"use client";
import { SignUpCardClientSupport } from "@/components/auth/signup-card-client-support";
import { SignUpCardProvider } from "@/components/auth/signup-card-provider";
import CMWStackedHeader from "../headers/cmw-stacked-header";

export default function UserTypeSignUp() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 py-10 sm:py-16">
      {/* Header */}
      <div className="flex flex-col mb-8 text-center">
        <CMWStackedHeader title="Sign Up to Care My Way" />
        <p className="text-base sm:text-lg text-darkest-green mt-2">
          Select the option that best describes you.
        </p>
      </div>

      {/* Cards layout */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 w-full max-w-5xl px-2 sm:px-4">
        <SignUpCardClientSupport />
        <SignUpCardProvider />
      </div>
    </main>
  );
}
