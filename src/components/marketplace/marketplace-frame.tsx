"use client";

import React, { useState, useEffect } from "react";
import ProviderCard from "@/components/marketplace/healthcare-provider-card";
import MarketplaceSearchBar from "@/components/marketplace/marketplace-search-bar";
import MarketplaceFilter from "@/components/marketplace/marketplace-filter";
import Loading from "@/app/loading";

export interface Provider {
  name: string;
  title: string;
  location: string;
  experience: string;
  languages: string[];
  services: string[];
  hourlyRate: number;
  imageSrc: string;
}

interface MarketplaceFrameProps {
  initialProviders: Provider[];
}

export default function MarketplaceFrame({
  initialProviders,
}: MarketplaceFrameProps) {
  const thisSliderMinValue = 0;
  const thisSliderMaxValue = 200;

  const [searchKey, setSearchKey] = useState<string>("");
  const [minPrice, setMinPrice] = useState(thisSliderMinValue);
  const [maxPrice, setMaxPrice] = useState(thisSliderMaxValue);
  const [availability, setAvailability] = useState<string[]>([]);
  const [experience, setExperience] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100,
  });
  const [specialty, setSpecialty] = useState<string[]>([]);
  const [languagePreference, setLanguagePreference] = useState<string[]>([]);

  const [filteredProviders, setFilteredProviders] =
    useState<Provider[]>(initialProviders);
  const [pageDoneLoading, setPageDoneLoading] = useState(true);

  const parseExperience = (exp: string | number) => {
    if (typeof exp === "number") return exp;
    const match = exp.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  // Filtering function - you can customize this logic as needed
  const applyFilters = () => {
    setPageDoneLoading(false);

    const tmpSearchKeySet = searchKey
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 0);

    const filtered = initialProviders.filter((provider) => {
      const searchableString = `${provider.name} ${provider.title} ${
        provider.location
      } ${provider.services.join(" ")}`.toLowerCase();

      const matchesSearchKey = tmpSearchKeySet.every((word) =>
        searchableString.includes(word)
      );

      const matchesPrice =
        provider.hourlyRate >= minPrice && provider.hourlyRate <= maxPrice;

      const providerExp = parseExperience(provider.experience);
      const matchesExperience =
        providerExp >= experience.min && providerExp <= experience.max;

      // Availability filter
      // const matchesAvailability =
      //   availability.length === 0 ||
      //   availability.some((avail) => provider.availability?.includes(avail));

      // Specialty filter
      const matchesSpecialty =
        specialty.length === 0 ||
        specialty.some((specialty) => provider.services.includes(specialty));

      // Language filter
      const matchesLanguage =
        languagePreference.length === 0 ||
        languagePreference.some((language) =>
          provider.languages.includes(language)
        );

      return (
        matchesSearchKey &&
        matchesPrice &&
        matchesExperience &&
        // matchesAvailability &&
        matchesSpecialty &&
        matchesLanguage
      );
    });

    setFilteredProviders(filtered);
    setPageDoneLoading(true);
  };

  // Trigger filtering when filters change
  useEffect(() => {
    applyFilters();
  }, [
    searchKey,
    minPrice,
    maxPrice,
    availability,
    experience,
    specialty,
    languagePreference,
  ]);

  const [showBackToTopButton, setShowBackToTopButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      setShowBackToTopButton(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="relative">
      {(showBackToTopButton || true) && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-light-green text-white font-extrabold rounded-full w-[50px] h-[50px] text-2xl flex justify-center items-center cursor-pointer shadow-md z-[1000]"
        >
          &#8593;
        </button>
      )}

      <div className="w-full h-[100%] flex flex-col">
        <div className="flex-initial">
          <MarketplaceSearchBar
            searchKey={searchKey}
            setSearchKey={setSearchKey}
            triggerFetch={applyFilters} // here trigger filtering
          />
        </div>

        <div className="flex flex-col flex-auto lg:flex-row gap-3 lg:flex-1 lg:min-h-0">
          <div>
            <MarketplaceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              availability={availability}
              experience={experience}
              specialty={specialty}
              languagePreference={languagePreference}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              setAvailability={setAvailability}
              setExperience={setExperience}
              setSpecialty={setSpecialty}
              setLanguagePreference={setLanguagePreference}
              triggerFetch={applyFilters}
            />
          </div>
          <div className="flex-auto overflow-y-auto">
            <div className="space-y-6 w-full lg:overflow-auto">
              {pageDoneLoading ? (
                filteredProviders.length === 0 ? (
                  <div className="text-center text-darkest-green text-lg py-10">
                    There are no matching providers for your search.
                  </div>
                ) : (
                  filteredProviders.map((provider, idx) => (
                    <ProviderCard key={idx} {...provider} />
                  ))
                )
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
