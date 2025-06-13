import React from "react";

const ProfileTitle = () => {

    const title = (
        <span className="text-h5-size md:text-h4-size text-dark-green font-semibold">
            Experienced and compassionate caregiver offering personalized support for all ages.
        </span>
    );

    return (
        <div>
            <div className="">
                {title}
            </div>
        </div>
    )
}

export default ProfileTitle;