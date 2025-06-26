"use client";

import React from "react";
import ProviderCard from "@/components/marketplace/healthcare-provider-card";
import MarketplaceSearchBar from "@/components/marketplace/search-bar";
import MarketplaceFilter from "@/components/marketplace/filter";
import NavBar from "@/components/navbars/navbar";

const MOCK_PROVIDERS = [
  {
    name: "Nina Nguyen",
    title: "Health Care Aide",
    location: "Calgary, AB",
    experience: "5+ years",
    testimonials: 10,
    languages: ["English", "French", "Urdu"],
    services: ["Dementia Care", "Personal Care", "Health Monitoring"],
    hourlyRate: 20,
    imageSrc: "/images/home/meet-providers/person-placeholder-1.png",
  },
  {
    name: "Kenji Yamamoto",
    title: "Live-in Caregiver",
    location: "Calgary, AB",
    experience: "2+ years",
    testimonials: 18,
    languages: ["English", "French", "Urdu"],
    services: ["Housekeeping", "Companionship", "Mobility Assistance"],
    hourlyRate: 31,
    imageSrc: "/images/home/meet-providers/person-placeholder-2.jpg",
  },
  {
    name: "Jamal Osborne",
    title: "Registered Nurse",
    location: "Calgary, AB",
    experience: "10+ years",
    testimonials: 5,
    languages: ["English", "French", "Urdu"],
    services: ["Wound Care", "Medication Management", "Health Education"],
    hourlyRate: 56,
    imageSrc: "/images/home/meet-providers/person-placeholder-6.jpg",
  },
];

export default function MarketplacePage() {
  return (
    <section className="min-h-screen px-4 py-12 md:px-16 bg-primary-white">
      <div className="container mx-auto flex flex-col md:h-screen">
        <div>
          <div>
            <MarketplaceSearchBar />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 md:flex-1 md:min-h-0">
          <div>
            <MarketplaceFilter />
          </div>
          <div className="space-y-6 w-full md:overflow-y-auto">
            {MOCK_PROVIDERS.length === 0 ? (
              <div className="text-center text-darkest-green text-lg py-10">
                There are no matching providers for your search.
              </div>
            ) : (
              MOCK_PROVIDERS.map((provider, idx) => (
                <ProviderCard key={idx} {...provider} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
