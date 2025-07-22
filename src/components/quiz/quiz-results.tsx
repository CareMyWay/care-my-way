"use client";

import React from "react";
import OrangeButton from "@/components/buttons/orange-button";
import { ProcessedResults } from "./quiz-logic";


interface QuizResultsProps {
  results: ProcessedResults;
  onStartOver: () => void;
}

// Helper function to categorize services
const categorizeServices = (services: string[]) => {
  const categories = [
    {
      name: "Health & Medical",
      icon: "🩺",
      services: services.filter(s =>
        [
          "Medication Management",
          "Blood Pressure Monitoring",
          "Chronic Disease Management",
          "Post-Surgery Recovery",
          "Diabetes Management",
          "Palliative Care",
          "Mental Health Support"
        ].includes(s)
      )
    },
    {
      name: "Daily Living Support",
      icon: "🏠",
      services: services.filter(s =>
        [
          "Personal Care Assistance",
          "Meal Preparation",
          "Light Housekeeping",
          "Mobility Assistance",
          "Companion Care"
        ].includes(s)
      )
    },
    {
      name: "Safety & Therapy",
      icon: "🛡️",
      services: services.filter(s =>
        [
          "Fall Prevention",
          "Physical Therapy Assistance",
          "Emergency Response",
          "Dementia & Alzheimer's Care",
          "Respite Care",
          "Other Support Services"
        ].includes(s)
      )
    }
  ].filter(category => category.services.length > 0);

  return categories;
};

export function QuizResults({ results, onStartOver }: QuizResultsProps) {
  const { providers, services } = results;

  return (
    <div className="min-h-screen bg-primary-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-darkest-green mb-6">
            Your Care Assessment Results
          </h1>
          <p className="text-lg text-darkest-green mb-8 max-w-3xl mx-auto">
            Based on your responses, we've identified the healthcare professionals and
            services that would be most beneficial for your care needs.
          </p>
        </div>

        {/* Results Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Recommended Providers */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-darkest-green mb-6 flex items-center">
              Recommended Healthcare Professionals
            </h2>

            {providers.length > 0 ? (
              <div className="space-y-4">
                {providers.map((provider, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-medium-green pl-4 py-2"
                  >
                    <h3 className="font-bold text-darkest-green text-lg mb-2">
                      {provider.name}
                    </h3>
                    <p className="text-darkest-green leading-relaxed">
                      {provider.reason}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-darkest-green">
                Based on your responses, you may not need additional professional
                healthcare support at this time. However, it's always good to maintain
                regular contact with your primary healthcare provider.
              </p>
            )}
          </div>

          {/* Recommended Services */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-darkest-green mb-6 flex items-center">
              Recommended Care Services
            </h2>

            {services.length > 0 ? (
              <div className="grid gap-3">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="w-4 h-4 bg-light-green rounded-full mr-3 flex-shrink-0" />
                    <span className="text-darkest-green font-medium">{service}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-darkest-green">
                Based on your responses, you appear to be managing well independently.
                Continue monitoring your health and don't hesitate to seek support if
                your needs change.
              </p>
            )}
          </div>
        </div>

        {/* Service Categories Section */}
        {services.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-12">
            <h2 className="text-2xl font-bold text-darkest-green mb-6 text-center">
              Service Categories Overview
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {categorizeServices(services).map(
                (category, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-light-green rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <h3 className="font-bold text-darkest-green mb-2">
                      {category.name}
                    </h3>
                    <ul className="text-sm text-darkest-green space-y-1">
                      {category.services.map((service, serviceIndex) => (
                        <li key={serviceIndex}>{service}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Next Steps Section */}
        <div className="bg-light-green bg-opacity-20 border border-light-green rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-darkest-green mb-4">Next Steps</h2>
          <div className="space-y-3 text-darkest-green">
            <p className="flex items-start">
              <span className="w-6 h-6 bg-medium-green rounded-full flex items-center justify-center text-white font-bold mr-3 mt-0.5 flex-shrink-0 text-sm">
                1
              </span>
              <span>
                Explore our personalized healthcare directory to browse tailored provider recommendations based on your quiz results.
              </span>
            </p>
            <p className="flex items-start">
              <span className="w-6 h-6 bg-medium-green rounded-full flex items-center justify-center text-white font-bold mr-3 mt-0.5 flex-shrink-0 text-sm">
                2
              </span>
              <span>
                Adjust or clear filters in the marketplace’s filter section to refine your search results.
              </span>
            </p>
            <p className="flex items-start">
              <span className="w-6 h-6 bg-medium-green rounded-full flex items-center justify-center text-white font-bold mr-3 mt-0.5 flex-shrink-0 text-sm">
                3
              </span>
              <span>
                Consider starting with the most critical needs first, such as safety or
                medication management.
              </span>
            </p>
            <p className="flex items-start">
              <span className="w-6 h-6 bg-medium-green rounded-full flex items-center justify-center text-white font-bold mr-3 mt-0.5 flex-shrink-0 text-sm">
                4
              </span>
              <span>Regularly reassess your needs as they may change over time.</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <OrangeButton onClick={onStartOver} variant="action" className="px-8 py-3">
            Retake Assessment
          </OrangeButton>
          <OrangeButton
            onClick={() => to('/marketplace')}
            variant="action"
            className="px-8 py-3">
            Find a Provider
          </OrangeButton>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 max-w-4xl mx-auto leading-relaxed">
            <strong>Disclaimer:</strong> This assessment provides general recommendations
            based on your responses and should not replace professional medical advice.
            Please consult with qualified healthcare professionals for personalized care
            planning and medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default QuizResults;
