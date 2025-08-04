"use client";

import React, { useState, useEffect } from "react";
import ProviderCard from "@/components/marketplace/healthcare-provider-card";
import MarketplaceSearchBar from "@/components/marketplace/search-bar";
import MarketplaceFilter from "@/components/marketplace/filter";
import {
  getPublicProviderProfiles,
  transformProviderForMarketplace,
} from "@/actions/providerProfileActions";
import toast from "react-hot-toast";

export default function MarketplacePage() {
  const [providers, setProviders] = useState<
    ReturnType<typeof transformProviderForMarketplace>[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const profiles = await getPublicProviderProfiles();
        const transformedProviders = profiles.map(
          transformProviderForMarketplace
        );
        setProviders(transformedProviders);

        if (transformedProviders.length === 0) {
          console.log("No public provider profiles found");
        }
      } catch (error) {
        console.error("Error loading provider profiles:", error);
        setError("Failed to load provider profiles. Please try again.");
        toast.error("Failed to load providers");
      } finally {
        setIsLoading(false);
      }
    };

    loadProviders();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-medium-green border-t-transparent mx-auto"></div>
            <p className="text-darkest-green text-lg">Loading caregivers...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-medium-green text-white rounded-lg hover:bg-darkest-green transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (providers.length === 0) {
      return (
        <div className="text-center text-darkest-green text-lg py-20">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">No Caregivers Available</h3>
            <p className="text-gray-600">
              There are currently no caregivers with completed profiles
              available in the marketplace.
            </p>
            <p className="text-sm text-gray-500">
              Check back later as new caregivers join our platform!
            </p>
          </div>
        </div>
      );
    }

    return providers.map((provider, idx) => (
      <ProviderCard key={provider.id || idx} {...provider} />
    ));
  };

  return (
    <div>
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
              {renderContent()}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
