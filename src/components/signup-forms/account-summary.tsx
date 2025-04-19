import React from "react";
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
