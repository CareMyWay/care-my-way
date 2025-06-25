import React from "react";

const ProfileEducation = () => {
    const education = [
        { certification: "Health Care Aide Certificate", institution: "Bow Valley College", year: "2021" },
        { certification: "Standard First Aid & CPR Level C", institution: "Canadian Red Cross", year: "2021" },
        { certification: "Registered with the Alberta Health Care Aide Directory", institution: "", year: "" }
    ];

    return (
        <div className="flex flex-col gap-2 my-10">
            <div className="text-h5-size text-dark-green font-semibold mb-2">Education & Certifications</div>
            <div className="flex flex-col gap-3">
                {education.map((edu, index) => (
                    <div key={index} className="text-[16px] md:text-body4-size text-darkest-green py-3">
                        <div className="flex flex-row justify-between">
                            <span>{edu.certification}</span>
                            {edu.year && (
                            <span className=" text-darkest-green"> ({edu.year})</span>
                            )}
                        </div>
                        <div>{edu.institution}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileEducation;