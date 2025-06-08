"use client";

import { useState } from "react";

interface PersonalInfoSectionProps {
  onDataChange: (data: any) => void;
  isCompleted: boolean;
}

export function PersonalInfoSection({
  onDataChange,
  isCompleted,
}: PersonalInfoSectionProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
  });

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  return (
    <div className="w-full h-full bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 md:p-8 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
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
              "1"
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-darkest-green">
              Personal Information
            </h2>
            <p className="text-sm text-gray-600">
              Please provide your basic details
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="std-form-label">
                  First Name *
                </label>
                <input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="std-form-input"
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="std-form-label">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="std-form-input"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="gender" className="std-form-label">
                  Gender *
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="std-form-input"
                  required
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="dob" className="std-form-label">
                  Date of Birth *
                </label>
                <input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  className="std-form-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="std-form-label">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="std-form-input"
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="std-form-label">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="std-form-input"
                placeholder="Enter phone number"
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
