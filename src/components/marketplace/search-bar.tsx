import React from "react";
import { Input } from "@/components/ui/input";

const MarketplaceSearchBar = () => {
  return (
    <>
      {/* Navigation Bar */}
      <div className="flex-col ml-5">
        <div>
          <h3 className="font-bold text-h4-size md:text-h3-size text-darkest-green mb-2">
            Find a Caregiver
          </h3>
        </div>
        <div className="sm:flex-col sm:items-center lg:flex lg:flex-row lg:justify-between mb-6">
          <p className="text-body5-size md:text-body3-size">
            Connect with professional caregivers that match your special needs
          </p>
          <div className="relative w-80 ">
            <Input
              type="text"
              placeholder="Search Caregivers..."
              className="mt-10 lg:mt-0 pr-10 h-[60px] text-[20px] border-gray-300 rounded-md"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketplaceSearchBar;
