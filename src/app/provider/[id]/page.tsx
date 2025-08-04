"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProfileSummary from "@/components/provider-profile/profile-summary";
import ProfileDetails from "@/components/provider-profile/profile-details";
import {
  getProviderProfileById,
  type ProviderProfileData,
} from "@/actions/providerProfileActions";
import toast from "react-hot-toast";

export default function ProviderProfilePage() {
  const params = useParams();
  const providerId = params.id as string;

  const [profileData, setProfileData] = useState<ProviderProfileData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProviderProfile = async () => {
      if (!providerId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get the profile by profile ID
        const profile = await getProviderProfileById(providerId);

        if (!profile) {
          setError("Provider profile not found");
          return;
        }

        // Check if profile is publicly visible
        if (!profile.isPubliclyVisible || !profile.isProfileComplete) {
          setError("This provider profile is not available");
          return;
        }

        setProfileData(profile);
      } catch (error) {
        console.error("Error loading provider profile:", error);
        setError("Failed to load provider profile");
        toast.error("Failed to load provider profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadProviderProfile();
  }, [providerId]);

  if (isLoading) {
    return (
      <div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-medium-green border-t-transparent mx-auto"></div>
            <p className="text-darkest-green text-lg">
              Loading provider profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-darkest-green">
              Provider Not Found
            </h2>
            <p className="text-gray-600">
              {error || "The requested provider profile could not be found."}
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-medium-green text-white rounded-lg hover:bg-darkest-green transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="min-h-screen px-4 py-12 md:px-16 bg-primary-white">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Profile Summary */}
            <div className="lg:w-1/3">
              <ProfileSummary profileData={profileData} />
            </div>

            {/* Right Side - Profile Details */}
            <div className="lg:w-2/3">
              <ProfileDetails profileData={profileData} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
