"use client";

import React from "react";

import { useState } from "react";
import {RangeSlider} from "@/components/slider/range-slider";
import {Input} from "@/components/inputs/input";
import GreenButton from "@/components/buttons/green-button";
import {MultipleSelect} from "@/components/select/multipleSelect";
import {Availability} from "@/components/calendar/availability";
import {Select} from "@/components/select/standardSelect";

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
  const thisSliderMinValue = 0;
  const thisSliderMaxValue = 200;

  const [priceRange, setPriceRange] = useState([thisSliderMinValue, thisSliderMaxValue]);
  /**
   * const [minPrice, setMinPrice] = useState(thisSliderMinValue);
   * const [maxPrice, setMaxPrice] = useState(thisSliderMaxValue);
   * const [availability, setAvailability] = useState<string[]>([]);
   * const [experience, setExperience] = useState<number>(0);
   * const [specialty, setSpecialty] = useState<string[]>([]);
   * const [languagePreference, setLanguagePreference] = useState<string[]>(["English"]);
   * */

  // const [inputLanName, setInputLanName] = useState("");
  // const [isOpen, setIsOpen] = useState(false);

  // const handleAvlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setAvailability([e.target.value]); // Fatal: to-do fix update rather than replace
  // };

  const handleExpChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExperience(Number(e.target.value));
  };

  // const handleSpcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSpecialty([e.target.value]); // Fatal: to-do fix update rather than replace
  // };

  const languagePool = ["English","French","Mandarin","Cantonese","Punjabi","Spanish","Arabic","Tagalog","Italian","Persian","Hindi"];
  const servicePool = ["Dementia Care", "Personal Care", "Health Monitoring", "Housekeeping", "Companionship", "Mobility Assistance", "Wound Care", "Medication Management", "Health Education"];

  // const updSelectedLanguage = (lanName : string , isAdding: boolean) =>{
  //
  //   if (languagePreference.some((item) => lanName === item)){
  //     if(isAdding){
  //       return;
  //     } else {
  //       const index = languagePreference.indexOf(lanName);
  //       setLanguagePreference(languagePreference.filter((_, idx) => idx !== index));
  //     }
  //   } else {
  //     if(isAdding){
  //       setLanguagePreference([...languagePreference, lanName.trim()]);
  //     } else {
  //       return;
  //     }
  //   }
  //
  // };

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

  // const filteredOptions = languagePool.filter(option =>
  //   option.toLowerCase().includes(inputLanName.toLowerCase())
  // );
  //
  // const handleBlur = () => {
  //   // Delay, so onClick on list items can fire first
  //   setTimeout(() => setIsOpen(false), 100);
  // };

  const handleApply = () => {
    triggerFetch();
    triggerFetch();
  };

  return (
    <>
      {/* Filters */}
      <div className="w-full md:w-80 shrink-0 ml-1 md:ml-5">
        <div className="border text-input-border-gray rounded-lg p-6">
          <h5 className="text-[23px] text-darkest-green font-bold mb-6">Filters</h5>

          {/* Pay Rate */}
          <div className="mb-6">
            <p className="text-[16px] mb-3">Pay Rate</p>
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

          {/* Availability
          <div className="mb-6">
            <h3 className="text-[16px] text-darkest-green mb-3">Availability</h3>
            <Input type="text" value={availability} onChange={handleAvlChange} placeholder="Select days and times" className="w-full h-[41px]" />
          </div> */}
          {/* Availability v2 */}
          <Availability subtitle={"Availability"} selectedAvailability={availability} setSelectedAvailability = {setAvailability}/>

          {/* Experience */}
          <div className="mb-6">
            <h3 className="text-[16px] text-darkest-green mb-3">Experience</h3>
            {/*<Input type="text" placeholder="Years of experience" className="w-full h-[41px]" />*/}
            <Select className="mt-4" value={experience} onChange={handleExpChange} >
              <option value="0">0+ years</option>
              <option value="1">1+ years</option>
              <option value="3">3+ years</option>
              <option value="5">5+ years</option>
            </Select>
          </div>

          {/* Specialty
          <div className="mb-6">
            <h3 className="text-[16px] text-darkest-green mb-3">Specialty</h3>
            <Input type="text" value={specialty} onChange={handleSpcChange} placeholder="Select specialties" className="w-full h-[41px]" />
          </div>
          */}

          {/* Specialty v2 */}
          <MultipleSelect itemOptions={servicePool} subTitle={"Specialty"} selectedItems={specialty} setSelectedItems={setSpecialty} />

          {/* Language v2 */}
          <MultipleSelect itemOptions={languagePool} subTitle={"Language"} selectedItems={languagePreference} setSelectedItems={setLanguagePreference} />
          {/* Language
          <div>
            <h3 className="text-[16px] text-darkest-green mb-3">Language</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {
                languagePreference.map((item, index) => (
                  <div key={index} className="px-4 py-1 rounded-full border border-input-border-gray text-darkest-green text-sm hover:bg-gray-200">
                    {item}
                    <button
                      className="font-extrabold text-[23px] ml-2 align-middle"
                      onClick={() => updSelectedLanguage(item, false)}>&times;</button>
                  </div>
                ))
              }
            </div>


            <div className="relative w-64">
              <Input
                type="text"
                value={inputLanName}
                placeholder="Search languages"
                className="w-full h-[41px]"
                onFocus={() => setIsOpen(true)}
                onBlur={handleBlur}
                onChange={e => setInputLanName(e.target.value)}
              />

              {isOpen && (
                <ul className="absolute z-10 w-full bg-primary-white border text-darkest-green rounded-md mt-1 max-h-48 overflow-y-auto shadow-md">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map(option => (
                      <li
                        key={option}
                        className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => {
                          setInputLanName("");
                          updSelectedLanguage(option, true);
                          setIsOpen(false);
                        }}
                      >
                        {option}
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-500">No results</li>
                  )}
                </ul>
              )}
            </div>
          </div>
           */}
          <div className="flex items-center justify-center">
            <GreenButton variant="action" className={"mt-6"} onClick={handleApply}>Apply</GreenButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketplaceFilter;
