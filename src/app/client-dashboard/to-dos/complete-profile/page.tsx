"use client";

import { useState, useEffect } from "react";
import { PersonalInfoSection } from "@/components/client-profile-forms/personal-info-section";
import { AddressSection } from "@/components/client-profile-forms/address-section";
import { EmergencyContactSection } from "@/components/client-profile-forms/emergency-contact-section";
import { ClientProfileNavSideBar } from "@/components/nav-bars/client-profile-nav-sidebar";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
// import { useRouter } from "next/navigation";
import { useFormAutoSave } from "@/hooks/useFormAutoSave";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";
import toast from "react-hot-toast";
import { MedicalSection } from "@/components/client-profile-forms/medical-section";
import { LifestyleSection } from "@/components/client-profile-forms/lifestyle-section";
import { AbilitySection } from "@/components/client-profile-forms/ability-section";
import Link from "next/link";

const client = generateClient<Schema>();

// Form validation functions
type PersonalInfoData = {
  firstName?: string;
  lastName?: string;
  gender?: string;
  dob?: string;
  email?: string;
  phone?: string;
  [key: string]: string | undefined;
};

type AddressData = {
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  [key: string]: string | undefined;
};

type EmergencyContactData = {
  contactFirstName?: string;
  contactLastName?: string;
  relationship?: string;
  contactPhone?: string;
  // supportPerson?: boolean | string;
  supportPerson?: "" | "Yes" | "No" | boolean;
  supportFirstName?: string;
  supportLastName?: string;
  supportRelationship?: string;
  supportPhone?: string;
  [key: string]: string | boolean | undefined;
};

type MedicalData = {
  medicalConditions?: string;
  surgeriesOrHospitalizations?: string;
  chronicIllnesses?: string;
  allergies?: string;
  medications?: string;
  [key: string]: string | undefined;
};

type AbilityData = {
  mobilityStatus?: string;
  cognitiveDifficulties?: string[];
  cognitiveDifficultiesOther?: string;
  sensoryImpairments?: string[];
  sensoryImpairmentsOther?: string;
  [key: string]: string | string[] | undefined;
};

type LifestyleData = {
  typicalDay?: string;
  physicalActivity?: string;
  dietaryPreferences?: string;
  sleepHours?: string;
  hobbies?: string;
  socialTime?:
    | "0 days/week"
    | "1 day/week"
    | "2 days/week"
    | "3 days/week"
    | "4 days/week"
    | "5 days/week"
    | "6 days/week"
    | "7 days/week";
  [key: string]: string | undefined;
};

interface CurrentUser {
  userId: string;
  username: string;
}

