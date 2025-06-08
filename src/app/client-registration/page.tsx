"use client";

import { useState, useEffect } from "react";
import { PersonalInfoSection } from "@/components/user-registration/personal-info-section";
import { AddressSection } from "@/components/user-registration/address-section";
import { EmergencyContactSection } from "@/components/user-registration/emergency-contact-section";
import { RegistrationNavSideBar } from "@/components/navbars/registration-nav-sidebar";
import NavBar from "@/components/navbars/navbar";
export default function ClientRegistration() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
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

  // Form validation functions
  const validatePersonalInfo = (data: any) => {
    const required = [
      "firstName",
      "lastName",
      "gender",
      "dob",
      "email",
      "phone",
    ];
    const filled = required.filter(
      (field) => data[field] && data[field].trim() !== ""
    );
    return {
      progress: (filled.length / required.length) * 100,
      completed: filled.length === required.length,
    };
  };

  const validateAddress = (data: any) => {
    const required = ["address", "city", "country", "postalCode"];
    const filled = required.filter(
      (field) => data[field] && data[field].trim() !== ""
    );
    return {
      progress: (filled.length / required.length) * 100,
      completed: filled.length === required.length,
    };
  };

  const validateEmergencyContact = (data: any) => {
    const required = [
      "contactName",
      "relationship",
      "contactPhone",
      "supportPerson",
    ];
    const filled = required.filter(
      (field) => data[field] && data[field].trim() !== ""
    );
    return {
      progress: (filled.length / required.length) * 100,
      completed: filled.length === required.length,
    };
  };

  const updateFormData = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], ...data },
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
    const currentIndex = sections.indexOf(activeSection);
    const targetIndex = sections.indexOf(sectionId);

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

  const handleSubmit = () => {
    if (
      Object.values(sectionCompletion).every((section) => section.completed)
    ) {
      alert("Registration submitted successfully!");
      console.log("Form data:", formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Compact Header */}
      <NavBar />
      {/* <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 relative">
                <svg viewBox="0 0 40 40" className="h-8 w-8">
                  <path
                    d="M20 5C11.729 5 5 11.729 5 20C5 28.271 11.729 35 20 35C28.271 35 35 28.271 35 20C35 11.729 28.271 5 20 5Z"
                    fill="#4A9B9B"
                  />
                  <path
                    d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10Z"
                    fill="white"
                  />
                  <path
                    d="M15 17.5C15 16.119 16.119 15 17.5 15C18.881 15 20 16.119 20 17.5C20 18.881 18.881 20 17.5 20C16.119 20 15 18.881 15 17.5Z"
                    fill="#CC5034"
                  />
                  <path
                    d="M20 20C21.381 20 22.5 21.119 22.5 22.5C22.5 23.881 21.381 25 20 25C18.619 25 17.5 23.881 17.5 22.5C17.5 21.119 18.619 20 20 20Z"
                    fill="#CC5034"
                  />
                  <path
                    d="M25 17.5C25 16.119 23.881 15 22.5 15C21.119 15 20 16.119 20 17.5C20 18.881 21.119 20 22.5 20C23.881 20 25 18.881 25 17.5Z"
                    fill="#CC5034"
                  />
                </svg>
              </div>
              <div className="ml-2">
                <h1 className="text-lg font-bold text-gray-900">Care My Way</h1>
                <p className="text-xs text-gray-600">Patient Registration</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600">Need help?</div>
              <div className="text-xs font-medium text-[#4A9B9B]">
                1-800-CARE-WAY
              </div>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[calc(100vh-140px)]">
          {/* Sidebar - hidden on mobile, visible on md+ */}
          <div className="hidden md:block md:col-span-3">
            <RegistrationNavSideBar
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
                <RegistrationNavSideBar
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
                  />
                )}

                {activeSection === "address" && (
                  <AddressSection
                    onDataChange={(data) => updateFormData("address", data)}
                    isCompleted={sectionCompletion.address.completed}
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
    </div>
  );
}
