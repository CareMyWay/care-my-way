/* eslint-disable no-unused-vars */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const emergencyContactSchema = z.object({
    contactFirstName: z.string().min(1, "First name is required"),
    contactLastName: z.string().min(1, "Last name is required"),
    contactPhone: z
        .string()
        .min(9, "Phone number must be at least 9 digits")
        .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format"),
    relationship: z.string().min(1, "Relationship is required"),
});

type EmergencyContactFormFields = z.infer<typeof emergencyContactSchema>;

interface EmergencyContactSectionProps {
    onDataChange: (_data: EmergencyContactFormFields) => void;
    isCompleted: boolean;
    defaultValues?: Partial<EmergencyContactFormFields>;
}

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
        watch,
        formState: { errors },
    } = useForm<EmergencyContactFormFields>({
        mode: "onChange",
        defaultValues: {
            contactFirstName: defaultValues?.contactFirstName || "",
            contactLastName: defaultValues?.contactLastName || "",
            contactPhone: defaultValues?.contactPhone || "",
            relationship: defaultValues?.relationship || "",
        },
        resolver: zodResolver(emergencyContactSchema),
    });

    // Track and notify parent of progress
    useEffect(() => {
        const subscription = watch((value) => {
            onDataChange(value as EmergencyContactFormFields);
        });
        return () => subscription.unsubscribe();
    }, [watch, onDataChange]);

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
                            "3"
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-darkest-green">
                            Emergency Contact
                        </h2>
                        <p className="text-sm text-gray-600">
                            Please provide details for someone to contact in case of emergency
                        </p>
                    </div>
                </div>

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