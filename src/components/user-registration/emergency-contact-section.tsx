"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the Zod schema
const emergencySchema = z.object({
  contactName: z.string().min(2, "Contact name is required"),
  relationship: z.string().min(2, "Relationship is required"),
  contactPhone: z
    .string()
    .min(10, "Phone number is required")
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
  supportPerson: z.enum(["Select an Option", "Yes", "No"], {
    errorMap: () => ({ message: "Please select Yes or No" }),
  }),
});

type EmergencyFormFields = z.infer<typeof emergencySchema>;

interface EmergencyContactSectionProps {
  onDataChange: (data: EmergencyFormFields) => void;
  isCompleted: boolean;
}

export function EmergencyContactSection({
  onDataChange,
  isCompleted,
}: EmergencyContactSectionProps) {
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<EmergencyFormFields>({
    mode: "onChange",
    resolver: zodResolver(emergencySchema),
    defaultValues: {
      contactName: "",
      relationship: "",
      contactPhone: "",
      supportPerson: "Select an Option", // Default to empty, or use "Yes" if you want to preselect
    },
  });

  const watchedFields = watch();

  // useEffect(() => {
  //   if (isValid) {
  //     onDataChange(watchedFields);
  //   }
  // }, [watchedFields, isValid, onDataChange]);
  // Track and notify parent of progress
  useEffect(() => {
    const subscription = watch((value) => {
      onDataChange(value as EmergencyFormFields);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

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

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="contactName" className="std-form-label">
                Emergency Contact Name *
              </label>
              <input
                id="contactName"
                {...register("contactName")}
                className="std-form-input"
                placeholder="Enter contact name"
              />
              {errors.contactName && (
                <p className="text-sm text-red-600">
                  {errors.contactName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="relationship" className="std-form-label">
                Relationship *
              </label>
              <input
                id="relationship"
                {...register("relationship")}
                className="std-form-input"
                placeholder="e.g., Spouse, Parent, Sibling"
              />
              {errors.relationship && (
                <p className="text-sm text-red-600">
                  {errors.relationship.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="contactPhone" className="std-form-label">
                Phone Number *
              </label>
              <input
                id="contactPhone"
                type="tel"
                {...register("contactPhone")}
                className="std-form-input"
                placeholder="Enter 10-digit phone number"
              />
              {errors.contactPhone && (
                <p className="text-sm text-red-600">
                  {errors.contactPhone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="supportPerson" className="std-form-label">
                Do you have a Support Person? *
              </label>
              <select {...register("supportPerson")} className="std-form-input">
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.supportPerson && (
                <p className="text-sm text-red-600">
                  {errors.supportPerson.message}
                </p>
              )}
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
