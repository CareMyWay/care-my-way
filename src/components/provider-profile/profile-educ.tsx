import React from "react";
import { type ProviderProfileData } from "@/actions/providerProfileActions";

interface ProfileEducationProps {
    profileData: ProviderProfileData;
}

interface EducationEntry {
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    graduationYear?: string;
}

interface CertificationEntry {
    certificationName?: string;
    issuingOrganization?: string;
    issueDate?: string;
    expiryDate?: string;
    licenseNumber?: string;
}

interface WorkExperienceEntry {
    employer?: string;
    jobTitle?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

const ProfileEducation: React.FC<ProfileEducationProps> = ({ profileData }) => {
    const education = (profileData.education as EducationEntry[]) || [];
    const certifications = (profileData.certifications as CertificationEntry[]) || [];
    const workExperience = (profileData.workExperience as WorkExperienceEntry[]) || [];

    const hasAnyCredentials = education.length > 0 || certifications.length > 0 || workExperience.length > 0;

    if (!hasAnyCredentials) {
        return (
            <div className="flex flex-col gap-2 my-10">
                <div className="text-h5-size text-dark-green font-semibold mb-2">Experience & Credentials</div>
                <div className="text-gray-500 italic">No experience or credentials information provided.</div>
            </div>
        );
    }

    // Helper function to format date
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    return (
        <div className="flex flex-col gap-8 my-10">

            {/* Work Experience Section */}
            {workExperience.length > 0 && (
                <div>
                    <div className="text-h5-size text-dark-green font-semibold mb-6">Experience</div>
                    <div className="space-y-6">
                        {workExperience.map((work, index) => (
                            <div key={index} className="flex gap-4 pb-6 border-b border-gray-100 last:border-b-0">
                                {/* Company Icon/Logo Placeholder */}
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#4A9B9B] to-[#5CAB9B] rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>

                                {/* Work Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-semibold text-darkest-green leading-tight">
                                                {work.jobTitle || "Position"}
                                            </h3>
                                            <p className="text-base text-medium-green font-medium">
                                                {work.employer || "Company"}
                                            </p>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1 sm:mt-0">
                                            {work.startDate && (
                                                <span>
                                                    {formatDate(work.startDate)} - {work.endDate ? formatDate(work.endDate) : 'Present'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {work.description && (
                                        <div className="text-sm text-gray-700 leading-relaxed mt-3">
                                            {work.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education Section */}
            {education.length > 0 && (
                <div>
                    <div className="text-h5-size text-dark-green font-semibold mb-6">Education</div>
                    <div className="space-y-6">
                        {education.map((edu, index) => (
                            <div key={index} className="flex gap-4 pb-6 border-b border-gray-100 last:border-b-0">
                                {/* Education Icon */}
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    </svg>
                                </div>

                                {/* Education Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-semibold text-darkest-green leading-tight">
                                                {edu.institution || "Institution"}
                                            </h3>
                                            <p className="text-base text-medium-green font-medium">
                                                {edu.degree || "Degree"}
                                            </p>
                                            {edu.fieldOfStudy && (
                                                <p className="text-sm text-gray-600">
                                                    {edu.fieldOfStudy}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1 sm:mt-0">
                                            {edu.graduationYear && (
                                                <span>{edu.graduationYear}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications Section */}
            {certifications.length > 0 && (
                <div>
                    <div className="text-h5-size text-dark-green font-semibold mb-6">Licenses & Certifications</div>
                    <div className="space-y-6">
                        {certifications.map((cert, index) => (
                            <div key={index} className="flex gap-4 pb-6 border-b border-gray-100 last:border-b-0">
                                {/* Certification Icon */}
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>

                                {/* Certification Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-semibold text-darkest-green leading-tight">
                                                {cert.certificationName || "Certification"}
                                            </h3>
                                            <p className="text-base text-medium-green font-medium">
                                                {cert.issuingOrganization || "Issuing Organization"}
                                            </p>
                                            {cert.licenseNumber && (
                                                <p className="text-sm text-gray-600">
                                                    License: {cert.licenseNumber}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1 sm:mt-0">
                                            {cert.issueDate && (
                                                <div>
                                                    <div>Issued {formatDate(cert.issueDate)}</div>
                                                    {cert.expiryDate && (
                                                        <div>Expires {formatDate(cert.expiryDate)}</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileEducation;