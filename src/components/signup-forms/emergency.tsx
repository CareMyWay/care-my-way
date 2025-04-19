"use client";
import React from "react";
import OrangeButton from "@/components/buttons/orange-button";
import { useState } from "react";
import RegistrationLayout from "../layouts/registration-layout";
import RegistrationHeader from "./registration-header";

const INPUT_STYLES =
  "w-full rounded-[5px] bg-primary-white border border-[#B5BAC0] h-12 px-4 focus:outline-none focus:ring-1 focus:ring-dark-green";

export default function EmergencyForm() {
  const [hasSupportPerson, setHasSupportPerson] = useState("");

  return (
    <RegistrationLayout step={3}>
      <RegistrationHeader step={3} title="Emergency Contact & Support Person" />
      <form className="space-y-4">
        {/* Name fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-darkest-green">
              Contact First Name
            </label>
            <input
              type="text"
              className={INPUT_STYLES}
              placeholder="First Name"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-darkest-green">
              Contact Last Name
            </label>
            <input
              type="text"
              className={INPUT_STYLES}
              placeholder="Last Name"
            />
          </div>
        </div>

        {/* Relationship*/}
        <div>
          <label className="block text-sm mb-1 text-darkest-green">
            Relationship
          </label>
          <input
            type="text"
            className={INPUT_STYLES}
            placeholder="Relationship"
          />
        </div>

        {/* Phone number */}
        <div>
          <label className="block text-sm mb-1 text-darkest-green">
            Phone Number
          </label>
          <input
            type="text"
            className={INPUT_STYLES}
            placeholder="Phone Number"
          />
        </div>
        {/* Support Person */}
        <div>
          <label className="block text-sm mb-1 text-darkest-green">
            Do you have a Support Person who will represent you?
          </label>
          <select
            className={INPUT_STYLES}
            value={hasSupportPerson}
            onChange={(e) => setHasSupportPerson(e.target.value)}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>{" "}
        </div>

        {/* Conditionally Rendered Checkbox */}
        {hasSupportPerson === "yes" && (
          <div className="flex flex-col items-start space-x-2">
            <h1 className="block text-sm  text-darkest-green">
              Support Person
            </h1>
            <span className="my-2 ">
              <input
                type="checkbox"
                id="consentCheckbox"
                className="h-4 w-4 text-medium-green border-gray-300 rounded focus:ring-dark-green"
              />
              <label
                htmlFor="consentCheckbox"
                className="text-sm text-darkest-green ms-1 "
              >
                Same as Emergency Contact
              </label>
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <OrangeButton
            variant="route"
            href="/client/sign-up/create-account/address"
            label="Back"
          />
          <OrangeButton
            variant="route"
            href="/client/sign-up/create-account"
            label="Next"
          />
        </div>
      </form>
    </RegistrationLayout>
  );
}
