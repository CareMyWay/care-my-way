"use client";

import { useState } from "react";

interface EmergencyContactSectionProps {
  onDataChange: (data: any) => void;
  isCompleted: boolean;
}

export function EmergencyContactSection({
  onDataChange,
  isCompleted,
}: EmergencyContactSectionProps) {
  const [formData, setFormData] = useState({
    contactName: "",
    relationship: "",
    contactPhone: "",
    supportPerson: "",
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
              "3"
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-darkest-green">
              Emergency Contact
            </h2>
            <p className="text-sm text-gray-600">
              Please provide emergency contact details
            </p>
          </div>
        </div>

        {/* Compact Form Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="contactName" className="std-form-label">
                Emergency Contact Name *
              </label>
              <input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleChange("contactName", e.target.value)}
                className="std-form-input"
                placeholder="Enter contact name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="relationship" className="std-form-label">
                Relationship *
              </label>
              <input
                id="relationship"
                value={formData.relationship}
                onChange={(e) => handleChange("relationship", e.target.value)}
                className="std-form-input"
                placeholder="e.g., Spouse, Parent, Sibling"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contactPhone" className="std-form-label">
                Phone Number *
              </label>
              <input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
                className="std-form-input"
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="supportPerson" className="std-form-label">
                Do you have a Support Person? *
              </label>
              <input
                id="supportPerson"
                value={formData.supportPerson}
                onChange={(e) => handleChange("supportPerson", e.target.value)}
                className="std-form-input"
                placeholder="Yes or No"
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
                All sections completed! Ready to submit.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
