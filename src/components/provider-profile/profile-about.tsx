import React from "react";
import { type ProviderProfileData } from "@/actions/providerProfileActions";

interface ProfileAboutProps {
    profileData: ProviderProfileData;
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({ profileData }) => {
    const aboutText = profileData.bio || "No bio available.";

    return (
        <div className="flex flex-col gap-3 my-10">
            <div className="text-h5-size text-dark-green font-semibold">
                About
            </div>
            <div className="text-[16px] md:text-body4-size text-darkest-green">
                {aboutText}
            </div>
        </div>
    );
};

export default ProfileAbout;