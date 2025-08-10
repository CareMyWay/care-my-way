"use client";

import React, { useEffect, useRef, useState } from "react";
import ProviderCard from "@/components/marketplace/healthcare-provider-card";
import MarketplaceSearchBar from "@/components/marketplace/marketplace-search-bar";
import MarketplaceFilter from "@/components/marketplace/marketplace-filter";
import { fetchProviders } from "@/actions/fetchProviderMarketPlace";
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

export default function MarketplaceFrame() {
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

  const [fetchedProviders, setFetchedProviders] = useState<Provider[]>([]);
  const [pageDoneLoading, setPageDoneLoading] = useState<boolean>(true);

  const triggerFetch = () => {
    setPageDoneLoading(false);

    const tmpSearchKeySet = searchKey
      .split(" ")
      .filter((word) => word.length > 0);

    fetchProviders(
      languagePreference,
      availability,
      experience,
      specialty,
      minPrice,
      maxPrice,
      tmpSearchKeySet
    )
      .then((r) => {
        const transformed = r.map((ele) => ({
          name: `${ele.firstName} ${ele.lastName}`,
          title: ele.title,
          location: ele.location,
          experience: ele.experience,
          languages: Array.from(ele.languages.values()),
          services: Array.from(ele.services.values()),
          hourlyRate: ele.hourlyRate,
          imageSrc: ele.imageSrc,
        }));

        console.info("front rst cnt: ", transformed.length, transformed);
        setFetchedProviders(transformed);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setPageDoneLoading(true);
      });
  };

  //  Prevent double fetch in dev due to React Strict Mode
  const didFetchRef = useRef(false);
  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    triggerFetch();
  }, []);

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
            triggerFetch={triggerFetch}
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
              triggerFetch={triggerFetch}
            />
          </div>
          <div className="flex-auto overflow-y-auto">
            <div className="space-y-6 w-full lg:overflow-auto">
              {pageDoneLoading ? (
                fetchedProviders.length === 0 ? (
                  <div className="text-center text-darkest-green text-lg py-10">
                    There are no matching providers for your search.
                  </div>
                ) : (
                  fetchedProviders.map((provider, idx) => (
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
