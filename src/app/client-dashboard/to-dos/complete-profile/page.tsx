"use client";

import { useState, useEffect } from "react";
import { PersonalInfoSection } from "@/components/client-profile-forms/personal-info-section";
import { AddressSection } from "@/components/client-profile-forms/address-section";
import { EmergencyContactSection } from "@/components/client-profile-forms/emergency-contact-section";
import { ClientProfileNavSideBar } from "@/components/nav-bars/client-profile-nav-sidebar";
import { getCurrentUser } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";

import toast from "react-hot-toast";
import { MedicalSection } from "@/components/client-profile-forms/medical-section";
import { LifestyleSection } from "@/components/client-profile-forms/lifestyle-section";
import { AbilitySection } from "@/components/client-profile-forms/ability-section";

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
  supportPerson?: boolean | string;
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
  socialTime?: string;
  [key: string]: string | undefined;
};

export default function CompleteClientProfile() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeSection, setActiveSection] = useState("personal-info");
  const [formData, setFormData] = useState({
    "personal-info": {},
    address: {},
    "emergency-contact": {},
    medical: {},
    ability: {},
    lifestyle: {},
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

  const navigateToSection = (sectionId: string) => {
    // Can navigate to completed sections or current section
    if (
      sectionCompletion[sectionId as keyof typeof sectionCompletion]
        ?.completed ||
      sectionId === activeSection
    ) {
      setActiveSection(sectionId);
    }
  };

  const handleNext = () => {
    const currentIndex = sections.indexOf(activeSection);
    if (
      currentIndex < sections.length - 1 &&
      sectionCompletion[activeSection as keyof typeof sectionCompletion]
        ?.completed
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

  const router = useRouter();

  const handleSubmit = async () => {
    if (
      Object.values(sectionCompletion).every((section) => section.completed)
    ) {
      try {
        const currentUser = await getCurrentUser();
        const userId = currentUser?.userId;

        if (!userId) throw new Error("User is not authenticated");

        const personalInfo = formData["personal-info"] as PersonalInfoData;
        const addressInfo = formData.address as AddressData;
        const emergencyInfo = formData[
          "emergency-contact"
        ] as EmergencyContactData;
        const medicalInfo = formData["medical"] as MedicalData;
        const abilityInfo = formData["ability"] as AbilityData;
        const lifestyleInfo = formData["lifestyle"] as LifestyleData;

        const input = {
          userId,
          userType: "Client",
          profileOwner: userId, // Required for owner authorization
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
          cognitiveDifficulties: Array.isArray(
            abilityInfo.cognitiveDifficulties
          )
            ? abilityInfo.cognitiveDifficulties.join(",")
            : abilityInfo.cognitiveDifficulties,
          sensoryImpairments: Array.isArray(abilityInfo.sensoryImpairments)
            ? abilityInfo.sensoryImpairments.join(",")
            : abilityInfo.sensoryImpairments,
          typicalDay: lifestyleInfo.typicalDay,
          physicalActivity: lifestyleInfo.physicalActivity,
          dietaryPreferences: lifestyleInfo.dietaryPreferences,
          sleepHours: lifestyleInfo.sleepHours,
          hobbies: lifestyleInfo.hobbies,
          socialTime: lifestyleInfo.socialTime,
        };

        const result = await client.models.ClientProfile.create(input);
        console.log("Create result:", result);

        if (result.errors) {
          console.error(
            "Error creating ClientProfile:",
            JSON.stringify(result.errors, null, 2)
          );
          toast.error("Failed to complete profile. Please try again.");
          return;
        }

        console.log("Form data saved:", result.data);
        router.push("/client-dashboard/profile-completed-status"); //  Redirect here
      } catch (error) {
        console.error("Submission error:", error);
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-primary-white">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 my-4">
        {/* <main className="w-full h-full mx-auto px-4 py-10 my-4"> */}
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
                    defaultValues={formData["emergency-contact"]}
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
                      )
                    }
                    className={`px-6 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                      Object.values(sectionCompletion).every(
                        (section) => section.completed
                      )
                        ? "bg-[#CC5034] hover:bg-[#B84529] text-white shadow-md hover:shadow-lg"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Submit Registration
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
    </div>
  );
}
