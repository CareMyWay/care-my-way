/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { healthcareServiceNames } from "@/utils/healthcare-services";

const professionalSummarySchema = z.object({
    profileTitle: z.string().min(1, "Profile title is required"),
    bio: z.string().min(10, "Bio must be at least 10 characters").max(500, "Bio must be 500 characters or less"),
    yearsExperience: z.string().min(1, "Years of experience is required"),
    askingRate: z.string().min(1, "Asking rate is required"),
    rateType: z.string().min(1, "Rate type is required"),
    responseTime: z.string().min(1, "Response time is required"),
    servicesOffered: z.array(z.string()).min(1, "At least one service must be selected"),
});

type ProfessionalSummaryFormFields = z.infer<typeof professionalSummarySchema>;

interface ProfessionalSummarySectionProps {
    onDataChange: (_data: ProfessionalSummaryFormFields) => void;
    isCompleted: boolean;
    defaultValues?: Partial<ProfessionalSummaryFormFields>;
}

// Healthcare services imported from utils

// Years of experience options
const experienceOptions = [
    "Less than 1 year",
    "1-2 years",
    "3-5 years",
    "6-10 years",
    "11-15 years",
    "16-20 years",
    "More than 20 years"
];

// Rate types
const rateTypes = [
    "Per hour",
    "Per visit",
    "Per day",
    "Per week",
    "Per month"
];

// Response time options
const responseTimeOptions = [
    "Within 1 hour",
    "A few hours",
    "Same day",
    "2-3 days",
    "1 week"
];

