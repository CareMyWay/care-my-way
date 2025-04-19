import React from "react";

export default function RegistrationLayout({
  children,
  step,
}: {
  children: React.ReactNode;
  step: number;
}) {
  return (
    <div className="min-h-screen bg-primary-white flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Stepper */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((s, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full border-2 border-medium-green flex items-center justify-center text-sm font-semibold ${
                  s === step
                    ? "bg-medium-green text-primary-white"
                    : "text-medium-green border-[#B6DFD4]"
                }`}
              >
                {s}
              </div>
              {index !== 2 && <div className="w-6 h-px bg-[#B6DFD4]" />}
            </div>
          ))}
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-6">Create your Account</h2>

      {/* Form box */}
      <div className="border border-[#B5BAC0] rounded-md p-8 py-12 shadow-md bg-primary-white w-full max-w-xl">
        {children}
      </div>
    </div>
  );
}
