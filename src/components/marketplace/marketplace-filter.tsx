"use client";

import React, { useState } from "react";
import { RangeSlider } from "@/components/ui/range-slider";
import { Input } from "@/components/ui/input";
import GreenButton from "@/components/buttons/green-button";
import { MultipleSelect } from "@/components/select/multi-select";
import { Availability } from "@/components/marketplace/availability";
import { Select } from "@/components/select/standard-select";
import ISO6391 from "iso-639-1";
import { getServiceNames } from "@/utils/healthcare-services";

const MarketplaceFilter = ({
  minPrice,
  maxPrice,
  availability,
  experience,
  specialty,
  languagePreference,
  setMinPrice,
  setMaxPrice,
  setAvailability,
  setExperience,
  setSpecialty,
  setLanguagePreference,
  triggerFetch,
}: {
  minPrice: number;
  maxPrice: number;
  availability: string[];
  experience: { min: number; max: number };
  specialty: string[];
  languagePreference: string[];
  setMinPrice: React.Dispatch<React.SetStateAction<number>>;
  setMaxPrice: React.Dispatch<React.SetStateAction<number>>;
  setAvailability: React.Dispatch<React.SetStateAction<string[]>>;
  setExperience: React.Dispatch<
    React.SetStateAction<{ min: number; max: number }>
  >;
  setSpecialty: React.Dispatch<React.SetStateAction<string[]>>;
  setLanguagePreference: React.Dispatch<React.SetStateAction<string[]>>;
  triggerFetch: () => void;
}) => {
  const thisSliderMinValue = 0;
  const thisSliderMaxValue = 200;

  const [priceRange, setPriceRange] = useState([
    thisSliderMinValue,
    thisSliderMaxValue,
  ]);
  const [showFilters, setShowFilters] = useState(false);

  const languagePool = [...ISO6391.getAllNames().sort(), "Other"];
  const servicePool = getServiceNames();

  const handleSliderChange = (value: number[]) => {
    setPriceRange(value);
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(parseInt(value, 10));
    if (
      Number(value) >= thisSliderMinValue &&
      Number(value) <= Number(maxPrice)
    ) {
      setPriceRange([Number(value), priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(parseInt(value, 10));
    if (
      Number(value) >= Number(minPrice) &&
      Number(value) <= thisSliderMaxValue
    ) {
      setPriceRange([priceRange[0], Number(value)]);
    }
  };

  const handleApply = () => {
    triggerFetch();
  };

  const handleClearFilters = () => {
    window.location.reload();
  };

  return (
    <div className="w-full lg:w-80 shrink-0 ml-1 lg:ml-5">
      <div className="border text-input-border-gray rounded-lg p-6">
        <div className="flex flex-row justify-between items-center">
          <h5 className="text-[23px] text-darkest-green font-bold mb-6">
            Filters
          </h5>
          <div
            className="text-[23px] font-bold mb-6 visible lg:invisible cursor-pointer"
            onClick={() => setShowFilters(!showFilters)}
            role="button"
            tabIndex={0}
            onKeyDown={() => setShowFilters(!showFilters)}
            aria-label="Show Filters"
          >
            {/* toggle icon */}
          </div>
        </div>

        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          {/* Pay Rate */}
          <div className="mb-6">
            <p className="text-[16px] mb-3">Pay Rate</p>
            <div className="text-medium-green font-extrabold text-[20px] mb-4">
              ${priceRange[0]} - ${priceRange[1]}
            </div>
            <RangeSlider
              defaultValue={priceRange}
              min={thisSliderMinValue}
              max={thisSliderMaxValue}
              step={1}
              value={priceRange}
              onValueChange={handleSliderChange}
              className="mb-4"
            />
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={minPrice}
                onChange={handleMinPriceChange}
                className="w-24 text-center"
              />
              <span className="text-input-border-gray">—</span>
              <Input
                type="text"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                className="w-24 text-center"
              />
            </div>
          </div>

          <Availability
            subtitle={"Availability"}
            selectedAvailability={availability}
            setSelectedAvailability={setAvailability}
          />

          {/* Experience */}
          <div className="mb-6">
            <h3 className="text-[16px] text-darkest-green mb-3">Experience</h3>
            <Select
              className="mt-4"
              value={`${experience.min}-${experience.max}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split("-").map(Number);
                setExperience({ min, max });
              }}
            >
              <option value="">Select years of experience</option>
              <option value="0-0.9">Less than 1 year</option>
              <option value="1-2">1-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6-100">6+ years</option>
            </Select>
          </div>

          <MultipleSelect
            itemOptions={servicePool}
            subTitle={"Specialty"}
            selectedItems={specialty}
            setSelectedItems={setSpecialty}
          />
          <MultipleSelect
            itemOptions={languagePool}
            subTitle={"Language"}
            selectedItems={languagePreference}
            setSelectedItems={setLanguagePreference}
          />

          <div className="flex items-center justify-center gap-4">
            <GreenButton
              variant="action"
              className={"mt-6"}
              onClick={handleApply}
            >
              Apply
            </GreenButton>
            <button
              onClick={handleClearFilters}
              className="mt-6 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition"
              type="button"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceFilter;
