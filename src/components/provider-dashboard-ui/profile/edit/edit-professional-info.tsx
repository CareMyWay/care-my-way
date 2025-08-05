"use client";

import { Briefcase, DollarSign, Clock, Award, X, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type ProviderProfileData } from "@/actions/providerProfileActions";
import { healthcareServices, healthcareServiceCategories, type HealthcareService } from "@/utils/healthcare-services";
import { useState } from "react";

interface EditProfessionalInfoProps {
    profileData: Partial<ProviderProfileData>;
    // eslint-disable-next-line no-unused-vars
    onUpdate: (updates: Partial<ProviderProfileData>) => void;
}

const EXPERIENCE_OPTIONS = [
    "Less than 1 year",
    "1-2 years",
    "3-5 years",
    "5+ years"
];

const RESPONSE_TIME_OPTIONS = [
    "Within 1 hour",
    "A few hours",
    "Same day",
    "2-3 days",
    "1 week"
];

export function EditProfessionalInfo({ profileData, onUpdate }: EditProfessionalInfoProps) {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [customService, setCustomService] = useState("");

    const addService = (serviceName: string) => {
        if (serviceName && !profileData.servicesOffered?.includes(serviceName)) {
            const updatedServices = [...(profileData.servicesOffered || []), serviceName];
            onUpdate({ servicesOffered: updatedServices });
        }
    };

    const removeService = (index: number) => {
        const updatedServices = profileData.servicesOffered?.filter((_, i) => i !== index) || [];
        onUpdate({ servicesOffered: updatedServices });
    };

    const addCustomService = () => {
        if (customService.trim() && !profileData.servicesOffered?.includes(customService.trim())) {
            addService(customService.trim());
            setCustomService("");
        }
    };

    const getFilteredServices = (): HealthcareService[] => {
        if (!selectedCategory) return healthcareServices;
        return healthcareServices.filter(service => service.category === selectedCategory);
    };

    return (
        <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-purple-500 rounded-xl">
                        <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    Professional Information
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">

                {/* Experience and Rate */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Clock className="h-4 w-4 inline mr-1" />
                            Years of Experience <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={profileData.yearsExperience || ""}
                            onChange={(e) => onUpdate({ yearsExperience: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                            required
                        >
                            <option value="">Select experience level</option>
                            {EXPERIENCE_OPTIONS.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <DollarSign className="h-4 w-4 inline mr-1" />
                            Hourly Rate (CAD) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={profileData.askingRate || ""}
                            onChange={(e) => onUpdate({ askingRate: parseFloat(e.target.value) })}
                            placeholder="45.00"
                            min="20"
                            max="500"
                            step="0.01"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                            required
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Competitive rates typically range from $25-$80/hour
                        </p>
                    </div>
                </div>

                {/* Response Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Typical Response Time
                    </label>
                    <select
                        value={profileData.responseTime || ""}
                        onChange={(e) => onUpdate({ responseTime: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    >
                        <option value="">Select response time</option>
                        {RESPONSE_TIME_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                        How quickly you typically respond to new client inquiries
                    </p>
                </div>

                {/* Services Offered */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Award className="h-4 w-4 inline mr-1" />
                        Services Offered <span className="text-red-500">*</span>
                    </label>

                    {/* Current Services */}
                    {profileData.servicesOffered && profileData.servicesOffered.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {profileData.servicesOffered.map((service, index) => (
                                <div
                                    key={index}
                                    className="bg-purple-100 text-purple-800 px-3 py-2 rounded-xl text-sm flex items-center gap-2"
                                >
                                    {service}
                                    <button
                                        onClick={() => removeService(index)}
                                        className="text-purple-600 hover:text-purple-800 transition-colors duration-200"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Service Category Filter */}
                    <div className="mb-4">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                        >
                            <option value="">All Categories</option>
                            {Object.values(healthcareServiceCategories).map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Available Services */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 max-h-60 overflow-y-auto border border-gray-200 rounded-xl p-4">
                        {getFilteredServices()
                            .filter(service => !profileData.servicesOffered?.includes(service.name))
                            .map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => addService(service.name)}
                                    className="text-left p-3 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors duration-200 group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900">{service.name}</span>
                                        <Plus className="h-4 w-4 text-gray-400 group-hover:text-purple-500" />
                                    </div>
                                    {service.description && (
                                        <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                                    )}
                                </button>
                            ))}
                    </div>

                    {/* Custom Service Input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={customService}
                            onChange={(e) => setCustomService(e.target.value)}
                            placeholder="Add a custom service..."
                            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                            onKeyPress={(e) => e.key === "Enter" && addCustomService()}
                        />
                        <Button
                            onClick={addCustomService}
                            disabled={!customService.trim()}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-6"
                        >
                            Add
                        </Button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                        Select at least one service you provide to clients
                    </p>
                </div>



                {/* Required Fields Note */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">
                        <span className="text-red-500">*</span> Experience level, hourly rate, and at least one service are required for profile completion
                    </p>
                </div>
            </CardContent>
        </Card>
    );
} 