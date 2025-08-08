import React, { useState, useEffect } from "react";
import { type ProviderProfileData } from "@/actions/providerProfileActions";
import { getFileUrl } from "@/utils/s3-upload";

interface ProfileEducationProps {
    profileData: ProviderProfileData;
}

interface EducationEntry {
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    graduationYear?: string;
    documents?: string[];
}

interface CertificationEntry {
    certificationName?: string;
    issuingOrganization?: string;
    issueDate?: string;
    expiryDate?: string;
    licenseNumber?: string;
    documents?: string[];
}

interface WorkExperienceEntry {
    employer?: string;
    jobTitle?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    documents?: string[];
}

// Document display component
const DocumentList: React.FC<{ documents: string[] }> = ({ documents }) => {
    const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadDocuments = async () => {
            const urlPromises = documents.map(async (s3Key) => {
                try {
                    const url = await getFileUrl(s3Key, 3600); // 1 hour expiry
                    return { s3Key, url };
                } catch (error) {
                    console.error("Error loading document:", error);
                    return { s3Key, url: null };
                }
            });

            const results = await Promise.all(urlPromises);
            const urlMap = results.reduce((acc, { s3Key, url }) => {
                if (url) acc[s3Key] = url;
                return acc;
            }, {} as Record<string, string>);

            setDocumentUrls(urlMap);
        };

        if (documents.length > 0) {
            loadDocuments();
        }
    }, [documents]);

    const getFileType = (s3Key: string): "image" | "pdf" | "document" => {
        const extension = s3Key.split(".").pop()?.toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(extension || "")) {
            return "image";
        }
        if (extension === "pdf") {
            return "pdf";
        }
        return "document";
    };

    const getFileName = (s3Key: string): string => {
        return s3Key.split("/").pop()?.split("-").slice(1).join("-") || s3Key;
    };

    const FilePreview: React.FC<{ s3Key: string; url: string }> = ({ s3Key, url }) => {
        const fileType = getFileType(s3Key);
        const fileName = getFileName(s3Key);

        if (fileType === "image") {
            return (
                <img
                    src={url}
                    alt={fileName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        console.log("Image failed to load:", url);
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />
            );
        }

        if (fileType === "pdf") {
            return (
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z" />
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.663 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z" />
                </svg>
            );
        }

        return (
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        );
    };

    if (documents.length === 0) {
        return null;
    }

    return (
        <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {documents.map((s3Key) => {
                    const url = documentUrls[s3Key];
                    const fileName = getFileName(s3Key);

                    return (
                        <div key={s3Key} className="group relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-square flex items-center justify-center p-2">
                                {url ? (
                                    <FilePreview s3Key={s3Key} url={url} />
                                ) : (
                                    <div className="animate-pulse bg-gray-200 w-8 h-8 rounded"></div>
                                )}
                            </div>

                            {/* Action buttons on hover */}
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                {url && (
                                    <>
                                        <button
                                            onClick={() => window.open(url, "_blank")}
                                            className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full shadow-sm"
                                            title="View"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        <a
                                            href={url}
                                            download={fileName}
                                            className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-full shadow-sm"
                                            title="Download"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

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
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
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
                                                    {formatDate(work.startDate)} - {work.endDate ? formatDate(work.endDate) : "Present"}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {work.description && (
                                        <div className="text-sm text-gray-700 leading-relaxed mt-3">
                                            {work.description}
                                        </div>
                                    )}

                                    {/* Work Experience Documents */}
                                    {work.documents && work.documents.length > 0 && (
                                        <DocumentList documents={work.documents} />
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

                                    {/* Education Documents */}
                                    {edu.documents && edu.documents.length > 0 && (
                                        <DocumentList documents={edu.documents} />
                                    )}
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

                                    {/* Certification Documents */}
                                    {cert.documents && cert.documents.length > 0 && (
                                        <DocumentList documents={cert.documents} />
                                    )}
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