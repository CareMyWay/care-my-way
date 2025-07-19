import React from "react";
import ProfileTitle from "@/components/provider-profile/profile-title";
import ProfileLanguage from "@/components/provider-profile/profile-lang";
import ProfileAbout from "@/components/provider-profile/profile-about";
import ProfileServices from "@/components/provider-profile/profile-services";
import ProfileEducation from "@/components/provider-profile/profile-educ";
import { type ProviderProfileData } from "@/actions/providerProfileActions";

interface ProfileDetailsProps {
    profileData: ProviderProfileData;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profileData }) => {
    return (
        <div>
            <ProfileTitle profileData={profileData} />
            <ProfileLanguage profileData={profileData} />
            <ProfileAbout profileData={profileData} />
            <ProfileServices profileData={profileData} />
            <ProfileEducation profileData={profileData} />
        </div>
    );
};

export default ProfileDetails;