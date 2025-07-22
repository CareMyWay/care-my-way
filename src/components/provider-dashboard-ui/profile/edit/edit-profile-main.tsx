"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { AlertCircle, Save, ArrowLeft, User, Briefcase, BookOpen, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/provider-dashboard-ui/card";
import { Button } from "@/components/provider-dashboard-ui/button";
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav";
import { EditProfileHeader } from "@/components/provider-dashboard-ui/profile/edit/edit-profile-header";
import { EditPersonalInfo } from "@/components/provider-dashboard-ui/profile/edit/edit-personal-info";
import { EditAddressInfo } from "@/components/provider-dashboard-ui/profile/edit/edit-address-info";
import { EditProfessionalInfo } from "@/components/provider-dashboard-ui/profile/edit/edit-professional-info";
import { EditCredentialsInfo } from "@/components/provider-dashboard-ui/profile/edit/edit-credentials-info";
import { EditEmergencyContact } from "@/components/provider-dashboard-ui/profile/edit/edit-emergency-contact";
import Link from "next/link";
import {
    getProviderProfile,
    updateProviderProfile,
    type ProviderProfileData,
    type ProviderProfileDataDB
} from "@/actions/providerProfileActions";
import toast from "react-hot-toast";

export function EditProfileMain() {
    const [profileData, setProfileData] = useState<ProviderProfileData | null>(null);
    const [formData, setFormData] = useState<Partial<ProviderProfileData>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [currentUser, setCurrentUser] = useState<{ userId: string; username?: string } | null>(null);
    const [activeTab, setActiveTab] = useState<"personal" | "professional" | "credentials" | "profile">("personal");

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
                    if (profile) {
                        setProfileData(profile);
                        setFormData(profile);
                    } else {
                        setError("No profile found. Please complete your profile setup first.");
                    }
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

    // Track unsaved changes
    useEffect(() => {
        if (profileData && formData) {
            const hasChanges = JSON.stringify(profileData) !== JSON.stringify(formData);
            setHasUnsavedChanges(hasChanges);
        }
    }, [profileData, formData]);

    // Handle form data updates from child components
    const updateFormData = (updates: Partial<ProviderProfileData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    // Handle save
    const handleSave = async () => {
        if (!profileData?.id || !currentUser?.userId) {
            toast.error("Unable to save: Profile or user information missing");
            return;
        }

        setIsSaving(true);
        try {
            // Prepare the update data
            const updateData: Partial<ProviderProfileDataDB> = {
                // Personal information
                firstName: formData.firstName,
                lastName: formData.lastName,
                firstNameLower: formData.firstName?.toLowerCase(),
                lastNameLower: formData.lastName?.toLowerCase(),
                dob: formData.dob,
                gender: formData.gender,
                phone: formData.phone,
                email: formData.email,
                preferredContact: formData.preferredContact,
                profilePhoto: formData.profilePhoto,

                // Address
                address: formData.address,
                city: formData.city,
                province: formData.province,
                postalCode: formData.postalCode,

                // Emergency contact
                emergencyContactName: formData.emergencyContactName,
                emergencyContactPhone: formData.emergencyContactPhone,
                emergencyContactRelationship: formData.emergencyContactRelationship,

                // Professional info
                profileTitle: formData.profileTitle,
                bio: formData.bio,
                yearsExperience: formData.yearsExperience,
                askingRate: formData.askingRate,
                responseTime: formData.responseTime,
                languages: formData.languages,
                servicesOffered: formData.servicesOffered,

                // Credentials - stringify arrays for database storage
                education: formData.education ? JSON.stringify(formData.education) : null,
                certifications: formData.certifications ? JSON.stringify(formData.certifications) : null,
                workExperience: formData.workExperience ? JSON.stringify(formData.workExperience) : null,
            };

            const updatedProfile = await updateProviderProfile(profileData.id, updateData);

            if (updatedProfile) {
                setProfileData(updatedProfile);
                setFormData(updatedProfile);
                setHasUnsavedChanges(false);
                toast.success("Profile updated successfully!");
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <>
                <TopNav title="Edit Profile" subtitle="Update your professional information" notificationCount={2} />
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center space-y-6">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#4A9B9B]/20 border-t-[#4A9B9B] mx-auto"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-[#4A9B9B]/10"></div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Profile</h3>
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
                <TopNav title="Edit Profile" subtitle="Update your professional information" notificationCount={2} />
                <div className="min-h-[60vh] flex items-center justify-center px-4">
                    <Card className="max-w-md mx-auto shadow-xl">
                        <CardContent className="text-center p-8">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="h-8 w-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Error Loading Profile</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
                            <div className="space-y-3">
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="dashboard-button-primary text-primary-white px-6 py-3 rounded-xl w-full"
                                >
                                    Try Again
                                </Button>
                                <Link href="/provider-dashboard/profile">
                                    <Button variant="outline" className="dashboard-button-secondary px-6 py-3 rounded-xl w-full">
                                        Return to Profile
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    return (
        <>
            <TopNav title="Edit Profile" subtitle="Update your professional information" notificationCount={2} />

            <div className="min-h-screen bg-gray-50/50">
                <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 space-y-8">

                    {/* Back Button */}
                    <div className="flex items-center gap-4">
                        <Link href="/provider-dashboard/profile">
                            <Button variant="outline" className="dashboard-button-secondary flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Profile
                            </Button>
                        </Link>
                        {hasUnsavedChanges && (
                            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">You have unsaved changes</span>
                            </div>
                        )}
                    </div>

                    {/* Tab Navigation */}
                    <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                        <div className="border-b bg-gray-50">
                            <div className="flex space-x-1 p-2">
                                <button
                                    onClick={() => setActiveTab("personal")}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors duration-200 ${activeTab === "personal"
                                        ? "bg-white text-blue-600 shadow-sm border border-blue-200"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                        }`}
                                >
                                    <User className="h-5 w-5" />
                                    Personal Information
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
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors duration-200 ${activeTab === "profile"
                                        ? "bg-white text-green-600 shadow-sm border border-green-200"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                        }`}
                                >
                                    <Camera className="h-5 w-5" />
                                    Profile & Photo
                                </button>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Personal Information Tab */}
                            {activeTab === "personal" && (
                                <div className="space-y-8">
                                    <EditPersonalInfo
                                        profileData={formData}
                                        onUpdate={updateFormData}
                                    />

                                    <EditAddressInfo
                                        profileData={formData}
                                        onUpdate={updateFormData}
                                    />

                                    <EditEmergencyContact
                                        profileData={formData}
                                        onUpdate={updateFormData}
                                    />
                                </div>
                            )}

                            {/* Professional Details Tab */}
                            {activeTab === "professional" && (
                                <div className="space-y-8">
                                    <EditProfessionalInfo
                                        profileData={formData}
                                        onUpdate={updateFormData}
                                    />
                                </div>
                            )}

                            {/* Credentials Tab */}
                            {activeTab === "credentials" && (
                                <div className="space-y-8">
                                    <EditCredentialsInfo
                                        profileData={formData}
                                        onUpdate={updateFormData}
                                    />
                                </div>
                            )}

                            {/* Profile & Photo Tab */}
                            {activeTab === "profile" && (
                                <div className="space-y-8">
                                    <EditProfileHeader
                                        profileData={formData}
                                        onUpdate={updateFormData}
                                    />
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Save Section */}
                    <div className="max-w-4xl mx-auto">
                        <Card className="border border-gray-200 rounded-2xl shadow-lg bg-white">
                            <CardContent className="p-8">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Save Your Changes</h3>
                                    <p className="text-gray-600">Make sure all information is accurate before saving</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving || !hasUnsavedChanges}
                                        className="dashboard-button-primary text-primary-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                                    >
                                        <Save className="h-5 w-5 mr-2" />
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>

                                    <Link href="/provider-dashboard/profile" className="w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            className="dashboard-button-secondary px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all duration-200 w-full sm:w-auto"
                                        >
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>

                                {hasUnsavedChanges && (
                                    <div className="mt-4 text-center">
                                        <p className="text-sm text-gray-500">
                                            Don&apos;t forget to save your changes before leaving this page
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
} 