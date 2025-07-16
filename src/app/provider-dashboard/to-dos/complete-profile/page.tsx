"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProviderRegistrationNavSideBar } from "@/components/nav-bars/provider-registration-nav-sidebar";
import { PersonalContactSection } from "@/components/provider-profile-forms/personal-contact-section";
import { AddressSection } from "@/components/provider-profile-forms/address-section";
import { EmergencyContactSection } from "@/components/provider-profile-forms/emergency-contact-section";
import { ProfessionalSummarySection } from "@/components/provider-profile-forms/professional-summary-section";
import { CredentialsSection } from "@/components/provider-profile-forms/credentials-section";
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

type EducationEntry = {
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    graduationYear?: string;
};

type CertificationEntry = {
    certificationName?: string;
    issuingOrganization?: string;
    issueDate?: string;
    expiryDate?: string;
    licenseNumber?: string;
};

type WorkExperienceEntry = {
    employer?: string;
    jobTitle?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
};

type CredentialsData = {
    education?: EducationEntry[];
    certifications?: CertificationEntry[];
    workExperience?: WorkExperienceEntry[];
    [key: string]: EducationEntry[] | CertificationEntry[] | WorkExperienceEntry[] | undefined;
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
        // Since credentials section is completely optional, it's always considered completed
        // Users can add as many or as few entries as they want

        // Calculate progress based on how much content they've added
        let totalFields = 0;
        let filledFields = 0;

        // Count education entries
        if (data.education && data.education.length > 0) {
            data.education.forEach(entry => {
                const educationFields = ['institution', 'degree', 'fieldOfStudy', 'graduationYear'];
                educationFields.forEach(field => {
                    totalFields++;
                    if (entry[field as keyof EducationEntry] && entry[field as keyof EducationEntry]!.trim() !== '') {
                        filledFields++;
                    }
                });
            });
        }

        // Count certification entries
        if (data.certifications && data.certifications.length > 0) {
            data.certifications.forEach(entry => {
                const certFields = ['certificationName', 'issuingOrganization', 'issueDate'];
                certFields.forEach(field => {
                    totalFields++;
                    if (entry[field as keyof CertificationEntry] && entry[field as keyof CertificationEntry]!.trim() !== '') {
                        filledFields++;
                    }
                });
            });
        }

        // Count work experience entries
        if (data.workExperience && data.workExperience.length > 0) {
            data.workExperience.forEach(entry => {
                const workFields = ['employer', 'jobTitle', 'startDate'];
                workFields.forEach(field => {
                    totalFields++;
                    if (entry[field as keyof WorkExperienceEntry] && entry[field as keyof WorkExperienceEntry]!.trim() !== '') {
                        filledFields++;
                    }
                });
            });
        }

        // If no entries exist, show 100% progress (section is optional)
        const progress = totalFields === 0 ? 100 : (filledFields / totalFields) * 100;

        return {
            progress: Math.round(progress),
            completed: true, // Always completed since it's optional
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
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-4 my-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Sidebar - hidden on mobile, visible on md+ */}
                    <div className="hidden md:block md:col-span-3">
                        <ProviderRegistrationNavSideBar
                            activeSection={activeSection}
                            onSectionClick={navigateToSection}
                            sectionCompletion={sectionCompletion}
                        />
                    </div>

                    {/* Mobile Toggle for Sidebar */}
                    <div className="block md:hidden mb-4">
                        <button
                            onClick={() => setShowMobileSidebar((prev) => !prev)}
                            className="w-full bg-[#4A9B9B] text-white font-semibold py-2 rounded-md shadow-sm"
                        >
                            {showMobileSidebar ? "Hide" : "Show"} Sections
                        </button>

                        {showMobileSidebar && (
                            <div className="mt-2">
                                <ProviderRegistrationNavSideBar
                                    activeSection={activeSection}
                                    onSectionClick={(section) => {
                                        navigateToSection(section);
                                        setShowMobileSidebar(false); // Auto-close after selection
                                    }}
                                    sectionCompletion={sectionCompletion}
                                />
                            </div>
                        )}
                    </div>

                    {/* Form Content */}
                    <div className="col-span-1 md:col-span-9">
                        <div className="h-full flex flex-col">
                            {/* Form Section */}
                            <div className="flex-1 overflow-hidden">
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
                                    <ProfessionalSummarySection
                                        onDataChange={(data) => updateFormData("professional-summary", data)}
                                        isCompleted={sectionCompletion["professional-summary"].completed}
                                        defaultValues={formData["professional-summary"]}
                                    />
                                )}

                                {activeSection === "credentials" && (
                                    <CredentialsSection
                                        onDataChange={(data) => updateFormData("credentials", data)}
                                        isCompleted={sectionCompletion.credentials.completed}
                                        defaultValues={formData.credentials}
                                    />
                                )}
                            </div>

                            {/* Compact Action Buttons */}
                            <div className="mt-4 flex flex-wrap justify-between items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
                                <button
                                    onClick={handleBack}
                                    disabled={sections.indexOf(activeSection) === 0}
                                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    ← Back
                                </button>

                                <div className="flex-1 text-center min-w-[120px]">
                                    <div className="text-sm text-gray-600 mb-1">
                                        Step {sections.indexOf(activeSection) + 1} of{" "}
                                        {sections.length}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {
                                            Object.values(sectionCompletion).filter(
                                                (s) => s.completed
                                            ).length
                                        }{" "}
                                        completed
                                    </div>
                                </div>

                                {activeSection === "credentials" ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={
                                            !Object.values(sectionCompletion).every(
                                                (section) => section.completed
                                            )
                                        }
                                        className={`px-6 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${Object.values(sectionCompletion).every(
                                            (section) => section.completed
                                        )
                                                ? "bg-[#CC5034] hover:bg-[#B84529] text-white shadow-md hover:shadow-lg"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            }`}
                                    >
                                        Complete Profile
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        disabled={
                                            !sectionCompletion[
                                                activeSection as keyof typeof sectionCompletion
                                            ]?.completed
                                        }
                                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${sectionCompletion[
                                                activeSection as keyof typeof sectionCompletion
                                            ]?.completed
                                                ? "bg-[#4A9B9B] hover:bg-[#3A8B8B] text-white"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            }`}
                                    >
                                        Next →
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {submitSuccess && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white border border-green-300 text-green-800 px-6 py-4 rounded-lg shadow-md flex flex-col items-center gap-2 z-50">
                    <p className="font-semibold">🎉 Your provider profile has been completed!</p>
                    <Link
                        href="/provider-dashboard"
                        className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition"
                    >
                        View your Dashboard
                    </Link>
                </div>
            )}
        </div>
    );
} 