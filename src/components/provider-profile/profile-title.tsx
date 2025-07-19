import React from "react";
import { type ProviderProfileData } from "@/actions/providerProfileActions";

interface ProfileTitleProps {
    profileData: ProviderProfileData;
}

const ProfileTitle: React.FC<ProfileTitleProps> = ({ profileData }) => {
    const title = profileData.profileTitle || "Healthcare Provider";

    return (
        <div>
            <div className="">
                <span className="text-h5-size md:text-h4-size text-dark-green font-semibold">
                    {title}
                </span>
            </div>
        </div>
    );
};

export default ProfileTitle;