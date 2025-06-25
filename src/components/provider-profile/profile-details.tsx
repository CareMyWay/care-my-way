import React from "react";
import ProfileTitle from "@/components/provider-profile/profile-title";
import ProfileLanguage from "@/components/provider-profile/profile-lang";
import ProfileAbout from "@/components/provider-profile/profile-about";
import ProfileEducation from "@/components/provider-profile/profile-educ";
import ProfileTestimonials from "@/components/provider-profile/profile-testimonials";

const ProfileDetails = () => {
    return (
        <div>
            <ProfileTitle />
            <ProfileLanguage />
            <ProfileAbout />
            <ProfileEducation />
            <ProfileTestimonials />
        </div>
    );
};

export default ProfileDetails;