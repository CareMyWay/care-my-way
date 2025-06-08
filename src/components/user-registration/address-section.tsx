"use client";

import { useState } from "react";

interface AddressSectionProps {
  onDataChange: (data: any) => void;
  isCompleted: boolean;
}

export function AddressSection({
  onDataChange,
  isCompleted,
}: AddressSectionProps) {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  return (
    <div className="h-full bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-6 h-full flex flex-col">
        {/* Compact Header */}
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

        {/* Compact Form Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="address" className="std-form-label">
                Street Address *
              </label>
              <input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="std-form-input"
                placeholder="Enter street address"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="std-form-label">
                City *
              </label>
              <input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="std-form-input"
                placeholder="Enter city"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="std-form-label">
                Country *
              </label>
              <input
                id="country"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                className="std-form-input"
                placeholder="Enter country"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="postalCode" className="std-form-label">
                Postal Code *
              </label>
              <input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
                className="std-form-input"
                placeholder="Enter postal code"
              />
            </div>
          </div>
        </div>

        {/* Completion Status */}
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
