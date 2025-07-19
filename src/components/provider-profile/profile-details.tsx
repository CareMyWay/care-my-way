import React from "react";
import ProfileTitle from "@/components/provider-profile/profile-title";
import ProfileLanguage from "@/components/provider-profile/profile-lang";
import ProfileAbout from "@/components/provider-profile/profile-about";
import ProfileEducation from "@/components/provider-profile/profile-educ";
// import ProfileTestimonials from "@/components/provider-profile/profile-testimonials"; -- Uncomment when testimonials are ready

const ProfileDetails = () => {
    return (
        <div>
            <ProfileTitle />
            <ProfileLanguage />
            <ProfileAbout />
            <ProfileEducation />
            {/* <ProfileTestimonials /> */} {/* Uncomment when testimonials are ready */}
        </div>
    );
};

export default ProfileDetails;