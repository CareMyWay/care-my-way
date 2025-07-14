"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { AlertCircle, Edit, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/provider-dashboard-ui/card";
import { Button } from "@/components/provider-dashboard-ui/button";
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
    const [currentUser, setCurrentUser] = useState<any>(null);

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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                    {/* Profile Header */}
                    <ProfileHeader profileData={profileData} />

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left Column - Contact Info (4 columns) */}
                        <div className="lg:col-span-4">
                            <ProfileContactInfo profileData={profileData} />
                        </div>

                        {/* Middle Column - Professional Summary (4 columns) */}
                        <div className="lg:col-span-4">
                            <ProfileProfessionalSummary profileData={profileData} />
                        </div>

                        {/* Right Column - Credentials (4 columns) */}
                        <div className="lg:col-span-4">
                            <ProfileCredentials profileData={profileData} />
                        </div>
                    </div>

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

                                    <Link href="/provider-dashboard/to-dos/complete-profile" className="w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            className="dashboard-button-secondary px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all duration-200 w-full sm:w-auto"
                                        >
                                            <FileText className="h-5 w-5 mr-2" />
                                            Update Credentials
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