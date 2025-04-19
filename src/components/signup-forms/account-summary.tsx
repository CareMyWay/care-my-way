// pages/create-account.tsx
import React from "react";
import Image from "next/image";
import { StepCard } from "./step-card";
import { CareMyWayHeader } from "../headers/care-my-way";
const steps = [
  {
    stepNum: 1,
    title: "Personal Information",
    subtitle: "This section has not started.",
    href: "/client/sign-up/create-account/personal",
  },
  {
    stepNum: 2,
    title: "Address Information",
    subtitle: "This section has not started.",
    href: "/client/sign-up/create-account/address",
  },
  {
    stepNum: 3,
    title: "Emergency & Support Person Information",
    subtitle: "This section has not started.",
    href: "/client/sign-up/create-account/emergency",
  },
];

const AccountSummary = () => {
  return (
    <div className="min-h-screen bg-primary-white px-4 py-8 md:px-16 lg:px-32">
      <CareMyWayHeader />
      {/* Header */}
      {/* <div className="flex items-center mb-10">
        <Image
          src="/svgs/CMW_Logo.svg"
          width={8}
          height={8}
          alt="Care My Way Logo"
          className="w-8 h-8 mr-3"
        />
        <h1 className="text-2xl font-bold text-darkest-green">Care My Way</h1>
      </div> */}

      {/* Title */}
      <h2 className="text-3xl font-semibold text-darkest-green mb-6">
        Create your Account
      </h2>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map(({ stepNum, title, subtitle, href }) => (
          <StepCard
            href={href}
            key={stepNum}
            stepNum={stepNum}
            title={title}
            subtitle={subtitle}
          />
        ))}
      </div>
    </div>
  );
};

export default AccountSummary;
