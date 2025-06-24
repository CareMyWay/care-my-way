import React from "react";

const ProfileAbout = () => {
    const aboutText = (
        <span>
            Compassionate and dedicated Health Care Aide with 3+ years of experience providing high-quality care to elderly and disabled individuals. Skilled in assisting with daily living activities, administering medications, and ensuring the physical and emotional well-being of clients. Strong knowledge of infection control protocols and a commitment to fostering a safe and comfortable environment for patients.
        </span>
    );

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
}

export default ProfileAbout;