'use client'

import React from "react";

import { useState } from "react"
import {RangeSlider} from "@/components/slider/range-slider";
import {Input} from "@/components/inputs/input";
import GreenButton from "@/components/buttons/green-button";

const MarketplaceFilter = () => {
  const [priceRange, setPriceRange] = useState([0, 200])
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("200")

  const [inputAvl, setInputAvl] = useState("");
  const [inputExp, setInputExp] = useState("");
  const [inputSpc, setInputSpc] = useState("");

  const handleAvlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAvl(e.target.value); // get the input value here
  }

  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputExp(e.target.value); // get the input value here
  }

  const handleSpcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSpc(e.target.value); // get the input value here
  }

  const lan_pool = ["English","French","Mandarin","Cantonese","Punjabi","Spanish","Arabic","Tagalog","Italian","Persian","Hindi"]

  const [need_lan, set_need_lan] = useState(["English"])

  const lan_select_upd = (lanName : string , isAdding: boolean) =>{

    if (need_lan.some((item) => lanName === item)){
      if(isAdding){
        return;
      } else {
        const index = need_lan.indexOf(lanName);
        set_need_lan(need_lan.filter((_, idx) => idx !== index));
      }
    } else {
      if(isAdding){
        set_need_lan([...need_lan, lanName.trim()])
      } else {
        return;
      }
    }

  }

  const handleSliderChange = (value: number[]) => {
    setPriceRange(value)
    setMinPrice(value[0].toString())
    setMaxPrice(value[1].toString())
  }

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMinPrice(value)
    if (Number(value) >= 0 && Number(value) <= Number(maxPrice)) {
      setPriceRange([Number(value), priceRange[1]])
    }
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMaxPrice(value)
    if (Number(value) >= Number(minPrice) && Number(value) <= 100) {
      setPriceRange([priceRange[0], Number(value)])
    }
  }

  const [inputLanName, setInputLanName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = lan_pool.filter(option =>
    option.toLowerCase().includes(inputLanName.toLowerCase())
  );

  const handleBlur = () => {
    // Delay so onClick on list items can fire first
    setTimeout(() => setIsOpen(false), 100);
  };

  const handleApply = () => {
    alert(
      "Language:" + need_lan + "\r\n" +
      "Availability:" + inputAvl + "\r\n" +
      "Experience:" + inputExp + "\r\n" +
      "Specialty:" + inputSpc + "\r\n" +
      "minPrice:" + minPrice + "\r\n" +
      "maxPrice:" + maxPrice)

  }

  return (
    <>
      {/* Filters */}
      <div className="w-full md:w-80 shrink-0 ml-5">
        <div className="border text-input-border-gray rounded-lg p-6">
          <h5 className="text-[23px] font-bold mb-6">Filters</h5>

          {/* Pay Rate */}
          <div className="mb-6">
            <p className="text-[16px] mb-3">Pay Rate</p>
            <div className="text-medium-green font-extrabold text-[20px] mb-4">
              ${priceRange[0]} - ${priceRange[1]}
            </div>

            <RangeSlider
              defaultValue={priceRange}
              min={0}
              max={100}
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

          {/* Availability */}
          <div className="mb-6">
            <h3 className="text-[16px] text-darkest-green mb-3">Availability</h3>
            <Input type="text" value={inputAvl} onChange={handleAvlChange} placeholder="Select days and times" className="w-full h-[41px]" />
          </div>

          {/* Experience */}
          <div className="mb-6">
            <h3 className="text-[16px] text-darkest-green mb-3">Experience</h3>
            <Input type="text" value={inputExp} onChange={handleExpChange} placeholder="Years of experience" className="w-full h-[41px]" />
          </div>

          {/* Specialty */}
          <div className="mb-6">
            <h3 className="text-[16px] text-darkest-green mb-3">Specialty</h3>
            <Input type="text" value={inputSpc} onChange={handleSpcChange} placeholder="Select specialties" className="w-full h-[41px]" />
          </div>

          {/* Language */}
          <div>
            <h3 className="text-[16px] text-darkest-green mb-3">Language</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {
                need_lan.map((item, index) => (
                  <div key={index} className="px-4 py-1 rounded-full border border-input-border-gray text-darkest-green text-sm hover:bg-gray-200">
                    {item}
                    <button
                      className="font-extrabold text-[23px] ml-2 align-middle"
                      onClick={() => lan_select_upd(item, false)}>&times;</button>
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
                          lan_select_upd(option, true)
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
          <div className="flex items-center justify-center">
            <GreenButton label="Apply" variant="action" className="amplify-button mt-6" href="" onClick={handleApply}></GreenButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketplaceFilter;
