import React from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { useState } from "react";
import OrangeButton from "../buttons/orange-button";
import RegistrationLayout from "../layouts/registration-layout";
import RegistrationHeader from "./registration-header";

const INPUT_STYLES =
  "w-full rounded-[5px] bg-primary-white border border-[#B5BAC0] h-12 px-4 focus:outline-none focus:ring-1 focus:ring-dark-green";

export default function AddressForm() {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");

  const onChangeCountry = (val: string) => {
    setCountry(val);
    if (!val) {
      setRegion("");
    }
  };
  return (
    <RegistrationLayout step={2}>
      <RegistrationHeader step={2} title="Address" />
      <form className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-darkest-green">
            Home Address
          </label>
          <input
            type="text"
            className={INPUT_STYLES}
            placeholder="Home Address"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm mb-1 text-darkest-green">City</label>
          <input type="tel" className={INPUT_STYLES} placeholder="City" />
        </div>

        {/* Province */}
        <div>
          <label className="block text-sm mb-1 text-darkest-green">
            Country
          </label>
          {/* <input type="tel" className={INPUT_STYLES} placeholder="Province" /> */}
          <CountryDropdown
            value={country}
            onChange={onChangeCountry}
            className={`block text-sm mb-1   text-darkest-green ${INPUT_STYLES}`}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-darkest-green">
            Province
          </label>
          <RegionDropdown
            country={country}
            value={region}
            onChange={(val) => setRegion(val)}
            className={`block text-sm mb-1   text-darkest-green ${INPUT_STYLES}`}
          />
        </div>
        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <OrangeButton
            variant="route"
            href="/client/sign-up/create-account/personal"
            label="Back"
          />
          <OrangeButton
            variant="route"
            href="/client/sign-up/create-account/emergency"
            label="Next"
          />
        </div>
      </form>
    </RegistrationLayout>
  );
}
