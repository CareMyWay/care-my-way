/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ISO6391 from "iso-639-1";

const personalContactSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Gender is required"),
    languages: z.array(z.string()).min(1, "At least one language is required"),
    phone: z
        .string()
        .min(9, "Phone number must be at least 9 digits")
        .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    preferredContact: z.string().min(1, "Preferred contact method is required"),
    profilePhoto: z.string().optional(),
});

type PersonalContactFormFields = z.infer<typeof personalContactSchema>;

interface PersonalContactSectionProps {
    onDataChange: (_data: PersonalContactFormFields) => void;
    isCompleted: boolean;
    defaultValues?: Partial<PersonalContactFormFields>;
}

// Get comprehensive list of languages from ISO 639-1 standard
const availableLanguages = [...ISO6391.getAllNames().sort(), "Other"];

const contactMethods = [
    "Phone Call",
    "Text Message",
    "Email",
    "Video Call",
    "Any method"
];

export function PersonalContactSection({
    onDataChange,
    isCompleted,
    defaultValues,
}: PersonalContactSectionProps) {
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
        defaultValues?.languages || []
    );
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("");
    const [languageFilter, setLanguageFilter] = useState<string>("");
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);

    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PersonalContactFormFields>({
        mode: "onChange",
        defaultValues: {
            firstName: defaultValues?.firstName || "",
            lastName: defaultValues?.lastName || "",
            dob: defaultValues?.dob || "",
            gender: defaultValues?.gender || "",
            languages: defaultValues?.languages || [],
            phone: defaultValues?.phone || "",
            email: defaultValues?.email || "",
            preferredContact: defaultValues?.preferredContact || "",
            profilePhoto: defaultValues?.profilePhoto || "",
        },
        resolver: zodResolver(personalContactSchema),
    });

    // Filter languages based on search input
    const filteredLanguages = availableLanguages.filter((language) =>
        language.toLowerCase().includes(languageFilter.toLowerCase())
    );

    // Handle language selection
    const handleLanguageToggle = (language: string) => {
        const updatedLanguages = selectedLanguages.includes(language)
            ? selectedLanguages.filter((lang) => lang !== language)
            : [...selectedLanguages, language];

        setSelectedLanguages(updatedLanguages);
        setValue("languages", updatedLanguages);

        // Clear search and close dropdown when selecting
        if (!selectedLanguages.includes(language)) {
            setLanguageFilter("");
            setIsLanguageDropdownOpen(false);
        }
    };

    // Handle removing language
    const handleRemoveLanguage = (language: string) => {
        const updatedLanguages = selectedLanguages.filter((lang) => lang !== language);
        setSelectedLanguages(updatedLanguages);
        setValue("languages", updatedLanguages);
    };

    // Handle backspace to remove last language
    const handleLanguageInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && languageFilter === "" && selectedLanguages.length > 0) {
            handleRemoveLanguage(selectedLanguages[selectedLanguages.length - 1]);
        }
        if (e.key === "Escape") {
            setIsLanguageDropdownOpen(false);
        }
    };

    // Handle profile photo upload
    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setProfilePhotoPreview(result);
                setValue("profilePhoto", result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Track and notify parent of progress
    useEffect(() => {
        const subscription = watch((value) => {
            onDataChange(value as PersonalContactFormFields);
        });
        return () => subscription.unsubscribe();
    }, [watch, onDataChange]);

    // Update languages when selectedLanguages changes
    useEffect(() => {
        setValue("languages", selectedLanguages);
    }, [selectedLanguages, setValue]);

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
                            "1"
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-darkest-green">
                            Personal & Contact Information
                        </h2>
                        <p className="text-sm text-gray-600">
                            Please provide your personal details and contact preferences
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form className="flex-1 overflow-y-auto space-y-6">
                    {/* Name Fields */}
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

                    {/* Date of Birth and Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    {/* Languages Spoken */}
                    <div className="space-y-2">
                        <label className="std-form-label">
                            Languages Spoken *
                            <span className="text-sm text-gray-500 font-normal">
                                (Search and select)
                            </span>
                        </label>

                        {/* Modern Language Selector */}
                        <div className="relative">
                            {/* Main Input Container */}
                            <div
                                className={`std-form-input min-h-[42px] flex items-center cursor-text ${isLanguageDropdownOpen ? '!ring-2 !ring-[black] !border-[black]' : ''
                                    }`}
                                onClick={() => setIsLanguageDropdownOpen(true)}
                            >
                                <div className="flex flex-wrap gap-1 items-center">
                                    {/* Selected Language Chips */}
                                    {selectedLanguages.map((language) => (
                                        <span
                                            key={language}
                                            className="inline-flex items-center px-2 py-1 rounded-md text-s font-medium bg-[#4A9B9B] text-white"
                                        >
                                            {language}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveLanguage(language);
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
                                        placeholder={selectedLanguages.length === 0 ? "Select languages" : "   Search more..."}
                                        value={languageFilter}
                                        onChange={(e) => {
                                            setLanguageFilter(e.target.value);
                                            setIsLanguageDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsLanguageDropdownOpen(true)}
                                        onKeyDown={handleLanguageInputKeyDown}
                                        className="flex-1 min-w-[120px] outline-none bg-transparent text-sm text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Dropdown */}
                            {isLanguageDropdownOpen && (
                                <>
                                    {/* Backdrop to close dropdown */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsLanguageDropdownOpen(false)}
                                    />

                                    {/* Language Options Dropdown */}
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {filteredLanguages.length > 0 ? (
                                            <div className="py-1">
                                                {filteredLanguages.map((language) => (
                                                    <button
                                                        key={language}
                                                        type="button"
                                                        onClick={() => handleLanguageToggle(language)}
                                                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center justify-between ${selectedLanguages.includes(language) ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                                                            }`}
                                                    >
                                                        <span>{language}</span>
                                                        {selectedLanguages.includes(language) && (
                                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                                No languages found matching "{languageFilter}"
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {errors.languages && (
                            <p className="text-sm text-red-600">
                                {errors.languages.message}
                            </p>
                        )}
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    {/* Preferred Contact Method */}
                    <div className="space-y-2">
                        <label htmlFor="preferredContact" className="std-form-label">
                            Preferred Contact Method *
                        </label>
                        <select
                            id="preferredContact"
                            {...register("preferredContact")}
                            className="std-form-input"
                        >
                            <option value="">Select preferred contact method</option>
                            {contactMethods.map((method) => (
                                <option key={method} value={method}>
                                    {method}
                                </option>
                            ))}
                        </select>
                        {errors.preferredContact && (
                            <p className="text-sm text-red-600">
                                {errors.preferredContact.message}
                            </p>
                        )}
                    </div>

                    {/* Profile Photo Upload */}
                    <div className="space-y-2">
                        <label htmlFor="profilePhoto" className="std-form-label">
                            Profile Photo <span className="text-gray-500">(Optional)</span>
                        </label>
                        <div className="flex items-center gap-4">
                            {/* Photo Preview */}
                            <div className="flex-shrink-0">
                                {profilePhotoPreview ? (
                                    <img
                                        src={profilePhotoPreview}
                                        alt="Profile preview"
                                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                                        <svg
                                            className="w-8 h-8 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Upload Button */}
                            <div className="flex-1">
                                <input
                                    id="profilePhoto"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="profilePhoto"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A9B9B] cursor-pointer"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    {profilePhotoPreview ? "Change Photo" : "Upload Photo"}
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    JPG or PNG only (max 5MB)
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
} 