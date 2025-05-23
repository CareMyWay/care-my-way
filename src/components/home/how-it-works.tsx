import React from "react";
import OrangeButton from "../buttons/orange-button";

const client_steps = [
  {
    id: 1,
    stepNum: "Step 1",
    stepTitle: "Browse and Search",
    content: [
      "Explore profiles of experienced caregivers.",
      "Filter by availability, location, services offered, and ratings.",
      "View caregiver details, including certifications and reviews.",
    ],
  },
  {
    id: 2,
    stepNum: "Step 2",
    stepTitle: "Book Caregiver",
    content: [
      "Select a caregiver that fits your needs.",
      "Send a booking request with your preferred date, time, and care requirements.",
      "Communicate directly with the caregiver through our secure chat.",
    ],
  },
  {
    id: 3,
    stepNum: "Step 3",
    stepTitle: "Receive Quality Care",
    content: [
      "Confirm your booking and receive personalized care.",
      "Easily manage and modify bookings from your dashboard.",
      "Leave a review to help others find great caregivers.",
    ],
  },
];

const provider_steps = [
  {
    id: 1,
    stepNum: "Step 1",
    stepTitle: "Browse and Search",
    content: [
      "Sign up and complete your caregiver profile.",
      "Add your qualifications, experience, and availability.",
      "Get verified and approved to start receiving bookings.",
    ],
  },
  {
    id: 2,
    stepNum: "Step 2",
    stepTitle: "Patient Bookings",
    content: [
      "Receive booking requests based on your skills and availability.",
      "Chat securely with clients to understand their needs.",
      "Accept bookings and confirm your schedule.",
    ],
  },
  {
    id: 3,
    stepNum: "Step 3",
    stepTitle: "Provide Quality Care",
    content: [
      "Deliver quality care and support.",
      "Get paid securely through our platform.",
      "Build a strong reputation through client reviews.",
    ],
  },
];

export function HowItWorks() {
  return (
    <section className="md:mx-10 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-h3-size md:text-h2-size text-center md:text-start">
          How It Works
        </h2>
        <h4 className="mb-10 text-h4-size text-center md:text-start">
          For Clients
        </h4>
        {/* For Clients */}
        <div className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {client_steps.map(
              ({
                id,
                stepNum,
                stepTitle,
                content,
              }: {
                id: number;
                stepNum: string;
                stepTitle: string;
                content: string[];
              }) => (
                <div key={id} className="h-full">
                  <div className="border-2 border-input-border-gray text-darkest-green rounded-lg p-6 flex flex-col h-full min-h-[28rem] w-full max-w-[28rem] ">
                    {/* Step number and title */}
                    <div className="text-center font-bold mt-2">
                      <h5 className="text-h5-size uppercase">{stepNum}</h5>
                      <h6 className="text-h6-size">{stepTitle}</h6>
                    </div>

                    {/* Spacer to push ul into center */}
                    <div className="flex-grow flex items-center justify-center">
                      <ul className="list-disc list-inside space-y-4 text-body4-size text-start p-2 md:p-10">
                        {content.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="w-full mt-8">
            <p className=" text-darkest-green text-body3-size text-center md:text-start">
              Not sure where to start?
            </p>
            <p className="mb-12 text-darkest-green text-body3-size text-center md:text-start">
              Take our Health Transition Quiz to find caregivers best suited to
              your needs.
            </p>
            <div className="flex justify-center md:justify-start">
              <OrangeButton variant="route" href="/">
                Join Today
              </OrangeButton>
            </div>{" "}
          </div>
        </div>

        {/* For Caregivers */}
        <div>
          <h4 className="mb-10 text-h4-size text-center md:text-start">
            For Healthcare Providers
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {provider_steps.map(
              ({
                id,
                stepNum,
                stepTitle,
                content,
              }: {
                id: number;
                stepNum: string;
                stepTitle: string;
                content: string[];
              }) => (
                <div key={id} className="h-full">
                  <div className="border-2 border-input-border-gray text-darkest-green rounded-lg p-6 flex flex-col h-full min-h-[28rem] w-full max-w-[28rem] ">
                    {/* Step number and title */}
                    <div className="text-center font-bold mt-2">
                      <h5 className="text-h5-size uppercase">{stepNum}</h5>
                      <h6 className="text-h6-size">{stepTitle}</h6>
                    </div>

                    {/* Spacer to push ul into center */}
                    <div className="flex-grow flex items-center justify-center">
                      <ul className="list-disc list-inside space-y-4 text-body4-size text-start p-2 md:p-10">
                        {content.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          <div className="w-full mt-8">
            <p className="mb-4 text-darkest-green text-body3-size text-center md:text-start">
              Join <strong>Care My Way</strong> today and connect with clients
              looking for trusted caregivers like you.
            </p>
            <p className="mb-12  text-darkest-green text-body3-size text-center md:text-start">
              Set your schedule, showcase your skills, and start making a
              difference!
            </p>
            <div className="flex justify-center md:justify-start">
              <OrangeButton variant="route" href="/">
                Join Today
              </OrangeButton>
            </div>{" "}
          </div>
        </div>
      </div>
    </section>
  );
}
