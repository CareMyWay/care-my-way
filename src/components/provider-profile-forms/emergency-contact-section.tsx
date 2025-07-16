/* eslint-disable no-unused-vars */
"use client";

import { z } from "zod";
import { useFormSection } from "@/hooks/useFormSection";
import { FormSectionHeader } from "./form-section-header";
import { EmergencyContactData, BaseFormSectionProps } from "@/types/provider-profile-form";

const emergencyContactSchema = z.object({
    contactFirstName: z.string().min(1, "First name is required"),
    contactLastName: z.string().min(1, "Last name is required"),
    contactPhone: z
        .string()
        .min(9, "Phone number must be at least 9 digits")
        .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format"),
    relationship: z.string().min(1, "Relationship is required"),
});

interface EmergencyContactSectionProps extends BaseFormSectionProps<EmergencyContactData> { }

// Common relationship options
const relationshipOptions = [
    "Spouse/Partner",
    "Parent",
    "Child",
    "Sibling",
    "Other Family Member",
    "Friend",
    "Colleague",
    "Other"
];

export function EmergencyContactSection({
    onDataChange,
    isCompleted,
    defaultValues,
}: EmergencyContactSectionProps) {
    const {
        register,
        formState: { errors },
    } = useFormSection({
        schema: emergencyContactSchema,
        defaultValues: {
            contactFirstName: defaultValues?.contactFirstName || "",
            contactLastName: defaultValues?.contactLastName || "",
            contactPhone: defaultValues?.contactPhone || "",
            relationship: defaultValues?.relationship || "",
        },
        onDataChange: onDataChange as (data: z.infer<typeof emergencyContactSchema>) => void,
    });

    return (
        <div className="h-full bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6 h-full flex flex-col">
                <FormSectionHeader
                    stepNumber={3}
                    title="Emergency Contact"
                    subtitle="Please provide details for someone to contact in case of emergency"
                    isCompleted={isCompleted}
                />

                {/* Form */}
                <form className="flex-1 overflow-y-auto space-y-6">
                    {/* Contact Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="contactFirstName" className="std-form-label">
                                First Name *
                            </label>
                            <input
                                id="contactFirstName"
                                {...register("contactFirstName")}
                                className="std-form-input"
                                placeholder="Enter first name"
                            />
                            {errors.contactFirstName && (
                                <p className="text-sm text-red-600">
                                    {errors.contactFirstName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="contactLastName" className="std-form-label">
                                Last Name *
                            </label>
                            <input
                                id="contactLastName"
                                {...register("contactLastName")}
                                className="std-form-input"
                                placeholder="Enter last name"
                            />
                            {errors.contactLastName && (
                                <p className="text-sm text-red-600">
                                    {errors.contactLastName.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Contact Phone and Relationship */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="contactPhone" className="std-form-label">
                                Phone Number *
                            </label>
                            <input
                                id="contactPhone"
                                type="tel"
                                {...register("contactPhone")}
                                className="std-form-input"
                                placeholder="Enter phone number"
                            />
                            {errors.contactPhone && (
                                <p className="text-sm text-red-600">
                                    {errors.contactPhone.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="relationship" className="std-form-label">
                                Relationship *
                            </label>
                            <select
                                id="relationship"
                                {...register("relationship")}
                                className="std-form-input"
                            >
                                <option value="">Select relationship</option>
                                {relationshipOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            {errors.relationship && (
                                <p className="text-sm text-red-600">
                                    {errors.relationship.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Important Note */}
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-amber-400 mt-0.5 mr-2 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="text-sm">
                                <p className="font-medium text-amber-800">Important</p>
                                <p className="text-amber-700 mt-1">
                                    This contact will be reached in case of emergencies during your work hours.
                                    Please ensure they are aware of being listed as your emergency contact.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Note */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="text-sm">
                                <p className="font-medium text-blue-800">Privacy & Security</p>
                                <p className="text-blue-700 mt-1">
                                    This information is kept confidential and will only be used in genuine emergency situations.
                                    It is not shared with clients or used for marketing purposes.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
} 