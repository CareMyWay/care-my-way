"use client";

import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ProviderProfileData } from "@/actions/providerProfileActions";
import { ProfilePhotoUpload } from "@/components/shared";

interface EditProfileHeaderProps {
    profileData: Partial<ProviderProfileData>;
    // eslint-disable-next-line no-unused-vars
    onUpdate: (updates: Partial<ProviderProfileData>) => void;
}

export function EditProfileHeader({ profileData, onUpdate }: EditProfileHeaderProps) {
    // Handle profile photo upload
    const handlePhotoUploaded = (s3Key: string, signedUrl: string) => {
        onUpdate({ profilePhoto: s3Key });
    };

    return (
        <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 p-0">
            <CardHeader className="bg-gradient-to-r from-[#4A9B9B] via-[#5CAB9B] to-[#6CBB9B] text-white px-6 py-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-white/20 rounded-xl">
                        <User className="h-6 w-6 text-white" />
                    </div>
                    Profile Photo & Display
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Profile Photo Section */}
                    <ProfilePhotoUpload
                        profilePhoto={profileData.profilePhoto}
                        firstName={profileData.firstName}
                        lastName={profileData.lastName}
                        onPhotoUploaded={handlePhotoUploaded}
                        size="h-32 w-32"
                        className="border-4 border-[#4A9B9B]/20 shadow-lg ring-4 ring-[#4A9B9B]/10"
                        maxSizeMB={5}
                        showGuidelines={false}
                        buttonVariant="outline"
                    />

                    {/* Profile Title Section */}
                    <div className="flex-1 w-full space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {profileData.firstName && profileData.lastName
                                    ? `${profileData.firstName} ${profileData.lastName}`
                                    : "Your Name"
                                }
                            </h3>
                            <p className="text-lg text-gray-600 mb-6">
                                {profileData.profileTitle || "Healthcare Provider"}
                            </p>
                        </div>

                        {/* Profile Title Input */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Professional Title
                                </label>
                                <input
                                    type="text"
                                    value={profileData.profileTitle || ""}
                                    onChange={(e) => onUpdate({ profileTitle: e.target.value })}
                                    placeholder="e.g., Licensed Physical Therapist, Registered Nurse"
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A9B9B] focus:border-[#4A9B9B] transition-colors duration-200 text-lg"
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    This appears prominently on your profile and in search results
                                </p>
                            </div>


                        </div>
                    </div>
                </div>

                {/* Photo Upload Guidelines */}
                <div className="mt-8 lg:mt-0 lg:ml-8">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Photo Guidelines</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Use a clear, professional headshot</li>
                            <li>• Ensure good lighting and avoid shadows</li>
                            <li>• Recommended size: 400x400 pixels or larger</li>
                            <li>• Accepted formats: JPG, PNG (max 5MB)</li>
                            <li>• Professional attire is recommended</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 