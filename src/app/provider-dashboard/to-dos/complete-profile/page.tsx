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
import { getCurrentUser } from "aws-amplify/auth";
import {
    getProviderProfile,
    updateProviderProfile,
    transformFormDataToProfile,
    type ProviderProfileData
} from "@/actions/providerProfileActions";
import {
    CompleteProfileFormData,
    SectionCompletionState,
    SectionKey,
    PersonalContactData,
    AddressData,
    EmergencyContactData,
    ProfessionalSummaryData,
    CredentialsData,
    EducationEntry,
    CertificationEntry,
    WorkExperienceEntry
} from "@/types/provider-profile-form";
import { SECTION_VALIDATORS } from "@/utils/profile-form-config";
import { useFormAutoSave } from "@/hooks/useFormAutoSave";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";



export default function CompleteProviderProfile() {
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [activeSection, setActiveSection] = useState("personal-contact");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [existingProfile, setExistingProfile] = useState<ProviderProfileData | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [visitedSections, setVisitedSections] = useState<Set<string>>(new Set(["personal-contact"]));

    const [formData, setFormData] = useState<CompleteProfileFormData>({
        "personal-contact": {},
        address: {},
        "emergency-contact": {},
        "professional-summary": {},
        credentials: {},
    });
    const [sectionCompletion, setSectionCompletion] = useState<SectionCompletionState>({
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

    // Load existing profile data on mount
    useEffect(() => {
        const loadProfileData = async () => {
            try {
                setIsLoading(true);

                // Get current user
                const user = await getCurrentUser();
                setCurrentUser(user);
                console.log("Current user:", user);

                // Try to load existing provider profile first
                let profileFromDB = null;
                if (user?.userId) {
                    profileFromDB = await getProviderProfile(user.userId);
                    console.log("Existing profile:", profileFromDB);

                    if (profileFromDB) {
                        setExistingProfile(profileFromDB);
                    }
                }

                // Try to load auto-saved data
                const autoSavedData = loadFromStorage();

                if (autoSavedData) {
                    console.log("Loading auto-saved form data - this takes priority");
                    setFormData(autoSavedData as CompleteProfileFormData);
                    toast.success("Restored your previous progress!", { duration: 3000 });
                } else if (profileFromDB) {
                    console.log("No auto-saved data found, using profile from database");
                    // Only populate from database if no auto-saved data exists
                    setFormData({
                        "personal-contact": {
                            firstName: profileFromDB.firstName || "",
                            lastName: profileFromDB.lastName || "",
                            dob: profileFromDB.dob || "",
                            gender: profileFromDB.gender || "",
                            languages: profileFromDB.languages || [],
                            phone: profileFromDB.phone || "",
                            email: profileFromDB.email || "",
                            preferredContact: profileFromDB.preferredContact || "",
                            profilePhoto: profileFromDB.profilePhoto || "",
                        },
                        address: {
                            address: profileFromDB.address || "",
                            city: profileFromDB.city || "",
                            province: profileFromDB.province || "",
                            postalCode: profileFromDB.postalCode || "",
                        },
                        "emergency-contact": {
                            contactFirstName: profileFromDB.emergencyContactName ? profileFromDB.emergencyContactName.split(' ')[0] : '',
                            contactLastName: profileFromDB.emergencyContactName ? profileFromDB.emergencyContactName.split(' ').slice(1).join(' ') : '',
                            contactPhone: profileFromDB.emergencyContactPhone || "",
                            relationship: profileFromDB.emergencyContactRelationship || "",
                        },
                        "professional-summary": {
                            profileTitle: profileFromDB.profileTitle || "",
                            bio: profileFromDB.bio || "",
                            yearsExperience: profileFromDB.yearsExperience || "",
                            askingRate: profileFromDB.askingRate || "",
                            rateType: profileFromDB.rateType || "",
                            responseTime: profileFromDB.responseTime || "",
                            servicesOffered: profileFromDB.servicesOffered || [],
                        },
                        credentials: {
                            education: profileFromDB.education || [],
                            certifications: profileFromDB.certifications || [],
                            workExperience: profileFromDB.workExperience || [],
                        },
                    });
                }
            } catch (error) {
                console.error("Error loading profile data:", error);
                toast.error("Failed to load existing profile data");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfileData();
    }, []);

    // Auto-save functionality
    const { loadFromStorage, clearAutoSave } = useFormAutoSave(formData, !existingProfile?.isProfileComplete);

    // Navigation guard to warn about unsaved changes
    const hasUnsavedChanges = Object.values(sectionCompletion).some(s => s.progress > 0 && !s.completed);
    const { guardedNavigate } = useNavigationGuard({
        isEnabled: true,
        hasUnsavedChanges: hasUnsavedChanges && !isSaving,
        message: "You have unsaved progress in your profile. Are you sure you want to leave? Your progress will be auto-saved."
    });

    const updateFormData = (section: SectionKey, data: any) => {
        setFormData((prev) => ({
            ...prev,
            [section]: { ...prev[section], ...data },
        }));
    };

    useEffect(() => {
        // Update completion status when form data changes using configuration-driven validation
        const newCompletion = Object.keys(formData).reduce((acc, sectionKey) => {
            const validator = SECTION_VALIDATORS[sectionKey as SectionKey];
            acc[sectionKey as SectionKey] = validator(formData[sectionKey as SectionKey], visitedSections);
            return acc;
        }, {} as SectionCompletionState);

        setSectionCompletion(newCompletion);
    }, [formData, visitedSections]);

    // Automatically mark credentials section as visited when user reaches it
    useEffect(() => {
        if (activeSection === "credentials" && !visitedSections.has("credentials")) {
            setVisitedSections(prev => new Set([...prev, "credentials"]));
        }
    }, [activeSection, visitedSections]);

    const navigateToSection = (sectionId: string) => {
        // Can navigate to completed sections or current section
        if (
            sectionCompletion[sectionId as keyof typeof sectionCompletion]?.completed ||
            sectionId === activeSection
        ) {
            setActiveSection(sectionId);
            // Mark section as visited
            setVisitedSections(prev => new Set([...prev, sectionId]));
        }
    };

    const handleNext = () => {
        const currentIndex = sections.indexOf(activeSection);
        if (
            currentIndex < sections.length - 1 &&
            sectionCompletion[activeSection as keyof typeof sectionCompletion]?.completed
        ) {
            const nextSection = sections[currentIndex + 1];
            setActiveSection(nextSection);
            // Mark next section as visited
            setVisitedSections(prev => new Set([...prev, nextSection]));
        }
    };

    const handleBack = () => {
        const currentIndex = sections.indexOf(activeSection);
        if (currentIndex > 0) {
            const prevSection = sections[currentIndex - 1];
            setActiveSection(prevSection);
            // Mark previous section as visited (should already be visited, but just in case)
            setVisitedSections(prev => new Set([...prev, prevSection]));
        }
    };

    const handleSubmit = async () => {
        if (!Object.values(sectionCompletion).every((section) => section.completed)) {
            toast.error("Please complete all required sections before submitting");
            return;
        }

        if (!currentUser?.userId) {
            toast.error("User not found. Please try logging in again.");
            return;
        }

        setIsSaving(true);

        try {
            // Transform form data to database format
            const profileOwner = `${currentUser.userId}::${currentUser.username}`;
            const profileData = transformFormDataToProfile(formData, currentUser.userId, profileOwner);

            // Set profile as complete
            profileData.isProfileComplete = true;
            profileData.isPubliclyVisible = true;

            console.log("Updating profile data:", profileData);

            if (!existingProfile?.id) {
                throw new Error("No existing profile found. Please try refreshing the page.");
            }

            // Always update the existing profile
            const result = await updateProviderProfile(existingProfile.id, profileData);

            if (result) {
                setExistingProfile(result);
                setSubmitSuccess(true);

                // Clear auto-saved data since profile is now complete
                clearAutoSave();

                toast.success("Provider profile completed successfully!");
                console.log("Profile completed successfully:", result);
            } else {
                throw new Error("Failed to update profile");
            }

        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to save profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-primary-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A9B9B] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

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
                                            ) || isSaving
                                        }
                                        className={`px-6 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${Object.values(sectionCompletion).every(
                                            (section) => section.completed
                                        ) && !isSaving
                                            ? "bg-[#CC5034] hover:bg-[#B84529] text-white shadow-md hover:shadow-lg"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            }`}
                                    >
                                        {isSaving ? "Saving..." : "Complete Profile"}
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
                <>
                    {/* Modal Backdrop */}
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    >
                        {/* Modal Content */}
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in duration-300">
                            {/* Success Header */}
                            <div className="bg-gradient-to-r from-[#4A9B9B] to-[#5CAB9B] px-6 py-8 text-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-[#4A9B9B]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Profile Completed!</h2>
                                <p className="text-white/90 text-sm">
                                    Congratulations! Your provider profile is now complete and ready to be discovered by clients.
                                </p>
                            </div>

                            {/* Modal Body */}
                            <div className="px-6 py-6">
                                <div className="space-y-4">
                                    {/* Success Message */}
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-darkest-green mb-2">
                                            What's Next?
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            Your profile is now live in our marketplace. Clients can find and connect with you based on your services and location.
                                        </p>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4 text-center">
                                            <div>
                                                <div className="text-2xl font-bold text-[#4A9B9B]">✓</div>
                                                <div className="text-xs text-gray-600">Profile Complete</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-[#4A9B9B]">🌟</div>
                                                <div className="text-xs text-gray-600">Now Discoverable</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="px-6 pb-6 space-y-3">
                                <Link
                                    href="/provider-dashboard"
                                    className="w-full bg-[#CC5034] hover:bg-[#B84529] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-center block"
                                >
                                    Go to Dashboard
                                </Link>
                                <button
                                    onClick={() => setSubmitSuccess(false)}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-center"
                                >
                                    Stay Here
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
} 