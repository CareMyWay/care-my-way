"use client";

import { useState, useEffect } from "react";
// import Link from "next/link";
import { PersonalInfoSection } from "@/components/client-profile-forms/personal-info-section";
import { AddressSection } from "@/components/client-profile-forms/address-section";
import { EmergencyContactSection } from "@/components/client-profile-forms/emergency-contact-section";
import { ClientProfileNavSideBar } from "@/components/nav-bars/client-profile-nav-sidebar";
import { getCurrentUser } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";

import toast from "react-hot-toast";

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

export default function CompleteClientProfile() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  // const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState("personal-info");
  const [formData, setFormData] = useState({
    "personal-info": {},
    address: {},
    "emergency-contact": {},
  });
  const [sectionCompletion, setSectionCompletion] = useState({
    "personal-info": { completed: false, progress: 0 },
    address: { completed: false, progress: 0 },
    "emergency-contact": { completed: false, progress: 0 },
  });

  const sections = ["personal-info", "address", "emergency-contact"];

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

  type SectionKey = "personal-info" | "address" | "emergency-contact";
  type SectionData = PersonalInfoData | AddressData | EmergencyContactData;

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

    setSectionCompletion({
      "personal-info": personalValidation,
      address: addressValidation,
      "emergency-contact": emergencyValidation,
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

        const input = {
          userId,
          userType: "Client",
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
        };

        const result = await client.models.ClientProfile.create(input);

        if (result.errors) {
          console.error("Error creating ClientProfile:", result.errors);
          toast.error("Failed to complete profile. Please try again.");
          return;
        }

        console.log("Form data saved:", result.data);
        router.push("/client-dashboard/profile-completed"); //  Redirect here
      } catch (error) {
        console.error("Submission error:", error);
        toast.error("Something went wrong!");
      }
    }
  };

  // const handleSubmit = () => {
  //   if (
  //     Object.values(sectionCompletion).every((section) => section.completed)
  //   ) {
  //     setSubmitSuccess(true);
  //     setSubmitSuccess(true);

  //     toast.success("Profile completed successfully!", {
  //       duration: 4000,
  //     });
  //     // alert("Registration submitted successfully!");
  //     console.log("Form data:", formData);
  //   }
  // };

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

                {activeSection === "emergency-contact" ? (
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
      {/* {submitSuccess && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white border border-green-300 text-green-800 px-6 py-4 rounded-lg shadow-md flex flex-col items-center gap-2 z-50">
          <p className="font-semibold">🎉 Your profile has been completed!</p>
          <Link
            href="/client/dashboard"
            className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition"
          >
            View your Profile
          </Link>
        </div>
      )} */}
    </div>
  );
}
