// pages/create-account.tsx
import React from "react";
import Image from "next/image";
import { StepCard } from "./step-card";

const steps = [
  {
    stepNum: 1,
    title: "Personal Information",
    subtitle: "This section has not started.",
  },
  {
    stepNum: 2,
    title: "Address Information",
    subtitle: "This section has not started.",
  },
  {
    stepNum: 3,
    title: "Emergency & Support Person Information",
    subtitle: "This section has not started.",
  },
  // {
  //   stepNum: 4,
  //   title: "Medical Information",
  //   subtitle: "This section has not started.",
  // },
  // {
  //   stepNum: 5,
  //   title: "Lifestyle & Habits",
  //   subtitle: "This section has not started.",
  // },
  // {
  //   stepNum: 6,
  //   title: "Functional & Cognitive Abilities",
  //   subtitle: "This section has not started.",
  // },
];

const AccountSummary = () => {
  return (
    <div className="min-h-screen bg-primary-white px-4 py-8 md:px-16 lg:px-32">
      {/* Header */}
      <div className="flex items-center mb-10">
        <Image
          src="/svgs/CMW_Logo.svg"
          width={8}
          height={8}
          alt="Care My Way Logo"
          className="w-8 h-8 mr-3"
        />
        <h1 className="text-2xl font-bold text-darkest-green">Care My Way</h1>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-semibold text-darkest-green mb-6">
        Create your Account
      </h2>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map(({ stepNum, title, subtitle }) => (
          <StepCard
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
