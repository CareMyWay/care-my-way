/* eslint-disable no-unused-vars */
"use client";

import { getCanadianProvinces } from "@/utils/canadian-provinces";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod schema
const addressSchema = z.object({
  address: z.string().min(10, "Street address is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
  postalCode: z
    .string()
    .regex(
      /^T\d[A-Z] ?\d[A-Z]\d$/,
      "Postal code must be a valid Alberta postal code (e.g., T2N 1N4)"
    ),
});

const provinces = getCanadianProvinces();

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

type AddressFormFields = z.infer<typeof addressSchema>;

interface AddressSectionProps {
  onDataChange: (data: AddressFormFields) => void;
  isCompleted: boolean;
  defaultValues?: AddressFormFields;
}

export function AddressSection({
  onDataChange,
  isCompleted,
  defaultValues,
}: AddressSectionProps) {
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressFormFields>({
    mode: "onChange",
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues || {
      address: "",
      city: "",
      province: "",
      postalCode: "",
    },
  });

  // Track and notify parent of progress
  useEffect(() => {
    const subscription = watch((value) => {
      onDataChange(value as AddressFormFields);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

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
            "User-Agent": "CareMyWay Healthcare Provider App",
          },
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
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      "";

    // Map province/state
    const provinceMapping: { [key: string]: string } = {
      Alberta: "AB",
      "British Columbia": "BC",
      Manitoba: "MB",
      "New Brunswick": "NB",
      "Newfoundland and Labrador": "NL",
      "Northwest Territories": "NT",
      "Nova Scotia": "NS",
      Nunavut: "NU",
      Ontario: "ON",
      "Prince Edward Island": "PE",
      Quebec: "QC",
      Saskatchewan: "SK",
      Yukon: "YT",
    };

    const province = address.state
      ? provinceMapping[address.state] || address.state
      : "";
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
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold ${
              isCompleted
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
              "2"
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-darkest-green">
              Address Information
            </h2>
            <p className="text-sm text-gray-600">
              Please provide your residential address
            </p>
          </div>
        </div>

        {/* Form */}
        <form>
          <div className="flex-1 overflow-y-auto space-y-4">
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
                    <svg
                      className="animate-spin h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
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
                              {suggestion.address.house_number &&
                              suggestion.address.road
                                ? `${suggestion.address.house_number} ${suggestion.address.road}`
                                : suggestion.address.road || "Address"}
                            </div>
                            <div className="text-xs text-gray-600">
                              {[
                                suggestion.address.city ||
                                  suggestion.address.town ||
                                  suggestion.address.village,
                                suggestion.address.state,
                                suggestion.address.postcode,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Start typing and select from suggestions to auto-fill all
                address fields
              </p>
            </div>

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
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="province" className="std-form-label">
                Province *
              </label>
              <select
                id="province"
                {...register("province")}
                className="std-form-input"
              >
                <option value="">Select province</option>
                {provinces.map((province) => (
                  <option key={province.shortCode} value={province.shortCode}>
                    {province.name}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="text-sm text-red-600">
                  {errors.province.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="postalCode" className="std-form-label">
                Postal Code *
              </label>
              <input
                id="postalCode"
                {...register("postalCode")}
                className="std-form-input"
                placeholder="Enter postal code"
                maxLength={7}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-600">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
          </div>
        </form>

        {/* Completion notice */}
        {isCompleted && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2 text-green-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">
                Section completed! Click Next to continue.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
