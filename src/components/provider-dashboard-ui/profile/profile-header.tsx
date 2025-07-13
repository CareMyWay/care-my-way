"use client";

import { MapPin, Clock, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/provider-dashboard-ui/card";
import { Button } from "@/components/provider-dashboard-ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/provider-dashboard-ui/avatar";
import Link from "next/link";
import { type ProviderProfileData } from "@/actions/providerProfileActions";

interface ProfileHeaderProps {
    profileData: ProviderProfileData;
}

export function ProfileHeader({ profileData }: ProfileHeaderProps) {
    // Helper function to get initials
    const getInitials = (firstName?: string, lastName?: string) => {
        if (!firstName && !lastName) return "P";
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
    };

    // Helper function to format location
    const getLocation = () => {
        const parts = [profileData.city, profileData.province].filter(Boolean);
        return parts.length > 0 ? parts.join(", ") : "Location not specified";
    };

    return (
        <div className="w-full">
            <Card className="border-none bg-gradient-to-br from-[#4A9B9B] via-[#5CAB9B] to-[#6CBB9B] text-white rounded-3xl overflow-hidden shadow-2xl">
                <CardContent className="p-8 md:p-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">

                            {/* Profile Info Section */}
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 flex-1">

                                {/* Avatar */}
                                <div className="relative">
                                    <Avatar className="h-32 w-32 border-4 border-white/30 shadow-2xl ring-4 ring-white/20">
                                        <AvatarImage
                                            src={profileData.profilePhoto || "/placeholder.svg?height=128&width=128"}
                                            alt={`${profileData.firstName} ${profileData.lastName}`}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-white/20 text-white text-3xl font-bold backdrop-blur-sm">
                                            {getInitials(profileData.firstName, profileData.lastName)}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Online Status Indicator */}
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 border-4 border-white rounded-full shadow-lg flex items-center justify-center">
                                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Name and Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="mb-4">
                                        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">
                                            {profileData.firstName} {profileData.lastName}
                                        </h1>
                                        <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
                                            {profileData.profileTitle || "Healthcare Provider"}
                                        </p>
                                    </div>

                                    {/* Info Pills */}
                                    <div className="flex flex-wrap items-center gap-4 text-white/90">
                                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                            <MapPin className="h-5 w-5" />
                                            <span className="font-medium">{getLocation()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                            <Clock className="h-5 w-5" />
                                            <span className="font-medium">Responds {profileData.responseTime || "within 24 hours"}</span>
                                        </div>
                                        {profileData.askingRate && profileData.rateType && (
                                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                                <span className="font-semibold text-lg">${profileData.askingRate}</span>
                                                <span className="font-medium">{profileData.rateType}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <div className="lg:ml-auto">
                                <Link href="/provider-dashboard/profile/edit">
                                    <Button className="bg-white text-[#4A9B9B] hover:bg-white/90 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg">
                                        <Edit className="h-5 w-5 mr-2" />
                                        Edit Profile
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Quick Stats Row */}
                        {(profileData.yearsExperience || (profileData.servicesOffered && profileData.servicesOffered.length > 0) || (profileData.languages && profileData.languages.length > 0)) && (
                            <div className="mt-8 pt-8 border-t border-white/20">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                    {profileData.yearsExperience && (
                                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                                            <div className="text-2xl font-bold text-white mb-1">
                                                {profileData.yearsExperience}
                                            </div>
                                            <div className="text-white/80 text-sm font-medium">Experience</div>
                                        </div>
                                    )}
                                    {profileData.servicesOffered && profileData.servicesOffered.length > 0 && (
                                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                                            <div className="text-2xl font-bold text-white mb-1">
                                                {profileData.servicesOffered.length}
                                            </div>
                                            <div className="text-white/80 text-sm font-medium">Services Offered</div>
                                        </div>
                                    )}
                                    {profileData.languages && profileData.languages.length > 0 && (
                                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                                            <div className="text-2xl font-bold text-white mb-1">
                                                {profileData.languages.length}
                                            </div>
                                            <div className="text-white/80 text-sm font-medium">Languages</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 