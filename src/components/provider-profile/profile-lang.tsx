import React from "react";

const ProfileLanguage = () => {
    const languages = [
        { name: "French", proficiency: "Fluent" },
        { name: "English", proficiency: "Conversational" },
        { name: "Urdu", proficiency: "Basic" }
    ];

    return (
        <div>
            <div className="flex flex-col gap-2 my-10">
                <div className="text-h5-size text-dark-green font-semibold mb-2">Languages</div>
                <div className="flex items-center gap-3">
                    {languages.map((language, index) => (
                        <div key={index} className="flex-row text-base text-primary-white bg-medium-green rounded-full px-5 py-1">
                            {language.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileLanguage;