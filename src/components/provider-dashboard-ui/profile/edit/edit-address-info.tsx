"use client";

import { MapPin, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card";
import { type ProviderProfileData } from "@/actions/providerProfileActions";
import { getCanadianProvinces } from "@/utils/canadian-provinces";

interface EditAddressInfoProps {
    profileData: Partial<ProviderProfileData>;
    onUpdate: (value: Partial<ProviderProfileData>) => void;
}

export function EditAddressInfo({ profileData, onUpdate }: EditAddressInfoProps) {
    const canadianProvinces = getCanadianProvinces();

    return (
        <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-green-500 rounded-xl">
                        <MapPin className="h-5 w-5 text-white" />
                    </div>
                    Address Information
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">

                {/* Street Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Home className="h-4 w-4 inline mr-1" />
                        Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={profileData.address || ""}
                        onChange={(e) => onUpdate({ address: e.target.value })}
                        placeholder="123 Main Street, Apt 4B"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Your street address (apartment/unit number if applicable)
                    </p>
                </div>

                {/* City, Province, Postal Code */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={profileData.city || ""}
                            onChange={(e) => onUpdate({ city: e.target.value })}
                            placeholder="Toronto"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Province <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={profileData.province || ""}
                            onChange={(e) => onUpdate({ province: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                            required
                        >
                            <option value="">Select Province</option>
                            {canadianProvinces.map((province) => (
                                <option key={province.shortCode} value={province.name}>
                                    {province.name} ({province.shortCode})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postal Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={profileData.postalCode || ""}
                            onChange={(e) => onUpdate({
                                postalCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                            })}
                            placeholder="K1A 0A6"
                            maxLength={7}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                            required
                        />
                    </div>
                </div>

                {/* Service Area Information */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg mt-1">
                            <MapPin className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-green-900 mb-2">Service Area</h4>
                            <p className="text-sm text-green-800 mb-3">
                                Your address helps clients find providers in their area. This information is used to:
                            </p>
                            <ul className="text-sm text-green-800 space-y-1">
                                <li>• Calculate distance from clients</li>
                                <li>• Show you in local search results</li>
                                <li>• Help with service delivery planning</li>
                                <li>• Comply with regional licensing requirements</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Privacy Note */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg mt-1">
                            <Home className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 mb-2">Privacy & Security</h4>
                            <p className="text-sm text-blue-800">
                                Your exact address is kept private and only used for matching with clients in your service area.
                                Only your city and province are displayed publicly on your profile.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Required Fields Note */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">
                        <span className="text-red-500">*</span> All address fields are required for verification and service area determination
                    </p>
                </div>
            </CardContent>
        </Card>
    );
} 