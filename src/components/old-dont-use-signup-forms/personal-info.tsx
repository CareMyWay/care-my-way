import React from "react";

import OrangeButton from "../buttons/orange-button";
import RegistrationLayout from "../layouts/registration-layout";
import RegistrationHeader from "./registration-header";

const INPUT_STYLES =
  "w-full rounded-[5px] bg-primary-white border border-[#B5BAC0] h-12 px-4 focus:outline-none focus:ring-1 focus:ring-dark-green";

export default function PersonalInfoForm() {
  return (
    <RegistrationLayout step={1}>
      <RegistrationHeader step={1} title="Personal Information" />

      {/* Form Box */}
      <form className="space-y-4">
        {/* Name fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-darkest-green">
              First Name
            </label>
            <input
              type="text"
              className={INPUT_STYLES}
              placeholder="First Name"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-darkest-green">
              Last Name
            </label>
            <input
              type="text"
              className={INPUT_STYLES}
              placeholder="Last Name"
            />
          </div>
        </div>

        {/* Sex and DOB */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-darkest-green">Sex</label>
            <select className={INPUT_STYLES}>
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>{" "}
          </div>
          <div>
            <label className="block text-sm mb-1 text-darkest-green">
              Date of Birth
            </label>
            <input type="date" className={INPUT_STYLES} />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1 text-darkest-green">Email</label>
          <input
            type="email"
            className={INPUT_STYLES}
            placeholder="Email Address"
          />
        </div>

        {/* Phone number */}
        <div>
          <label className="block text-sm mb-1 text-darkest-green">
            Phone Number
          </label>
          <input
            type="tel"
            className={INPUT_STYLES}
            placeholder="Phone Number"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <OrangeButton
            variant="route"
            href="/client/sign-up/create-account"
            label="Back"
          />
          <OrangeButton
            variant="route"
            href="/client/sign-up/create-account/address"
            label="Next"
          />
        </div>
      </form>
    </RegistrationLayout>
  );
}