export function ProfessionalSummarySection({
    onDataChange,
    isCompleted,
    defaultValues,
}: ProfessionalSummarySectionProps) {
    const [selectedServices, setSelectedServices] = useState<string[]>(
        defaultValues?.servicesOffered || []
    );
    const [serviceFilter, setServiceFilter] = useState<string>("");
    const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState<boolean>(false);

    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ProfessionalSummaryFormFields>({
        mode: "onChange",
        defaultValues: {
            profileTitle: defaultValues?.profileTitle || "",
            bio: defaultValues?.bio || "",
            yearsExperience: defaultValues?.yearsExperience || "",
            askingRate: defaultValues?.askingRate || "",
            rateType: defaultValues?.rateType || "",
            responseTime: defaultValues?.responseTime || "",
            servicesOffered: defaultValues?.servicesOffered || [],
        },
        resolver: zodResolver(professionalSummarySchema),
    });

    // Filter services based on search input
    const filteredServices = healthcareServiceNames.filter((service) =>
        service.toLowerCase().includes(serviceFilter.toLowerCase())
    );

    // Handle service selection
    const handleServiceToggle = (service: string) => {
        const updatedServices = selectedServices.includes(service)
            ? selectedServices.filter((s) => s !== service)
            : [...selectedServices, service];

        setSelectedServices(updatedServices);
        setValue("servicesOffered", updatedServices);

        // Clear search and close dropdown when selecting
        if (!selectedServices.includes(service)) {
            setServiceFilter("");
            setIsServiceDropdownOpen(false);
        }
    };

    // Handle removing service
    const handleRemoveService = (service: string) => {
        const updatedServices = selectedServices.filter((s) => s !== service);
        setSelectedServices(updatedServices);
        setValue("servicesOffered", updatedServices);
    };

    // Handle service input change
    const handleServiceInputChange = (value: string) => {
        setServiceFilter(value);
        setIsServiceDropdownOpen(true);
    };

    // Handle backspace to remove last service
    const handleServiceInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && serviceFilter === "" && selectedServices.length > 0) {
            handleRemoveService(selectedServices[selectedServices.length - 1]);
        }
        if (e.key === "Escape") {
            setIsServiceDropdownOpen(false);
        }
    };

    // Track and notify parent of progress
    useEffect(() => {
        const subscription = watch((value) => {
            onDataChange(value as ProfessionalSummaryFormFields);
        });
        return () => subscription.unsubscribe();
    }, [watch, onDataChange]);

    // Update services when selectedServices changes
    useEffect(() => {
        setValue("servicesOffered", selectedServices);
    }, [selectedServices, setValue]);

    return (
        <div className="h-full bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold ${isCompleted
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-[#4A9B9B] bg-[#4A9B9B] text-white"
                            }`}
                    >
                        {isCompleted ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            "4"
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-darkest-green">
                            Professional Summary
                        </h2>
                        <p className="text-sm text-gray-600">
                            Showcase your expertise, experience, and services offered
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form className="flex-1 overflow-y-auto space-y-6">
                    {/* Profile Title */}
                    <div className="space-y-2">
                        <label htmlFor="profileTitle" className="std-form-label">
                            Profile Title / Professional Header *
                        </label>
                        <input
                            id="profileTitle"
                            {...register("profileTitle")}
                            className="std-form-input"
                            placeholder="e.g., Licensed LPN – Specializing in Seniors' Care"
                        />
                        {errors.profileTitle && (
                            <p className="text-sm text-red-600">
                                {errors.profileTitle.message}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">
                            This will be the first thing clients see. Keep it professional and specific.
                        </p>
                    </div>

                    {/* About / Bio */}
                    <div className="space-y-2">
                        <label htmlFor="bio" className="std-form-label">
                            About You / Professional Bio *
                        </label>
                        <div className="relative">
                            <textarea
                                id="bio"
                                {...register("bio")}
                                rows={8}
                                maxLength={500}
                                className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#4A9B9B] focus:border-[#4A9B9B] scrollbar-hide"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                placeholder="Describe your background, specializations, approach to care, and what makes you unique as a healthcare provider..."
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded">
                                {watch("bio")?.length || 0}/500
                            </div>
                        </div>
                        {errors.bio && (
                            <p className="text-sm text-red-600">
                                {errors.bio.message}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">
                            Share your experience, care philosophy, and what clients can expect from your services.
                        </p>
                    </div>

                    {/* Years of Experience and Response Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="yearsExperience" className="std-form-label">
                                Years of Experience *
                            </label>
                            <select
                                id="yearsExperience"
                                {...register("yearsExperience")}
                                className="std-form-input"
                            >
                                <option value="">Select experience level</option>
                                {experienceOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            {errors.yearsExperience && (
                                <p className="text-sm text-red-600">
                                    {errors.yearsExperience.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="responseTime" className="std-form-label">
                                Response Time *
                            </label>
                            <select
                                id="responseTime"
                                {...register("responseTime")}
                                className="std-form-input"
                            >
                                <option value="">Select typical response time</option>
                                {responseTimeOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            {errors.responseTime && (
                                <p className="text-sm text-red-600">
                                    {errors.responseTime.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Asking Rate */}
                    <div className="space-y-2">
                        <label className="std-form-label">
                            Asking Rate *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    {...register("askingRate")}
                                    className="std-form-input"
                                    placeholder="e.g., 25.00"
                                />
                                {errors.askingRate && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.askingRate.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <select
                                    {...register("rateType")}
                                    className="std-form-input"
                                >
                                    <option value="">Rate type</option>
                                    {rateTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {errors.rateType && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.rateType.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">
                            Enter your rate in CAD. This helps clients understand your pricing structure.
                        </p>
                    </div>

                    {/* Services Offered */}
                    <div className="space-y-2">
                        <label className="std-form-label">
                            Services Offered *
                            <span className="text-sm text-gray-500 font-normal">
                                (Search and select)
                            </span>
                        </label>

                        {/* Service Selector */}
                        <div className="relative">
                            {/* Main Input Container */}
                            <div
                                className={`w-full min-h-[60px] p-2 border-2 border-gray-300 rounded-lg flex items-center cursor-text ${isServiceDropdownOpen ? '!ring-2 !ring-[#4A9B9B] !border-[#4A9B9B]' : ''
                                    }`}
                                onClick={() => setIsServiceDropdownOpen(true)}
                            >
                                <div className="flex flex-wrap gap-1 items-center">
                                    {/* Selected Service Chips */}
                                    {selectedServices.map((service) => (
                                        <span
                                            key={service}
                                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#4A9B9B] text-white"
                                        >
                                            {service}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveService(service);
                                                }}
                                                className="ml-1 inline-flex items-center justify-center w-3 h-3 rounded-full text-[#4A9B9B] bg-white hover:bg-gray-100"
                                            >
                                                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    ))}

                                    {/* Search Input */}
                                    <input
                                        type="text"
                                        placeholder={selectedServices.length === 0 ? "Select services" : "Search more..."}
                                        value={serviceFilter}
                                        onChange={(e) => handleServiceInputChange(e.target.value)}
                                        onFocus={() => setIsServiceDropdownOpen(true)}
                                        onKeyDown={handleServiceInputKeyDown}
                                        className="flex-1 min-w-[200px] outline-none bg-transparent text-sm text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Dropdown */}
                            {isServiceDropdownOpen && (
                                <>
                                    {/* Backdrop to close dropdown */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsServiceDropdownOpen(false)}
                                    />

                                    {/* Service Options Dropdown */}
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {filteredServices.length > 0 ? (
                                            <div className="py-1">
                                                {filteredServices.map((service) => (
                                                    <button
                                                        key={service}
                                                        type="button"
                                                        onClick={() => handleServiceToggle(service)}
                                                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center justify-between ${selectedServices.includes(service) ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                                                            }`}
                                                    >
                                                        <span>{service}</span>
                                                        {selectedServices.includes(service) && (
                                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                                No services found matching "{serviceFilter}"
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {errors.servicesOffered && (
                            <p className="text-sm text-red-600">
                                {errors.servicesOffered.message}
                            </p>
                        )}
                    </div>

                    {/* Professional Note */}
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="text-sm">
                                <p className="font-medium text-green-800">Profile Optimization</p>
                                <p className="text-green-700 mt-1">
                                    A complete and detailed profile helps clients find the right care provider.
                                    Be specific about your specializations and highlight what makes your care unique.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
} 