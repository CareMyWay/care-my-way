"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProviderRegistrationNavSideBar } from "@/components/nav-bars/provider-registration-nav-sidebar";
import { PersonalContactSection } from "@/components/provider-profile-forms/personal-contact-section";
import { AddressSection } from "@/components/provider-profile-forms/address-section";
import { EmergencyContactSection } from "@/components/provider-profile-forms/emergency-contact-section";
import toast from "react-hot-toast";

// Type definitions for form data
type PersonalContactData = {
    firstName?: string;
    lastName?: string;
    dob?: string;
    gender?: string;
    languages?: string[];
    phone?: string;
    email?: string;
    preferredContact?: string;
    profilePhoto?: string;
    [key: string]: string | string[] | undefined;
};

type AddressData = {
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    [key: string]: string | undefined;
};

type EmergencyContactData = {
    contactName?: string;
    contactPhone?: string;
    relationship?: string;
    [key: string]: string | undefined;
};

type ProfessionalSummaryData = {
    profileTitle?: string;
    bio?: string;
    yearsExperience?: string;
    askingRate?: string;
    responseTime?: string;
    servicesOffered?: string[];
    [key: string]: string | string[] | undefined;
};

type CredentialsData = {
    education?: string;
    certifications?: string;
    certificateFiles?: File[];
    [key: string]: string | File[] | undefined;
};

