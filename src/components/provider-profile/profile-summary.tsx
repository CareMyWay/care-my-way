"use client";

import React, { useState } from "react";
import Image from "next/image";
import OrangeButton from "../buttons/orange-button";
import { type ProviderProfileData } from "@/actions/providerProfileActions";
import BookingModal from "../booking-modal";

interface ProfileSummaryProps {
    profileData: ProviderProfileData;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ profileData }) => {
    // Helper function to get initials
    const getInitials = (firstName?: string, lastName?: string) => {
        if (!firstName && !lastName) return "P";
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
    };

    // Helper function to format location
    const getLocation = () => {
        const parts = [profileData.city, profileData.province].filter(Boolean);
        return parts.length > 0 ? parts.join(", ") : "Location not specified";
    };

    const providerName = [profileData.firstName, profileData.lastName].filter(Boolean).join(" ") || "Unknown Provider";
    const providerTitle = profileData.profileTitle || "Healthcare Provider";
    const location = getLocation();

    const infoRows = [
        { label: "Working Experience", value: profileData.yearsExperience || "Not specified" },
        { label: "Starting Rate", value: profileData.askingRate ? `$${profileData.askingRate}/hour` : "Rate on request" },
        { label: "Response Time", value: profileData.responseTime || "Not specified" },
    ];

    return (
        <div className="flex flex-col items-center border-solid border-1 rounded-md border-input-border-gray pb-7 w-full md:w-[320px] xl:w-[400px]">
            <div className="flex flex-col items-left w-[360px] p-7">
                <div className="md:w-[220] xl:w-[320px] md:h-[220px] xl:h-[320px] mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                    {profileData.profilePhoto ? (
                        <Image
                            src={profileData.profilePhoto}
                            alt={`${providerName}'s profile photo`}
                            width={320}
                            height={320}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#4A9B9B] via-[#5CAB9B] to-[#6CBB9B] flex items-center justify-center rounded-lg">
                            <span className="text-white text-6xl font-bold">
                                {getInitials(profileData.firstName, profileData.lastName)}
                            </span>
                        </div>
                    )}
                </div>
                <span className="text-h5-size xl:text-h4-size font-semibold text-darkest-green mt-5 md:mt-10 md:px-7 xl:px-0">{providerName.toUpperCase()}</span>
                <div className="flex md:px-7 xl:px-0">
                    <span className="text-body5-size xl:text-body3-size text-darkest-green">
                        {providerTitle} | {location}
                    </span>
                </div>
                <div className="flex flex-col gap-4 md:px-7 xl:px-0">
                    {infoRows.map((row, idx) => (
                        <div
                            key={row.label}
                            className={`flex justify-between w-full${idx === 0 ? " mt-5" : ""}`}
                        >
                            <span className="text-[12px] xl:text-body5-size text-darkest-green my-auto">
                                {row.label}
                            </span>
                            <span className="text-[14px] xl:text-body4-size text-darkest-green font-semibold my-auto">
                                {row.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-5">
                <OrangeButton variant="route" href="/provider" className="w-full"> {/*href is a placeholder link, replace with booking link */}
                    REQUEST TO BOOK
                </OrangeButton>
            </div>
        </div>
    );
};

export default ProfileSummary;