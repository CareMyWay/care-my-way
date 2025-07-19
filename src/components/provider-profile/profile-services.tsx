import React from "react";
import { type ProviderProfileData } from "@/actions/providerProfileActions";

interface ProfileServicesProps {
    profileData: ProviderProfileData;
}

const ProfileServices: React.FC<ProfileServicesProps> = ({ profileData }) => {
    const services = profileData.servicesOffered || [];

    // Helper function to get icon for service types
    const getServiceIcon = (service: string) => {
        const serviceLower = service.toLowerCase();

        if (serviceLower.includes("medication") || serviceLower.includes("medicine")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            );
        }

        if (serviceLower.includes("personal") || serviceLower.includes("hygiene") || serviceLower.includes("bathing")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            );
        }

        if (serviceLower.includes("mobility") || serviceLower.includes("exercise") || serviceLower.includes("physical")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            );
        }

        if (serviceLower.includes("companionship") || serviceLower.includes("social") || serviceLower.includes("emotional")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            );
        }

        if (serviceLower.includes("meal") || serviceLower.includes("nutrition") || serviceLower.includes("cooking")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
            );
        }

        if (serviceLower.includes("housekeeping") || serviceLower.includes("cleaning") || serviceLower.includes("laundry")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 11h8" />
                </svg>
            );
        }

        if (serviceLower.includes("health") || serviceLower.includes("monitoring") || serviceLower.includes("vital")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            );
        }

        // Default healthcare icon
        return (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        );
    };

    return (
        <div className="flex flex-col gap-2 my-10">
            <div className="text-h5-size text-dark-green font-semibold mb-6">Services Offered</div>
            {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-[#4A9B9B] hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                            {/* Service Icon */}
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#4A9B9B] to-[#5CAB9B] rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-200">
                                {getServiceIcon(service)}
                            </div>

                            {/* Service Name */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-base font-medium text-darkest-green leading-tight group-hover:text-[#4A9B9B] transition-colors duration-200">
                                    {service}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No services specified</p>
                    <p className="text-gray-400 text-sm mt-1">Services will be displayed here when added</p>
                </div>
            )}
        </div>
    );
};

export default ProfileServices; 