export default function CompleteClientProfile() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState("personal-info");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [visitedSections, setVisitedSections] = useState<Set<string>>(
    new Set(["personal-info"])
  );
  const [formData, setFormData] = useState({
    "personal-info": {} as PersonalInfoData,
    address: {} as AddressData,
    "emergency-contact": {} as EmergencyContactData,
    medical: {} as MedicalData,
    ability: {} as AbilityData,
    lifestyle: {} as LifestyleData,
  });
  const [sectionCompletion, setSectionCompletion] = useState({
    "personal-info": { completed: false, progress: 0 },
    address: { completed: false, progress: 0 },
    "emergency-contact": { completed: false, progress: 0 },
    medical: { completed: false, progress: 0 },
    ability: { completed: false, progress: 0 },
    lifestyle: { completed: false, progress: 0 },
  });

  const sections = [
    "personal-info",
    "address",
    "emergency-contact",
    "medical",
    "ability",
    "lifestyle",
  ];

  // Auto-save functionality
  const { clearAutoSave } = useFormAutoSave(formData, true);

  // Load form data from session storage
  const loadFromStorage = (): Partial<typeof formData> | null => {
    try {
      const saved = sessionStorage.getItem("client-profile-draft");
      if (!saved) return null;

      const parsed = JSON.parse(saved);
      console.log(
        "Loaded auto-saved form data from",
        new Date(parsed.timestamp).toLocaleTimeString()
      );

      // Remove timestamp before returning
      const { timestamp, ...formData } = parsed;
      return formData;
    } catch (error) {
      console.warn("Failed to load auto-saved form data:", error);
      return null;
    }
  };

  // Load user data and auto-saved form data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Get current user and user attributes
        const user = await getCurrentUser();
        const userAttributes = await fetchUserAttributes();
        setCurrentUser({
          userId: user.userId,
          username: user.username,
        });
        console.log("Current user:", user);
        console.log("User attributes:", userAttributes);

        // Try to load auto-saved data
        const autoSavedData = loadFromStorage();

        if (autoSavedData) {
          console.log("Loading auto-saved form data");
          setFormData(autoSavedData as typeof formData);
          toast.success("Restored your previous progress!", { duration: 3000 });
        } else {
          console.log("No auto-saved data found, starting fresh");
          // Pre-populate with user's basic info from Cognito if available
          setFormData((prev) => ({
            ...prev,
            "personal-info": {
              ...prev["personal-info"],
              firstName: userAttributes.given_name || "",
              lastName: userAttributes.family_name || "",
              email: userAttributes.email || user?.signInDetails?.loginId || "",
            },
          }));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const validatePersonalInfo = (data: PersonalInfoData) => {
    const required = [
      "firstName",
      "lastName",
      "gender",
      "dob",
      "email",
      "phone",
    ];
    const filled = required.filter(
      (field) => data[field] && data[field]?.trim() !== ""
    );
    return {
      progress: (filled.length / required.length) * 100,
      completed: filled.length === required.length,
    };
  };

  const validateAddress = (data: AddressData) => {
    const required = ["address", "city", "province", "postalCode"];
    const filled = required.filter(
      (field) => typeof data[field] === "string" && data[field].trim() !== ""
    );
    return {
      progress: (filled.length / required.length) * 100,
      completed: filled.length === required.length,
    };
  };

  const validateEmergencyContact = (data: EmergencyContactData) => {
    const requiredBase = [
      "contactFirstName",
      "contactLastName",
      "relationship",
      "contactPhone",
      "supportPerson",
    ];

    const supportRequired = [
      "supportFirstName",
      "supportLastName",
      "supportRelationship",
      "supportPhone",
    ];

    const isSupportPersonYes =
      data["supportPerson"]?.toString().toLowerCase() === "yes" ||
      data["supportPerson"] === true;

    const requiredFields = isSupportPersonYes
      ? [...requiredBase, ...supportRequired]
      : requiredBase;

    const filled = requiredFields.filter((field) => {
      const value = data[field];
      return (
        value !== undefined &&
        value !== null &&
        (typeof value === "boolean" ||
          (typeof value === "string" && value.trim() !== ""))
      );
    });

    return {
      progress: (filled.length / requiredFields.length) * 100,
      completed: filled.length === requiredFields.length,
    };
  };

  const validateMedical = (data: MedicalData) => {
    const required = [
      "medicalConditions",
      "surgeriesOrHospitalizations",
      "chronicIllnesses",
      "allergies",
      "medications",
    ];
    const filled = required.filter(
      (field) => typeof data[field] === "string" && data[field].trim() !== ""
    );
    return {
      progress: (filled.length / required.length) * 100,
      completed: filled.length === required.length,
    };
  };

  const validateAbility = (data: AbilityData) => {
    let filledCount = 0;
    let requiredFields = 3; // mobilityStatus, cognitiveDifficulties, sensoryImpairments

    // 1. Check mobilityStatus
    if (
      typeof data.mobilityStatus === "string" &&
      data.mobilityStatus.trim() !== ""
    ) {
      filledCount++;
    }

    // 2. Check cognitiveDifficulties
    if (
      Array.isArray(data.cognitiveDifficulties) &&
      data.cognitiveDifficulties.length > 0
    ) {
      filledCount++;

      // Check cognitiveDifficultiesOther only if 'Other' is selected
      if (data.cognitiveDifficulties.includes("Other")) {
        requiredFields++;
        if (
          typeof data.cognitiveDifficultiesOther === "string" &&
          data.cognitiveDifficultiesOther.trim() !== ""
        ) {
          filledCount++;
        }
      }
    }

    // 3. Check sensoryImpairments
    if (
      Array.isArray(data.sensoryImpairments) &&
      data.sensoryImpairments.length > 0
    ) {
      filledCount++;

      // Check sensoryImpairmentsOther only if 'Other' is selected
      if (data.sensoryImpairments.includes("Other")) {
        requiredFields++;
        if (
          typeof data.sensoryImpairmentsOther === "string" &&
          data.sensoryImpairmentsOther.trim() !== ""
        ) {
          filledCount++;
        }
      }
    }

    const progress = (filledCount / requiredFields) * 100;

    return {
      progress,
      completed: filledCount === requiredFields,
    };
  };

  const validateLifestyle = (data: LifestyleData) => {
    const required = [
      "typicalDay",
      "physicalActivity",
      "dietaryPreferences",
      "sleepHours",
      "hobbies",
      "socialTime",
    ];
    const filled = required.filter(
      (field) => typeof data[field] === "string" && data[field].trim() !== ""
    );
    return {
      progress: (filled.length / required.length) * 100,
      completed: filled.length === required.length,
    };
  };

  type SectionKey =
    | "personal-info"
    | "address"
    | "emergency-contact"
    | "medical"
    | "ability"
    | "lifestyle";

  type SectionData =
    | PersonalInfoData
    | AddressData
    | EmergencyContactData
    | MedicalData
    | AbilityData
    | LifestyleData;

  const updateFormData = (section: SectionKey, data: SectionData) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  useEffect(() => {
    // Update completion status when form data changes
    const personalValidation = validatePersonalInfo(formData["personal-info"]);
    const addressValidation = validateAddress(formData.address);
    const emergencyValidation = validateEmergencyContact(
      formData["emergency-contact"]
    );
    const medicalValidation = validateMedical(formData["medical"]);
    const abilityValidation = validateAbility(formData["ability"]);
    const lifestyleValidation = validateLifestyle(formData["lifestyle"]);

    setSectionCompletion({
      "personal-info": personalValidation,
      address: addressValidation,
      "emergency-contact": emergencyValidation,
      medical: medicalValidation,
      ability: abilityValidation,
      lifestyle: lifestyleValidation,
    });
  }, [formData]);

  // Automatically mark sections as visited when navigated to
  useEffect(() => {
    if (!visitedSections.has(activeSection)) {
      setVisitedSections((prev) => new Set([...prev, activeSection]));
    }
  }, [activeSection, visitedSections]);

  const navigateToSection = (sectionId: string) => {
    // Can navigate to completed sections or current section
    if (
      sectionCompletion[sectionId as keyof typeof sectionCompletion]
        ?.completed ||
      sectionId === activeSection
    ) {
      setActiveSection(sectionId);
      setVisitedSections((prev) => new Set([...prev, sectionId]));
    }
  };

  const handleNext = () => {
    const currentIndex = sections.indexOf(activeSection);
    if (
      currentIndex < sections.length - 1 &&
      sectionCompletion[activeSection as keyof typeof sectionCompletion]
        ?.completed
    ) {
      const nextSection = sections[currentIndex + 1];
      setActiveSection(nextSection);
      setVisitedSections((prev) => new Set([...prev, nextSection]));
    }
  };

  const handleBack = () => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex > 0) {
      const prevSection = sections[currentIndex - 1];
      setActiveSection(prevSection);
      setVisitedSections((prev) => new Set([...prev, prevSection]));
    }
  };

  // const router = useRouter();

  const handleSubmit = async () => {
    if (
      !Object.values(sectionCompletion).every((section) => section.completed)
    ) {
      toast.error("Please complete all required sections before submitting");
      return;
    }

    if (!currentUser?.userId) {
      toast.error("User not found. Please try logging in again.");
      return;
    }

    setIsSaving(true);

    try {
      const personalInfo = formData["personal-info"] as PersonalInfoData;
      const addressInfo = formData.address as AddressData;
      const emergencyInfo = formData[
        "emergency-contact"
      ] as EmergencyContactData;
      const medicalInfo = formData["medical"] as MedicalData;
      const abilityInfo = formData["ability"] as AbilityData;
      const lifestyleInfo = formData["lifestyle"] as LifestyleData;

      const input = {
        userId: currentUser.userId,
        userType: "Client",
        profileOwner: `${currentUser.userId}::${currentUser.username}`,
        email: personalInfo.email,
        phoneNumber: personalInfo.phone,
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        gender: personalInfo.gender,
        dateOfBirth: personalInfo.dob,
        address: addressInfo.address,
        city: addressInfo.city,
        province: addressInfo.province,
        postalCode: addressInfo.postalCode,
        emergencyContactFirstName: emergencyInfo.contactFirstName,
        emergencyContactLastName: emergencyInfo.contactLastName,
        emergencyRelationship: emergencyInfo.relationship,
        emergencyContactPhone: emergencyInfo.contactPhone,
        hasRepSupportPerson:
          emergencyInfo.supportPerson?.toString().toLowerCase() === "yes" ||
          emergencyInfo.supportPerson === true,
        supportFirstName: emergencyInfo.supportFirstName,
        supportLastName: emergencyInfo.supportLastName,
        supportRelationship: emergencyInfo.supportRelationship,
        supportContactPhone: emergencyInfo.supportPhone,
        medicalConditions: medicalInfo.medicalConditions,
        surgeriesOrHospitalizations: medicalInfo.surgeriesOrHospitalizations,
        chronicIllnesses: medicalInfo.chronicIllnesses,
        allergies: medicalInfo.allergies,
        medications: medicalInfo.medications,
        mobilityStatus: abilityInfo.mobilityStatus,
        cognitiveDifficulties: Array.isArray(abilityInfo.cognitiveDifficulties)
          ? abilityInfo.cognitiveDifficulties.join(" , ")
          : abilityInfo.cognitiveDifficulties,
        cognitiveDifficultiesOther:
          abilityInfo.cognitiveDifficultiesOther || "None",
        sensoryImpairments: Array.isArray(abilityInfo.sensoryImpairments)
          ? abilityInfo.sensoryImpairments.join(" , ")
          : abilityInfo.sensoryImpairments,
        sensoryImpairmentsOther: abilityInfo.sensoryImpairmentsOther || "None",
        typicalDay: lifestyleInfo.typicalDay,
        physicalActivity: lifestyleInfo.physicalActivity,
        dietaryPreferences: lifestyleInfo.dietaryPreferences,
        sleepHours: lifestyleInfo.sleepHours,
        hobbies: lifestyleInfo.hobbies,
        socialTime: lifestyleInfo.socialTime,
      };

      console.log("Creating ClientProfile with input:", input);

      const result = await client.models.ClientProfile.create(input);

      if (result.errors) {
        console.error(
          "Error creating ClientProfile:",
          JSON.stringify(result.errors, null, 2)
        );
        toast.error("Failed to complete profile. Please try again.");
        return;
      }

      console.log("ClientProfile created successfully:", result.data);
      setSubmitSuccess(true);
      clearAutoSave();
      toast.success("Client profile completed successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong!");
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
            <ClientProfileNavSideBar
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
                <ClientProfileNavSideBar
                  activeSection={activeSection}
                  onSectionClick={(section) => {
                    navigateToSection(section);
                    setShowMobileSidebar(false);
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
                {activeSection === "personal-info" && (
                  <PersonalInfoSection
                    onDataChange={(data) =>
                      updateFormData("personal-info", data)
                    }
                    isCompleted={sectionCompletion["personal-info"].completed}
                    defaultValues={formData["personal-info"]}
                  />
                )}

                {activeSection === "address" && (
                  <AddressSection
                    onDataChange={(data) => updateFormData("address", data)}
                    isCompleted={sectionCompletion.address.completed}
                    defaultValues={formData["address"]}
                  />
                )}

                {activeSection === "emergency-contact" && (
                  <EmergencyContactSection
                    onDataChange={(data) =>
                      updateFormData("emergency-contact", data)
                    }
                    isCompleted={
                      sectionCompletion["emergency-contact"].completed
                    }
                    defaultValues={{
                      ...formData["emergency-contact"],
                      supportPerson:
                        typeof formData["emergency-contact"].supportPerson ===
                        "boolean"
                          ? formData["emergency-contact"].supportPerson
                            ? "Yes"
                            : "No"
                          : (formData["emergency-contact"].supportPerson ?? ""),
                    }}
                  />
                )}
                {activeSection === "medical" && (
                  <MedicalSection
                    onDataChange={(data) => updateFormData("medical", data)}
                    isCompleted={sectionCompletion["medical"].completed}
                    defaultValues={formData["medical"]}
                  />
                )}
                {activeSection === "ability" && (
                  <AbilitySection
                    onDataChange={(data) => updateFormData("ability", data)}
                    isCompleted={sectionCompletion["ability"].completed}
                    defaultValues={formData["ability"]}
                  />
                )}
                {activeSection === "lifestyle" && (
                  <LifestyleSection
                    onDataChange={(data) => updateFormData("lifestyle", data)}
                    isCompleted={sectionCompletion["lifestyle"].completed}
                    defaultValues={formData["lifestyle"]}
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

                {activeSection === "lifestyle" ? (
                  <button
                    onClick={handleSubmit}
                    disabled={
                      !Object.values(sectionCompletion).every(
                        (section) => section.completed
                      ) || isSaving
                    }
                    className={`px-6 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                      Object.values(sectionCompletion).every(
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
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                      sectionCompletion[
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
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            {/* Modal Content */}
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in duration-300">
              {/* Success Header */}
              <div className="bg-gradient-to-r from-[#4A9B9B] to-[#5CAB9B] px-6 py-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-[#4A9B9B]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Profile Completed!
                </h2>
                <p className="text-white/90 text-md">
                  Congratulations! Your client profile is now complete. Select
                  &apos;Go to Profile&apos; to view your information.
                </p>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-6">
                <div className="space-y-4">
                  {/* Success Message */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-darkest-green mb-2">
                      What&apos;s Next?
                    </h3>
                    <p className="text-gray-600 text-md leading-relaxed">
                      You now have access to the{" "}
                      <strong>Healthcare Transition Quiz</strong> and can start
                      <strong>
                        {" "}
                        Booking appointments with Healthcare Providers.
                      </strong>
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="gap-4 text-center">
                      <div className="text-2xl font-bold text-[#4A9B9B]">✓</div>
                      <div className="text-sm text-gray-600">
                        Profile Complete
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="px-6 pb-6 space-y-3">
                <Link
                  href="/client-dashboard/profile"
                  className="w-full bg-[#CC5034] hover:bg-[#B84529] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-center block"
                >
                  Go to Profile
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
