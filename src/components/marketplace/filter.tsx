"use client";

import React from "react";

import { useState } from "react";
import {RangeSlider} from "@/components/slider/range-slider";
import {Input} from "@/components/inputs/input";
import GreenButton from "@/components/buttons/green-button";
import {MultipleSelect} from "@/components/select/multipleSelect";
import {Availability} from "@/components/calendar/availability";
import {Select} from "@/components/select/standardSelect";
import ISO6391 from "iso-639-1";
import {getServiceNames} from "@/utils/healthcare-services";
import {useTranslation} from "react-i18next";
//import "/i18n";

const MarketplaceFilter = ({
                             minPrice,
                             maxPrice,
                             availability,
                             experience,
                             specialty,
                             languagePreference,
                             setMinPrice, setMaxPrice, setAvailability, setExperience, setSpecialty, setLanguagePreference, triggerFetch}
                           :{
                              minPrice: number;
                              maxPrice: number;
                              availability: string[];
                              experience: number;
                              specialty: string[];
                              languagePreference: string[];
                              setMinPrice: React.Dispatch<React.SetStateAction<number>>;
                              setMaxPrice: React.Dispatch<React.SetStateAction<number>>;
                              setAvailability: React.Dispatch<React.SetStateAction<string[]>>;
                              setExperience: React.Dispatch<React.SetStateAction<number>>;
                              setSpecialty: React.Dispatch<React.SetStateAction<string[]>>;
                              setLanguagePreference: React.Dispatch<React.SetStateAction<string[]>>;
                              triggerFetch: () => void;
                            }) => {
  const { t } = useTranslation();

  const thisSliderMinValue = 0;
  const thisSliderMaxValue = 200;

  const [priceRange, setPriceRange] = useState([thisSliderMinValue, thisSliderMaxValue]);
  const [showFilters, setShowFilters] = useState(false);
  const handleExpChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExperience(Number(e.target.value));
  };

  const languageLabelPool = [...ISO6391.getAllNames().sort().map(r => {return t(r);}), "Other"];
  const languageValuePool = [...ISO6391.getAllNames().sort(), "Other"];
  const serviceLabelPool = getServiceNames();
  const serviceValuePool = getServiceNames().map((e) => { return t(e); });

  // console.info(ISO6391.getAllCodes());
  // console.info(ISO6391.getAllNames());

  const handleSliderChange = (value: number[]) => {
    setPriceRange(value);
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(parseInt(value, 10));
    if (Number(value) >= thisSliderMinValue && Number(value) <= Number(maxPrice)) {
      setPriceRange([Number(value), priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(parseInt(value, 10));
    if (Number(value) >= Number(minPrice) && Number(value) <= thisSliderMaxValue) {
      setPriceRange([priceRange[0], Number(value)]);
    }
  };

  const handleApply = () => {
    triggerFetch();
  };

  return (
    <>
      {/* Filters */}
      <div className="w-full lg:w-80 shrink-0 ml-1 lg:ml-5">
        <div className="border text-input-border-gray rounded-lg p-6">
          <div className="flex flex-row justify-between items-center">
            <h5 className="text-[23px] text-darkest-green font-bold mb-6">{t("Filters")}</h5>
            <div className="text-[23px] font-bold mb-6 visible lg:invisible cursor-pointer"
                 onClick={() => setShowFilters(!showFilters)} role="button" tabIndex={0} onKeyDown={() => setShowFilters(!showFilters)} aria-label="Show Filters">
                 <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24">
                  <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" className={`${showFilters? "visible" : "invisible"} lg:invisible`}/>
                  <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" className={`${showFilters? "invisible" : "visible"} lg:invisible`} />
                  <path d="M0 0h24v24H0z" fill="none" />
                </svg>
            </div>
          </div>
          {/* Pay Rate */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="mb-6">
              <p className="text-[16px] mb-3">{t("Pay Rate")}</p>
              <div className="text-medium-green font-extrabold text-[20px] mb-4">
                ${priceRange[0]} - ${priceRange[1]}
              </div>

              <RangeSlider
                defaultValue={priceRange}
                min={0}
                max={200}
                step={1}
                value={priceRange}
                onValueChange={handleSliderChange}
                className="mb-4"
              />

              <div className="flex items-center space-x-2">
                <Input type="text" value={minPrice} onChange={handleMinPriceChange} className="w-24 text-center" />
                <span className="text-input-border-gray">—</span>
                <Input type="text" value={maxPrice} onChange={handleMaxPriceChange} className="w-24 text-center" />
              </div>
            </div>
            <Availability subtitle={t("Availability")} selectedAvailability={availability} setSelectedAvailability={setAvailability}/>

            {/* Experience */}
            <div className="mb-6">
              <h3 className="text-[16px] text-darkest-green mb-3">{t("Experience")}</h3>
              {/*<Input type="text" placeholder="Years of experience" className="w-full h-[41px]" />*/}
              <Select className="mt-4" value={experience} onChange={handleExpChange} >
                <option value="0">0+ {t("years")}</option>
                <option value="1">1+ {t("years")}</option>
                <option value="3">3+ {t("years")}</option>
                <option value="5">5+ {t("years")}</option>
              </Select>
            </div>
            <MultipleSelect itemOptionLabels={serviceLabelPool} itemOptionValues={serviceValuePool} subTitle={t("Specialty")} selectedItems={specialty} setSelectedItems={setSpecialty} />
            <MultipleSelect itemOptionLabels={languageLabelPool} itemOptionValues={languageValuePool} subTitle={t("Language")} selectedItems={languagePreference} setSelectedItems={setLanguagePreference} />
            <div className="flex items-center justify-center">
              <GreenButton variant="action" className={"mt-6"} onClick={handleApply}>{t("Apply")}</GreenButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketplaceFilter;
