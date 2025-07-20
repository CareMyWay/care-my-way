"use client";

import { Camera, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card";
import { Button } from "@/components/provider-dashboard-ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/provider-dashboard-ui/avatar";
import { type ProviderProfileData } from "@/actions/providerProfileActions";

interface EditProfileHeaderProps {
    profileData: Partial<ProviderProfileData>;
    onUpdate: (updates: Partial<ProviderProfileData>) => void;
}

export function EditProfileHeader({ profileData, onUpdate }: EditProfileHeaderProps) {
    // Helper function to get initials
    const getInitials = (firstName?: string, lastName?: string) => {
        if (!firstName && !lastName) return "P";
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
    };

    // Handle profile photo upload (placeholder for now)
    const handlePhotoUpload = () => {
        // TODO: Implement photo upload functionality
        console.log("Photo upload functionality to be implemented");
    };

    return (
        <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-[#4A9B9B] via-[#5CAB9B] to-[#6CBB9B] text-white">
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
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <Avatar className="h-32 w-32 border-4 border-[#4A9B9B]/20 shadow-lg ring-4 ring-[#4A9B9B]/10">
                                <AvatarImage
                                    src={profileData.profilePhoto || "/placeholder.svg?height=128&width=128"}
                                    alt={`${profileData.firstName} ${profileData.lastName}`}
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-[#4A9B9B]/10 text-[#4A9B9B] text-3xl font-bold">
                                    {getInitials(profileData.firstName, profileData.lastName)}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                onClick={handlePhotoUpload}
                                size="sm"
                                className="absolute -bottom-2 -right-2 bg-[#4A9B9B] hover:bg-[#4A9B9B]/90 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="text-center">
                            <Button
                                onClick={handlePhotoUpload}
                                variant="outline"
                                className="dashboard-button-secondary border-[#4A9B9B] text-[#4A9B9B] hover:bg-[#4A9B9B]/5"
                            >
                                <Camera className="h-4 w-4 mr-2" />
                                Change Photo
                            </Button>
                        </div>
                    </div>

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
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Photo Guidelines</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Use a clear, professional headshot</li>
                        <li>• Ensure good lighting and avoid shadows</li>
                        <li>• Recommended size: 400x400 pixels or larger</li>
                        <li>• Accepted formats: JPG, PNG (max 5MB)</li>
                        <li>• Professional attire is recommended</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
} 