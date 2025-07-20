"use client";
import { SignUpCardClientSupport } from "@/components/auth/signup-card-client-support";
import { SignUpCardProvider } from "@/components/auth/signup-card-provider";
import CMWStackedHeader from "../headers/cmw-stacked-header";

export default function UserTypeSignUp() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 my-14 mt-2 md:mt-4">
      <div className="flex flex-col my-10 px-4 py-4 ">
        <CMWStackedHeader title="Sign Up to Care My Way" />
        <p className="text-h6-size mb-4 text-darkest-green">
          Select the option that best describes you.{" "}
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 px-4 w-full max-w-5xl">
        <div className="flex">
          <SignUpCardClientSupport />
        </div>
        <div className="flex">
          <SignUpCardProvider />
        </div>
      </div>
    </main>
  );
}
