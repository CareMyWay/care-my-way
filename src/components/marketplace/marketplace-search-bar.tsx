import React from "react";
import { Input } from "@/components/ui/input";

const MarketplaceSearchBar = ({ searchKey, setSearchKey, triggerFetch }) => {
  const handleChange = (e) => {
    setSearchKey(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      triggerFetch();
    }
  };

  const handleClear = () => {
    setSearchKey("");
    window.location.reload();

    // Optionally, you can call triggerFetch() here if you want instant fetch on clear
    // Otherwise, user presses Enter to fetch
  };

  return (
    <div className="flex-col mg-5">
      <div>
        <h3 className="font-bold text-h4-size md:text-h3-size text-darkest-green mb-2">
          Find a Healthcare Provider
        </h3>
      </div>
      <div className="flex-col items-center lg:flex lg:flex-row lg:justify-between mb-6">
        <p className="text-body4-size lg:text-body3-size ">
          Connect with professional healthcare providers that match your special
          needs
        </p>
        <div className="relative lg:w-80 w-full">
          <Input
            type="text"
            value={searchKey}
            onChange={handleChange}
            placeholder="Search Healthcare Providers"
            className="mt-2 lg:mt-0 h-[60px] text-[20px] border-gray-300 rounded-md pr-10"
            onKeyDown={handleKeyDown}
          />

          {/* Clear "X" button, shows only if searchKey has text */}
          {searchKey.length > 0 && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-10 flex items-center justify-center w-10 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Search icon */}
          <div
            className="absolute inset-y-0 right-0 flex items-center w-10 justify-center z-10 cursor-pointer"
            onClick={triggerFetch}
          >
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
  );
};

export default MarketplaceSearchBar;
