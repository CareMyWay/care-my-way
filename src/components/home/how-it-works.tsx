import React from "react";
import OrangeButton from "../buttons/orange-button";

const clientSteps = [
  {
    step: "Step 1",
    title: "Tell Us Your Needs",
    description:
      "Answer a few quick questions about the care you’re looking for. Share your preferences, schedule, and any special requirements to help us match you with the right provider.",
  },
  {
    step: "Step 2",
    title: "Get Matched",
    description:
      "We’ll connect you with qualified, trusted providers who fit your needs. Review profiles, check credentials, and choose the provider that’s right for you.",
  },
  {
    step: "Step 3",
    title: "Book & Begin Care",
    description:
      "Schedule your first visit and get the support you need. Manage appointments and communicate with your provider directly through our platform.",
  },
];

const providerSteps = [
  {
    step: "Step 1",
    title: "Create Your Profile",
    description:
      "Showcase your skills, experience, and availability to potential clients. Highlight your certifications and areas of expertise.",
  },
  {
    step: "Step 2",
    title: "Get Matched",
    description:
      "Receive requests from clients who need your expertise. Review their needs and accept the opportunities that fit your schedule.",
  },
  {
    step: "Step 3",
    title: "Start Providing Care",
    description:
      "Accept bookings, connect with clients, and make a difference in your community. Manage your appointments and profile with ease.",
  },
];

const StepBox = ({
  step,
  title,
  description,
  color,
}: {
  step: string;
  title: string;
  description: string;
  color: string;
}) => (
  <div
    className={`flex flex-col items-start bg-white border-2 ${color} rounded-xl p-8 w-full max-w-lg min-h-[270px] mx-auto`}
  >
    <span className="text-sm font-bold uppercase tracking-wide mb-2 text-medium-green">{step}</span>
    <h3 className="text-lg font-semibold mb-2 text-darkest-green">{title}</h3>
    <p className="text-sm text-gray-700">{description}</p>
  </div>
);

export function HowItWorks() {
  return (
    <section className="py-16 bg-lightest-green">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="mb-8 text-3xl md:text-4xl font-bold text-darkest-green text-left">
          How It Works
        </h2>
        {/* For Clients */}
        <h4 className="mb-6 text-xl font-semibold text-darkest-green text-left">
          For Clients
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {clientSteps.map((step, idx) => (
            <StepBox
              key={idx}
              step={step.step}
              title={step.title}
              description={step.description}
              color="border-medium-green"
            />
          ))}
        </div>
        <div className="flex justify-start mb-12">
          <OrangeButton
            variant="route"
            href="/"
            className="px-6 py-2 text-base"
          >
            Find a Healthcare Provider
          </OrangeButton>
        </div>
        {/* For Providers */}
        <h4 className="mb-6 text-xl font-semibold text-darkest-green text-left">
          For Healthcare Providers
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {providerSteps.map((step, idx) => (
            <StepBox
              key={idx}
              step={step.step}
              title={step.title}
              description={step.description}
              color="border-darkest-green"
            />
          ))}
        </div>
        <OrangeButton
          variant="route"
          href="/"
          className="px-6 py-2 text-base"
        >
          Join as a Provider
        </OrangeButton>
      </div>
    </section>
  );
}