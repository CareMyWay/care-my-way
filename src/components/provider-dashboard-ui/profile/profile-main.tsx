"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { AlertCircle, Edit, User, Briefcase, BookOpen, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav";
import { ProfileHeader } from "./profile-header";
import { ProfileContactInfo } from "./profile-contact-info";
import { ProfileProfessionalSummary } from "./profile-professional-summary";
import { ProfileCredentials } from "./profile-credentials";
import { ProfileIncompletePrompt } from "./profile-incomplete-prompt";
import Link from "next/link";
import { getProviderProfile, type ProviderProfileData } from "@/actions/providerProfileActions";
import toast from "react-hot-toast";

export function ProfileMain() {
  const [profileData, setProfileData] = useState<ProviderProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setCurrentUser] = useState<{ userId: string; username?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "contact" | "professional" | "credentials">("overview");

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current user
        const user = await getCurrentUser();
        setCurrentUser(user);

        if (user?.userId) {
          const profile = await getProviderProfile(user.userId);
          setProfileData(profile);
        } else {
          setError("User not found. Please try logging in again.");
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        setError("Failed to load profile data. Please try again.");
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <>
        <TopNav title="Profile" subtitle="Manage your professional profile and credentials." notificationCount={2} />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#4A9B9B]/20 border-t-[#4A9B9B] mx-auto"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#4A9B9B]/10"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Your Profile</h3>
              <p className="text-gray-600">Please wait while we gather your information...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <TopNav title="Profile" subtitle="Manage your professional profile and credentials." notificationCount={2} />
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <Card className="max-w-md mx-auto shadow-xl">
            <CardContent className="text-center p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Error Loading Profile</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="dashboard-button-primary text-primary-white px-6 py-3 rounded-xl"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // No profile found or incomplete profile
  if (!profileData || !profileData.isProfileComplete) {
    return (
      <>
        <TopNav title="Profile" subtitle="Complete your professional profile to get started." notificationCount={2} />
        <ProfileIncompletePrompt />
      </>
    );
  }

  // Complete profile state
  return (
    <>
      <TopNav title="Profile" subtitle="Manage your professional profile and credentials." notificationCount={2} />

      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 space-y-8">

          {/* Tab Navigation */}
          <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="border-b bg-gray-50">
              <div className="flex space-x-1 p-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors duration-200 ${activeTab === "overview"
                    ? "bg-white text-[#4A9B9B] shadow-sm border border-[#4A9B9B]/20"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                >
                  <Eye className="h-5 w-5" />
                  Profile Overview
                </button>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors duration-200 ${activeTab === "contact"
                    ? "bg-white text-blue-600 shadow-sm border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                >
                  <User className="h-5 w-5" />
                  Contact & Personal
                </button>
                <button
                  onClick={() => setActiveTab("professional")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors duration-200 ${activeTab === "professional"
                    ? "bg-white text-purple-600 shadow-sm border border-purple-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                >
                  <Briefcase className="h-5 w-5" />
                  Professional Details
                </button>
                <button
                  onClick={() => setActiveTab("credentials")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors duration-200 ${activeTab === "credentials"
                    ? "bg-white text-indigo-600 shadow-sm border border-indigo-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                >
                  <BookOpen className="h-5 w-5" />
                  Credentials
                </button>
              </div>
            </div>

            <div className="p-8">
              {/* Profile Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <ProfileHeader profileData={profileData} />
                </div>
              )}

              {/* Contact & Personal Tab */}
              {activeTab === "contact" && (
                <div className="space-y-8">
                  <ProfileContactInfo profileData={profileData} />
                </div>
              )}

              {/* Professional Details Tab */}
              {activeTab === "professional" && (
                <div className="space-y-8">
                  <ProfileProfessionalSummary profileData={profileData} />
                </div>
              )}

              {/* Credentials Tab */}
              {activeTab === "credentials" && (
                <div className="space-y-8">
                  <ProfileCredentials profileData={profileData} />
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons Section */}
          <div className="max-w-4xl mx-auto">
            <Card className="border border-gray-200 rounded-2xl shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Manage Your Profile</h3>
                  <p className="text-gray-600">Keep your information up to date to attract more clients</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/provider-dashboard/profile/edit" className="w-full sm:w-auto">
                    <Button className="dashboard-button-primary text-primary-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
                      <Edit className="h-5 w-5 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>



                  <Link href="/provider-dashboard" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="dashboard-button-secondary px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all duration-200 w-full sm:w-auto"
                    >
                      Return to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
} 