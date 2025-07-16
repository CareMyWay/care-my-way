/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useFormSection } from "@/hooks/useFormSection";
import { FormSectionHeader } from "./form-section-header";
import { AddressData, BaseFormSectionProps } from "@/types/provider-profile-form";

const addressSchema = z.object({
    address: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
    postalCode: z.string().min(1, "Postal code is required").regex(
        /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
        "Please enter a valid Canadian postal code (e.g., K1A 0A9)"
    ),
});

interface AddressSectionProps extends BaseFormSectionProps<AddressData> {
    // Props are inherited from BaseFormSectionProps
}

// Canadian provinces and territories
const canadianProvinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon"
];

// Address suggestion type
interface AddressSuggestion {
    display_name: string;
    address: {
        house_number?: string;
        road?: string;
        city?: string;
        town?: string;
        village?: string;
        municipality?: string;
        state?: string;
        postcode?: string;
        country?: string;
    };
}

export function AddressSection({
    onDataChange,
    isCompleted,
    defaultValues,
}: AddressSectionProps) {
    const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const {
        register,
        setValue,
        formState: { errors },
    } = useFormSection({
        schema: addressSchema,
        defaultValues: {
            address: defaultValues?.address || "",
            city: defaultValues?.city || "",
            province: defaultValues?.province || "",
            postalCode: defaultValues?.postalCode || "",
        },
        onDataChange: onDataChange as (data: z.infer<typeof addressSchema>) => void,
    });

    // Search addresses using OpenStreetMap Nominatim API
    const searchAddresses = async (query: string) => {
        if (query.length < 3) {
            setAddressSuggestions([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=ca&q=${encodeURIComponent(query)}`,
                {
                    headers: {
                        "User-Agent": "CareMyWay Healthcare Provider App"
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setAddressSuggestions(data);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error("Error searching addresses:", error);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle address selection
    const handleAddressSelect = (suggestion: AddressSuggestion) => {
        const { address } = suggestion;

        // Build street address
        const streetParts = [];
        if (address.house_number) streetParts.push(address.house_number);
        if (address.road) streetParts.push(address.road);
        const streetAddress = streetParts.join(" ");

        // Get city name
        const city = address.city || address.town || address.village || address.municipality || "";

        // Map province/state
        const provinceMapping: { [key: string]: string } = {
            "Alberta": "Alberta",
            "British Columbia": "British Columbia",
            "Manitoba": "Manitoba",
            "New Brunswick": "New Brunswick",
            "Newfoundland and Labrador": "Newfoundland and Labrador",
            "Northwest Territories": "Northwest Territories",
            "Nova Scotia": "Nova Scotia",
            "Nunavut": "Nunavut",
            "Ontario": "Ontario",
            "Prince Edward Island": "Prince Edward Island",
            "Quebec": "Quebec",
            "Saskatchewan": "Saskatchewan",
            "Yukon": "Yukon"
        };

        const province = address.state ? provinceMapping[address.state] || address.state : "";
        const postalCode = address.postcode || "";

        // Update form values
        if (streetAddress) setValue("address", streetAddress);
        if (city) setValue("city", city);
        if (province) setValue("province", province);
        if (postalCode) setValue("postalCode", postalCode.toUpperCase());

        // Hide suggestions
        setShowSuggestions(false);
        setAddressSuggestions([]);
    };

    // Handle address input change with debouncing
    const handleAddressInputChange = (value: string) => {
        setValue("address", value);

        // Clear existing timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Set new timeout for search
        const timeout = setTimeout(() => {
            if (value.trim()) {
                searchAddresses(value);
            } else {
                setAddressSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300); // 300ms delay

        setSearchTimeout(timeout);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    return (
        <div className="h-full bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6 h-full flex flex-col">
                <FormSectionHeader
                    stepNumber={2}
                    title="Address Information"
                    subtitle="Please provide your residential address details"
                    isCompleted={isCompleted}
                />

                {/* Form */}
                <form className="flex-1 overflow-y-auto space-y-6">
                    {/* Street Address with Autocomplete */}
                    <div className="space-y-2">
                        <label htmlFor="address" className="std-form-label">
                            Street Address *
                        </label>
                        <div className="relative">
                            <input
                                id="address"
                                {...register("address")}
                                onChange={(e) => handleAddressInputChange(e.target.value)}
                                onFocus={() => {
                                    if (addressSuggestions.length > 0) {
                                        setShowSuggestions(true);
                                    }
                                }}
                                className="std-form-input pr-10"
                                placeholder="Start typing your address..."
                                autoComplete="off"
                            />

                            {/* Loading indicator */}
                            {isSearching && (
                                <div className="absolute right-3 top-3">
                                    <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}

                            {/* Address Suggestions Dropdown */}
                            {showSuggestions && addressSuggestions.length > 0 && (
                                <>
                                    {/* Backdrop to close dropdown */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowSuggestions(false)}
                                    />

                                    {/* Suggestions List */}
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        <div className="py-1">
                                            {addressSuggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleAddressSelect(suggestion)}
                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 border-none bg-transparent"
                                                >
                                                    <div className="font-medium text-gray-900">
                                                        {suggestion.address.house_number && suggestion.address.road
                                                            ? `${suggestion.address.house_number} ${suggestion.address.road}`
                                                            : suggestion.address.road || "Address"
                                                        }
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {[
                                                            suggestion.address.city || suggestion.address.town || suggestion.address.village,
                                                            suggestion.address.state,
                                                            suggestion.address.postcode
                                                        ].filter(Boolean).join(", ")}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {errors.address && (
                            <p className="text-sm text-red-600">
                                {errors.address.message}
                            </p>
                        )}

                        <p className="text-xs text-gray-500">
                            Start typing and select from suggestions to auto-fill all address fields
                        </p>
                    </div>

                    {/* City and Province */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="city" className="std-form-label">
                                City *
                            </label>
                            <input
                                id="city"
                                {...register("city")}
                                className="std-form-input"
                                placeholder="Enter city"
                            />
                            {errors.city && (
                                <p className="text-sm text-red-600">
                                    {errors.city.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="province" className="std-form-label">
                                Province/Territory *
                            </label>
                            <select
                                id="province"
                                {...register("province")}
                                className="std-form-input"
                            >
                                <option value="">Select province/territory</option>
                                {canadianProvinces.map((province) => (
                                    <option key={province} value={province}>
                                        {province}
                                    </option>
                                ))}
                            </select>
                            {errors.province && (
                                <p className="text-sm text-red-600">
                                    {errors.province.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Postal Code */}
                    <div className="space-y-2">
                        <label htmlFor="postalCode" className="std-form-label">
                            Postal Code *
                        </label>
                        <input
                            id="postalCode"
                            {...register("postalCode")}
                            className="std-form-input"
                            placeholder="e.g., K1A 0A9"
                            maxLength={7}
                            style={{ textTransform: "uppercase" }}
                        />
                        {errors.postalCode && (
                            <p className="text-sm text-red-600">
                                {errors.postalCode.message}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">
                            Please enter a valid Canadian postal code format
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
} 