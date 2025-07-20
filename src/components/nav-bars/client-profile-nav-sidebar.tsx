"use client";

interface ClientProfileNavSideBarProps {
  activeSection: string;
  // eslint-disable-next-line no-unused-vars
  onSectionClick: (sectionId: string) => void;
  sectionCompletion: Record<string, { completed: boolean; progress: number }>;
}

export function ClientProfileNavSideBar({
  activeSection,
  onSectionClick,
  sectionCompletion,
}: ClientProfileNavSideBarProps) {
  const sections = [
    {
      id: "personal-info",
      title: "Personal Information",
      subtitle: "Basic details",
      step: 1,
    },
    {
      id: "address",
      title: "Address Information",
      subtitle: "Residential address",
      step: 2,
    },
    {
      id: "emergency-contact",
      title: "Emergency Contact",
      subtitle: "Contact details",
      step: 3,
    },
    {
      id: "medical",
      title: "Medical Information",
      subtitle: "Medical history",
      step: 4,
    },
    {
      id: "abilities",
      title: "Functional and Cognitive Abilities",
      subtitle: "Ability details",
      step: 5,
    },
    {
      id: "lifestyle",
      title: "Lifestyle Information",
      subtitle: "Lifestyle habits",
      step: 5,
    },
  ];

  const getStepStatus = (sectionId: string) => {
    const isCompleted = sectionCompletion[sectionId]?.completed;
    const isActive = activeSection === sectionId;

    if (isCompleted) {
      return "completed";
    } else if (isActive) {
      return "active";
    } else {
      return "pending";
    }
  };

  const canNavigateToSection = (sectionId: string) => {
    return (
      sectionCompletion[sectionId]?.completed || sectionId === activeSection
    );
  };

  return (
    <div className="h-full bg-white rounded-lg border  overflow-hidden">
      {/* Compact Navigation Steps */}
      <div className="p-3 space-y-2">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const status = getStepStatus(section.id);
          const progress = sectionCompletion[section.id]?.progress || 0;
          const canNavigate = canNavigateToSection(section.id);

          return (
            <div key={section.id}>
              <div
                className={`relative p-3 rounded-md border transition-all duration-300 ${
                  isActive
                    ? "bg-[#4A9B9B] border-[#4A9B9B] text-white shadow-md"
                    : status === "completed"
                      ? "bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer"
                      : "bg-gray-50 border-gray-200"
                } ${canNavigate ? "cursor-pointer" : "cursor-default"}`}
                onClick={() => canNavigate && onSectionClick(section.id)}
              >
                <div className="flex items-center gap-3">
                  {/* Compact Step Indicator */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border font-bold text-sm transition-all duration-300 ${
                        status === "completed"
                          ? "border-green-500 bg-green-500 text-white"
                          : isActive
                            ? "border-white bg-white text-[#4A9B9B]"
                            : "border-[#4A9B9B] bg-white text-[#4A9B9B]"
                      }`}
                    >
                      {status === "completed" ? (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        section.step
                      )}
                    </div>
                  </div>

                  {/* Compact Section Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-sm mb-1 ${
                        isActive
                          ? "text-white"
                          : status === "completed"
                            ? "text-green-700"
                            : "text-gray-800"
                      }`}
                    >
                      {section.title}
                    </h3>

                    <p
                      className={`text-xs ${
                        isActive
                          ? "text-white/80"
                          : status === "completed"
                            ? "text-green-600"
                            : "text-gray-600"
                      }`}
                    >
                      {section.subtitle}
                    </p>

                    {status === "active" && progress > 0 && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-white/90">
                            {Math.round(progress)}% filled
                          </span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-1">
                          <div
                            className="bg-white h-1 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation Arrow for completed sections */}
                  {status === "completed" && !isActive && (
                    <div className="flex-shrink-0 text-green-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Compact Connector Line */}
              {section.step < sections.length && (
                <div className="flex justify-center py-1">
                  <div
                    className={`w-0.5 h-3 rounded-full ${status === "completed" ? "bg-green-400" : "bg-gray-200"}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Compact Help Section */}
      <div className="p-3 border-t bg-blue-50">
        <div className="text-center">
          {/* <div className="text-xs font-medium text-blue-800 mb-1">
            Need Help?
          </div> */}
          <div className="text-md text-blue-600">
            Complete each section before continuing on to the next section.
          </div>
        </div>
      </div>
    </div>
  );
}
