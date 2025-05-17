"use client";
import React from "react";
// import SignUpForm from "@/components/signup-forms/signup-form";

import { useState } from "react";

// import SignUps from "@/components/signup-forms/sign-up";
// import NavBar from "@/components/navbars/navbar";
// // import { isAuthenticated } from "@/utils/amplify-server-utils";
// import { SignUpCard } from "@/components/signup-forms/sign-up-card";

import { LogoStepBar } from "@/components/signup/LogoStepBar";
import SignUpStep1 from "@/components/signup/SignUpStep1";
import SignUpStep2 from "@/components/signup/SignUpStep2";
import SignUpStep3 from "@/components/signup/SignUpStep3";
import SignUpStep4 from "@/components/signup/SignUpStep4";

export default function SignUp() {
  const [currStep, setCurrStep] = useState(1);

  if (currStep > 4) {
    window.location.replace("/signin");
  }

  return (
    <div>
      {/* <NavBar isSignedIn={await isAuthenticated()} /> */}
      {/* <SignUpForm /> */}

      <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-primary-white py-3">
        <LogoStepBar />
      </div>
      <main className="min-h-screen flex flex-col">
        <div className="flex flex-row w-full border-b-2 border-darkest-green">
          {Array.from({ length: 4 }, (_, i) => i).map((_, idx) => (
            <div
              className={`mx-0.5 w-full h-[69px] ${idx < currStep ? " bg-darkest-green " : " "}`}
              key={idx}
            >
              &nbsp;
            </div>
          ))}
        </div>
        {currStep === 1 && <SignUpStep1 voidNext={() => setCurrStep(2)} />}
        {currStep === 2 && <SignUpStep2 voidNext={() => setCurrStep(3)} />}
        {currStep === 3 && <SignUpStep3 voidNext={() => setCurrStep(4)} />}
        {currStep === 4 && <SignUpStep4 voidNext={() => setCurrStep(5)} />}
      </main>
    </div>
  );
}
