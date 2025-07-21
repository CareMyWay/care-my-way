"use client";

import React, {useState} from "react";
import ProviderCard from "@/components/marketplace/healthcare-provider-card";
import MarketplaceSearchBar from "@/components/marketplace/search-bar";
import MarketplaceFilter from "@/components/marketplace/filter";
import {fetchProviders} from "@/actions/fetchProviderMarketPlace";
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

const landingProviders: Provider[] = [];
// MOCK_PROVIDERS.push(... demo_data);

export default function MarketplaceFrame() {
  const thisSliderMinValue = 0;
  const thisSliderMaxValue = 200;

  const [searchKey, setSearchKey] = useState<string>("");

  const [minPrice, setMinPrice] = useState(thisSliderMinValue);
  const [maxPrice, setMaxPrice] = useState(thisSliderMaxValue);

  const [availability, setAvailability] = useState<string[]>([]);
  const [experience, setExperience] = useState<number>(0);
  const [specialty, setSpecialty] = useState<string[]>([]);

  const [languagePreference, setLanguagePreference] = useState<string[]>([]);

  const [fetchedProviders, setFetchedProviders] = useState<Provider[]>([]);
  const [pageDoneLoading, setPageDoneLoading] = useState<boolean>(true);

  const triggerFetch = () => {
    setPageDoneLoading(false);
    landingProviders.length = 0;

    const tmpSearchKeySet: string[] = [];
    searchKey.split(" ").map((word: string) => {
      if (word.length > 0) {
        tmpSearchKeySet.push(word);
      }
    });

    fetchProviders(languagePreference,availability,experience,specialty,minPrice,maxPrice, tmpSearchKeySet).then(r => {
      r.map(ele => {

        landingProviders.push(
          {
            name: ele.firstName.concat(" ".concat(ele.lastName)),
            title: ele.title,
            location: ele.location,
            experience: ele.experience,
            languages: Array.from(ele.languages.values()),
            services: Array.from(ele.services.values()),
            hourlyRate: ele.hourlyRate,
            imageSrc: ele.imageSrc,
          });
      });
    }).then(
      () => {
        console.info("front rst cnt: ", Object.values(landingProviders).length, landingProviders);
        setFetchedProviders(landingProviders);
        setPageDoneLoading(true);
      }
    ).catch(e => {
      console.log(e);
    });
  };

  return (
    <div className={"w-full h-[100%] flex flex-col"}>
      <div className={"flex-initial"}>
        <MarketplaceSearchBar searchKey={searchKey} setSearchKey={setSearchKey} triggerFetch={triggerFetch} />
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
            triggerFetch={triggerFetch} />
        </div>
        <div className={"flex-auto overflow-y-auto"}>
          <div className="space-y-6 w-full  lg:overflow-auto">
            {
              pageDoneLoading ? (
                fetchedProviders.length === 0 ? (
                  <div className="text-center text-darkest-green text-lg py-10">
                    There are no matching providers for your search.
                  </div>
                ) : (
                  fetchedProviders.map((provider, idx) => (
                    <ProviderCard key={idx} {...provider} />
                  ))
                )
              ) : <Loading />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
