import React from "react";
import { type ProviderProfileData } from "@/actions/providerProfileActions";

interface ProfileLanguageProps {
    profileData: ProviderProfileData;
}

const ProfileLanguage: React.FC<ProfileLanguageProps> = ({ profileData }) => {
    const languages = profileData.languages || [];

    return (
        <div>
            <div className="flex flex-col gap-2 my-10">
                <div className="text-h5-size text-dark-green font-semibold mb-2">Languages</div>
                {languages.length > 0 ? (
                    <div className="flex items-center gap-3 flex-wrap">
                        {languages.map((language, index) => (
                            <div key={index} className="flex-row text-base text-primary-white bg-medium-green rounded-full px-5 py-1">
                                {language}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 italic">No languages specified</div>
                )}
            </div>
        </div>
    );
};

export default ProfileLanguage;