export default function CompleteProviderProfile() {
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [activeSection, setActiveSection] = useState("personal-contact");
    const [formData, setFormData] = useState({
        "personal-contact": {},
        address: {},
        "emergency-contact": {},
        "professional-summary": {},
        credentials: {},
    });
    const [sectionCompletion, setSectionCompletion] = useState({
        "personal-contact": { completed: false, progress: 0 },
        address: { completed: false, progress: 0 },
        "emergency-contact": { completed: false, progress: 0 },
        "professional-summary": { completed: false, progress: 0 },
        credentials: { completed: false, progress: 0 },
    });

    const sections = [
        "personal-contact",
        "address",
        "emergency-contact",
        "professional-summary",
        "credentials"
    ];

    // Validation functions (placeholder - we'll build these as we create each section)
    const validatePersonalContact = (data: PersonalContactData) => {
        const required = [
            "firstName",
            "lastName",
            "dob",
            "gender",
            "languages",
            "phone",
            "email",
            "preferredContact",
        ];
        const filled = required.filter((field) => {
            const value = data[field];
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return value && value.toString().trim() !== "";
        });
        return {
            progress: (filled.length / required.length) * 100,
            completed: filled.length === required.length,
        };
    };

    const validateAddress = (data: AddressData) => {
        const required = ["address", "city", "province", "postalCode"];
        const filled = required.filter(
            (field) => data[field] && data[field]!.trim() !== ""
        );
        return {
            progress: (filled.length / required.length) * 100,
            completed: filled.length === required.length,
        };
    };

    const validateEmergencyContact = (data: EmergencyContactData) => {
        const required = ["contactName", "contactPhone", "relationship"];
        const filled = required.filter(
            (field) => data[field] && data[field]!.trim() !== ""
        );
        return {
            progress: (filled.length / required.length) * 100,
            completed: filled.length === required.length,
        };
    };

    const validateProfessionalSummary = (data: ProfessionalSummaryData) => {
        const required = [
            "profileTitle",
            "bio",
            "yearsExperience",
            "askingRate",
            "responseTime",
            "servicesOffered",
        ];
        const filled = required.filter((field) => {
            const value = data[field];
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return value && value.toString().trim() !== "";
        });
        return {
            progress: (filled.length / required.length) * 100,
            completed: filled.length === required.length,
        };
    };

    const validateCredentials = (data: CredentialsData) => {
        const required = ["education", "certifications"];
        const filled = required.filter(
            (field) => data[field] && data[field]!.toString().trim() !== ""
        );
        return {
            progress: (filled.length / required.length) * 100,
            completed: filled.length === required.length,
        };
    };

    type SectionKey = keyof typeof formData;
    type SectionData = PersonalContactData | AddressData | EmergencyContactData | ProfessionalSummaryData | CredentialsData;

    const updateFormData = (section: SectionKey, data: SectionData) => {
        setFormData((prev) => ({
            ...prev,
            [section]: { ...prev[section], ...data },
        }));
    };

    useEffect(() => {
        // Update completion status when form data changes
        const personalContactValidation = validatePersonalContact(formData["personal-contact"]);
        const addressValidation = validateAddress(formData.address);
        const emergencyValidation = validateEmergencyContact(formData["emergency-contact"]);
        const professionalValidation = validateProfessionalSummary(formData["professional-summary"]);
        const credentialsValidation = validateCredentials(formData.credentials);

        setSectionCompletion({
            "personal-contact": personalContactValidation,
            address: addressValidation,
            "emergency-contact": emergencyValidation,
            "professional-summary": professionalValidation,
            credentials: credentialsValidation,
        });
    }, [formData]);

    const navigateToSection = (sectionId: string) => {
        // Can navigate to completed sections or current section
        if (
            sectionCompletion[sectionId as keyof typeof sectionCompletion]?.completed ||
            sectionId === activeSection
        ) {
            setActiveSection(sectionId);
        }
    };

    const handleNext = () => {
        const currentIndex = sections.indexOf(activeSection);
        if (
            currentIndex < sections.length - 1 &&
            sectionCompletion[activeSection as keyof typeof sectionCompletion]?.completed
        ) {
            setActiveSection(sections[currentIndex + 1]);
        }
    };

    const handleBack = () => {
        const currentIndex = sections.indexOf(activeSection);
        if (currentIndex > 0) {
            setActiveSection(sections[currentIndex - 1]);
        }
    };

    const handleSubmit = () => {
        if (Object.values(sectionCompletion).every((section) => section.completed)) {
            setSubmitSuccess(true);
            toast.success("Provider profile completed successfully!", {
                duration: 4000,
            });
            console.log("Provider form data:", formData);
        }
    };

    return (
        <div className="min-h-screen bg-primary-white">
            {/* Mobile sidebar overlay */}
            {showMobileSidebar && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Complete Profile
                            </h2>
                            <button
                                onClick={() => setShowMobileSidebar(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            <ProviderRegistrationNavSideBar
                                activeSection={activeSection}
                                onSectionClick={navigateToSection}
                                sectionCompletion={sectionCompletion}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex h-screen">
                {/* Desktop Sidebar */}
                <div className="hidden lg:flex lg:w-80 lg:flex-col lg:border-r lg:bg-white">
                    <div className="flex h-16 items-center px-6 border-b">
                        <h1 className="text-xl font-bold text-gray-900">
                            Complete Your Provider Profile
                        </h1>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        <ProviderRegistrationNavSideBar
                            activeSection={activeSection}
                            onSectionClick={navigateToSection}
                            sectionCompletion={sectionCompletion}
                        />
                    </div>
                </div>

                {/* Main content area */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Mobile header */}
                    <div className="flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden">
                        <button
                            onClick={() => setShowMobileSidebar(true)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-lg font-semibold text-gray-900">
                            Complete Profile
                        </h1>
                        <div className="w-6" />
                    </div>

                    {/* Form content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="mx-auto max-w-4xl">
                            {/* Form sections */}
                            {activeSection === "personal-contact" && (
                                <PersonalContactSection
                                    onDataChange={(data) => updateFormData("personal-contact", data)}
                                    isCompleted={sectionCompletion["personal-contact"].completed}
                                    defaultValues={formData["personal-contact"]}
                                />
                            )}

                            {activeSection === "address" && (
                                <AddressSection
                                    onDataChange={(data) => updateFormData("address", data)}
                                    isCompleted={sectionCompletion.address.completed}
                                    defaultValues={formData.address}
                                />
                            )}

                            {activeSection === "emergency-contact" && (
                                <EmergencyContactSection
                                    onDataChange={(data) => updateFormData("emergency-contact", data)}
                                    isCompleted={sectionCompletion["emergency-contact"].completed}
                                    defaultValues={formData["emergency-contact"]}
                                />
                            )}

                            {activeSection === "professional-summary" && (
                                <div className="h-full bg-white rounded-lg border shadow-sm p-6">
                                    <h2 className="text-2xl font-bold text-darkest-green mb-4">
                                        Professional Summary
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        This section will contain the Professional Summary form.
                                    </p>
                                    <div className="text-center text-gray-500">
                                        Form component will be added later
                                    </div>
                                </div>
                            )}

                            {activeSection === "credentials" && (
                                <div className="h-full bg-white rounded-lg border shadow-sm p-6">
                                    <h2 className="text-2xl font-bold text-darkest-green mb-4">
                                        Credentials & Work History
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        This section will contain the Credentials & Work History form.
                                    </p>
                                    <div className="text-center text-gray-500">
                                        Form component will be added later
                                    </div>
                                </div>
                            )}

                            {/* Navigation buttons */}
                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={handleBack}
                                    disabled={sections.indexOf(activeSection) === 0}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Back
                                </button>

                                <div className="flex gap-4">
                                    {sections.indexOf(activeSection) === sections.length - 1 ? (
                                        <button
                                            onClick={handleSubmit}
                                            disabled={!Object.values(sectionCompletion).every((section) => section.completed)}
                                            className="px-6 py-2 bg-[#4A9B9B] text-white rounded-md hover:bg-[#3a7a7a] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Complete Profile
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleNext}
                                            disabled={!sectionCompletion[activeSection as keyof typeof sectionCompletion]?.completed}
                                            className="px-6 py-2 bg-[#4A9B9B] text-white rounded-md hover:bg-[#3a7a7a] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Success message */}
                            {submitSuccess && (
                                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-green-800">
                                            Profile completed successfully! You can now{" "}
                                            <Link href="/provider-dashboard" className="font-medium underline">
                                                return to your dashboard
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 