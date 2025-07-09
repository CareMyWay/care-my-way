/* eslint-disable no-unused-vars */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.string().min(1, "Gender is required"),
  dob: z.string().min(1, "Date of birth is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phone: z
    .string()
    .min(9, "Phone number must be at least 9 digits")
    .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format"),
});

type PersonalInfoFormFields = z.infer<typeof personalInfoSchema>;

interface PersonalInfoSectionProps {
  onDataChange: (_data: PersonalInfoFormFields) => void;
  isCompleted: boolean;
  defaultValues?: PersonalInfoFormFields; // optional for future default support
}

export function PersonalInfoSection({
  onDataChange,
  isCompleted,
  defaultValues,
}: PersonalInfoSectionProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<PersonalInfoFormFields>({
    mode: "onChange",
    defaultValues: defaultValues || {
      firstName: "",
      lastName: "",
      gender: "",
      dob: "",
      email: "",
      phone: "",
    },
    resolver: zodResolver(personalInfoSchema),
  });

  //const watchedFields = watch();

  // Track and notify parent of progress
  useEffect(() => {
    const subscription = watch((value) => {
      onDataChange(value as PersonalInfoFormFields);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

  return (
    <div className="h-full bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-6 h-full flex flex-col">
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
              Please provide your person information
            </p>
          </div>
        </div>

        {/* Form */}
        <form>
          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="std-form-label">
                  First Name *
                </label>
                <input
                  id="firstName"
                  {...register("firstName")}
                  className="std-form-input"
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="std-form-label">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  {...register("lastName")}
                  className="std-form-input"
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="gender" className="std-form-label">
                  Gender *
                </label>
                <select
                  id="gender"
                  {...register("gender")}
                  className="std-form-input"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-red-600">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="dob" className="std-form-label">
                  Date of Birth *
                </label>
                <input
                  id="dob"
                  type="date"
                  max={
                    new Date(Date.now() - 86400000).toISOString().split("T")[0]
                  } // yesterday's date
                  {...register("dob")}
                  className="std-form-input"
                />
                {errors.dob && (
                  <p className="text-sm text-red-600">{errors.dob.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="std-form-label">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="std-form-input"
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="std-form-label">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                {...register("phone")}
                className="std-form-input"
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {isCompleted && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2 text-green-700">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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
        </form>
      </div>
    </div>
  );
}
