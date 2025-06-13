"use client";

import React from "react";
import ProviderCard from "@/components/marketplace/healthcare-provider-card";

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
      <div className="container mx-auto">
        <h1 className="text-darkest-green text-h3-size mb-8 font-semibold">
          Healthcare Providers
        </h1>
        <div className="space-y-6">
          {MOCK_PROVIDERS.map((provider, idx) => (
            <ProviderCard key={idx} {...provider} />
          ))}
        </div>
      </div>
    </section>
  );
}
