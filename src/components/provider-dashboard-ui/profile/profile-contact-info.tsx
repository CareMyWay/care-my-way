"use client";

import { Phone, Mail, MapPin, Users, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card";
import { Badge } from "@/components/provider-dashboard-ui/badge";
import { type ProviderProfileData } from "@/actions/providerProfileActions";

interface ProfileContactInfoProps {
    profileData: ProviderProfileData;
}

export function ProfileContactInfo({ profileData }: ProfileContactInfoProps) {
    // Helper function to format location
    const getLocation = () => {
        const parts = [profileData.city, profileData.province].filter(Boolean);
        return parts.length > 0 ? parts.join(", ") : "Location not specified";
    };

    return (
        <div className="space-y-6">

            {/* Contact Information */}
            <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                    <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-[#4A9B9B] rounded-xl">
                            <Phone className="h-5 w-5 text-white" />
                        </div>
                        Contact Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Email</p>
                            <span className="text-gray-900 font-medium">{profileData.email}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Phone</p>
                            <span className="text-gray-900 font-medium">{profileData.phone}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <div className="p-2 bg-purple-100 rounded-lg mt-1">
                            <MapPin className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Address</p>
                            <div className="text-gray-900 font-medium">
                                {profileData.address && (
                                    <div className="mb-1">{profileData.address}</div>
                                )}
                                <div>{getLocation()}</div>
                                {profileData.postalCode && (
                                    <div className="text-gray-600">{profileData.postalCode}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2 font-medium">Preferred Contact Method</p>
                        <div className="p-3 bg-[#4A9B9B]/10 rounded-xl border border-[#4A9B9B]/20">
                            <p className="font-semibold text-[#4A9B9B]">{profileData.preferredContact || "Not specified"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Languages */}
            <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                    <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-[#4A9B9B] rounded-xl">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                        Languages
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {profileData.languages && profileData.languages.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {profileData.languages.map((language, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="border-2 border-[#4A9B9B] text-[#4A9B9B] bg-[#4A9B9B]/5 hover:bg-[#4A9B9B]/10 px-3 py-2 rounded-xl font-medium transition-colors duration-200"
                                >
                                    {language}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 italic">No languages specified</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Emergency Contact */}
            {profileData.emergencyContactName && (
                <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
                        <CardTitle className="flex items-center gap-3 text-lg">
                            <div className="p-2 bg-red-500 rounded-xl">
                                <AlertCircle className="h-5 w-5 text-white" />
                            </div>
                            Emergency Contact
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                            <div className="mb-3">
                                <p className="font-semibold text-gray-900 text-lg">{profileData.emergencyContactName}</p>
                                <p className="text-sm text-red-600 font-medium bg-red-100 inline-block px-2 py-1 rounded-lg mt-1">
                                    {profileData.emergencyContactRelationship}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Phone className="h-4 w-4 text-red-600" />
                                </div>
                                <span className="text-gray-900 font-medium">{profileData.emergencyContactPhone}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 