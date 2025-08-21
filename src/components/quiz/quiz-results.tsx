"use client";

import React, { useState } from "react";
import OrangeButton from "@/components/buttons/orange-button";
import HealthcareProviderCard from "@/components/marketplace/healthcare-provider-card";
import { ProcessedResults } from "./quiz-logic";

interface QuizResultsProps {
    results: ProcessedResults;
    onStartOver: () => void;
}

export function QuizResults({ results, onStartOver }: QuizResultsProps) {
    const { services } = results;
    const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});

    // Toggle service list expansion for subcategories
    const toggleServiceList = (subcategoryKey: string) => {
        setExpandedServices(prev => ({
        ...prev,
        [subcategoryKey]: !prev[subcategoryKey]
        }));
    };

    return (
        <div className="min-h-screen bg-primary-white py-6 sm:py-8 lg:py-12 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                    <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-darkest-green mb-4 sm:mb-6">
                    Your Care Assessment Results
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-darkest-green mb-6 sm:mb-8 max-w-full sm:max-w-3xl mx-auto px-2 sm:px-0">
                    Based on your responses, we&apos;ve identified the healthcare services and support that would be most beneficial for your care needs.
                    </p>
                </div>

                {/* Results Content */}
                <div className="mb-8 sm:mb-10 lg:mb-12">
                    {/* Recommended Services */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8 shadow-sm">
                        <h2 className="text-xl sm:text-2xl font-bold text-darkest-green mb-4 sm:mb-6 flex items-center">
                        Recommended Care Services
                        </h2>
                        <p className="text-darkest-green mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                        These personalized recommendations are based on your assessment responses. Each service category includes specific support options tailored to help you maintain independence, health, and quality of life. Click on "Specific Services" to explore detailed options within each category.
                        </p>

                        {services.length > 0 ? (
                            <div className="columns-1 md:columns-2 gap-4 sm:gap-6 space-y-0">
                                {services
                                    .sort((a, b) => {
                                        // Put "Home Care" first, then sort others alphabetically
                                        if (a.category === "Home Care") return -1;
                                        if (b.category === "Home Care") return 1;
                                        return a.category.localeCompare(b.category);
                                    })
                                    .map((category, categoryIndex) => (
                                    <div key={categoryIndex} className="border border-gray-300 rounded-lg p-4 sm:p-6 break-inside-avoid mb-4 sm:mb-6">
                                        {/* Category Header */}
                                        <h3 className="text-lg sm:text-xl font-bold text-darkest-green mb-3 sm:mb-4 border-b border-gray-200 pb-2">
                                        {category.category}
                                        </h3>

                                        {/* Category Services */}
                                        <div className="space-y-3 sm:space-y-4">
                                            {category.subcategories.map((subcategory, subIndex) => {
                                                const subcategoryKey = `${categoryIndex}-${subIndex}`;
                                                return (
                                                    <div
                                                    key={subIndex}
                                                    className="border-l-4 border-medium-green pl-3 sm:pl-4 py-2 sm:py-3 bg-gray-50 rounded-r-lg"
                                                    >
                                                        <h4 className="font-bold text-darkest-green text-base sm:text-lg mb-2">
                                                        {subcategory.name}
                                                        </h4>
                                                        <p className="text-darkest-green text-base mb-1">
                                                        {subcategory.description}
                                                        </p>
                            
                                                        {/* Collapsible Services List */}
                                                        <div>
                                                            <button
                                                            onClick={() => toggleServiceList(subcategoryKey)}
                                                            className="flex items-center justify-start text-left text-dark-green hover:text-medium-green font-medium transition-colors text-xs sm:text-sm mb-1 min-h-[44px] touch-manipulation"
                                                            >
                                                            <span className={`transform transition-transform mr-2 ${expandedServices[subcategoryKey] ? 'rotate-90' : ''}`}>
                                                            ▶
                                                            </span>
                                                            See More Specific Services Offered ({subcategory.services.length})
                                                            </button>
                            
                                                            {expandedServices[subcategoryKey] && (
                                                                <ul className="space-y-1 ml-4 sm:ml-6">
                                                                    {subcategory.services.map((service, serviceIndex) => (
                                                                        <li key={serviceIndex} className="flex items-start">
                                                                            <span className="w-2 h-2 bg-medium-green rounded-full mr-2 sm:mr-3 mt-2 flex-shrink-0" />
                                                                            <span className="text-darkest-green text-xs sm:text-sm">{service}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-darkest-green">
                            Based on your responses, you appear to be managing well independently.
                            Continue monitoring your health and don&apos;t hesitate to seek support if
                            your needs change.
                            </p>
                        )}
                    </div>
                </div>

                {/* Recommended Providers Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8 shadow-sm mb-8 sm:mb-10 lg:mb-12">
                    <h2 className="text-xl sm:text-2xl font-bold text-darkest-green mb-4 sm:mb-6">
                    Featured Providers
                    </h2>
                    <p className="text-darkest-green mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                    Based on your care needs, here are some qualified healthcare providers in your area who specialize in the services you require.
                    </p>
        
                    <div className="space-y-4 sm:space-y-6">
                        {/* Nurse - Medication Administration */}
                        <HealthcareProviderCard
                        id="nurse-sarah-johnson"
                        name="Sarah Johnson"
                        title="Registered Nurse"
                        location="Downtown Vancouver"
                        experience="8 years of experience"
                        languages={["English", "French"]}
                        services={["Medication Administration", "Wound Care", "Health Monitoring", "Injection Services"]}
                        hourlyRate={45}
                        imageSrc=""
                        />

                        {/* Healthcare Aide - Multiple Services */}
                        <HealthcareProviderCard
                        id="aide-michael-chen"
                        name="Michael Chen"
                        title="Healthcare Aide"
                        location="East Vancouver"
                        experience="5 years of experience"
                        languages={["English", "Mandarin"]}
                        services={["Homemaking", "Mobility Support", "Transfers", "Appointment Outings", "Personal Care"]}
                        hourlyRate={32}
                        imageSrc=""
                        />

                        {/* Physiotherapist */}
                        <HealthcareProviderCard
                        id="physio-emma-rodriguez"
                        name="Emma Rodriguez"
                        title="Physiotherapist"
                        location="West Vancouver"
                        experience="12 years of experience"
                        languages={["English", "Spanish"]}
                        services={["Physical Therapy", "Mobility Assessment", "Exercise Programs", "Pain Management"]}
                        hourlyRate={85}
                        imageSrc=""
                        />
                    </div>
                </div>

                {/* Next Steps Section */}
                <div className="bg-light-green bg-opacity-20 border border-light-green rounded-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-darkest-green mb-3 sm:mb-4">Next Steps</h2>
                    <div className="space-y-2 sm:space-y-3 text-darkest-green">
                        <p className="flex items-start">
                            <span className="w-5 h-5 sm:w-6 sm:h-6 bg-medium-green rounded-full flex items-center justify-center text-white font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0 text-xs sm:text-sm">
                            1
                            </span>
                            <span className="text-sm sm:text-base">
                            Explore our personalized healthcare directory to browse tailored provider recommendations based on your quiz results.
                            </span>
                        </p>
                        <p className="flex items-start">
                            <span className="w-5 h-5 sm:w-6 sm:h-6 bg-medium-green rounded-full flex items-center justify-center text-white font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0 text-xs sm:text-sm">
                            2
                            </span>
                            <span className="text-sm sm:text-base">
                            Adjust or clear filters in the healthcare directory&apos;s filter section to refine your search results.
                            </span>
                        </p>
                        <p className="flex items-start">
                            <span className="w-5 h-5 sm:w-6 sm:h-6 bg-medium-green rounded-full flex items-center justify-center text-white font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0 text-xs sm:text-sm">
                            3
                            </span>
                            <span className="text-sm sm:text-base">
                            Consider starting with the most critical needs first, such as safety or
                            medication management.
                            </span>
                        </p>
                        <p className="flex items-start">
                            <span className="w-5 h-5 sm:w-6 sm:h-6 bg-medium-green rounded-full flex items-center justify-center text-white font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0 text-xs sm:text-sm">
                            4
                            </span>
                            <span className="text-sm sm:text-base">Regularly reassess your needs as they may change over time.</span>
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <OrangeButton onClick={onStartOver} variant="action" className="px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto min-h-[48px] touch-manipulation">
                    Retake Assessment
                    </OrangeButton>
                    <OrangeButton
                    variant="route"
                    href={"/marketplace"}
                    className="px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto min-h-[48px] touch-manipulation">
                    Find a Provider
                    </OrangeButton>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 sm:mt-10 lg:mt-12 text-center">
                    <p className="text-xs sm:text-sm text-gray-600 max-w-full sm:max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
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
