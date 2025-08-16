"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2, Upload, Download, ExternalLink, Loader2, X } from "lucide-react";
import { type ProviderProfileData } from "@/actions/providerProfileActions";
import { uploadCredentialsDocument, deleteFile, getFileUrl } from "@/utils/s3-upload";
import { getCurrentUser } from "aws-amplify/auth";
import toast from "react-hot-toast";

interface EditCredentialsInfoProps {
    profileData: Partial<ProviderProfileData>;
    // eslint-disable-next-line no-unused-vars
    onUpdate: (updates: Partial<ProviderProfileData>) => void;
}

// Types for credential entries (matching what's expected in the profile data)
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

// Graduation year options (last 50 years)
const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

export function EditCredentialsInfo({ profileData, onUpdate }: EditCredentialsInfoProps) {
    // Upload states for each entry type and index
    const [uploadingStates, setUploadingStates] = useState<{ [key: string]: boolean }>({});

    // Document URLs for display (S3 signed URLs)
    const [documentUrls, setDocumentUrls] = useState<{
        [key: string]: { key: string; url: string; name: string; fileType: string }[]
    }>({});

    // Helper function to get document display info
    const getFileType = (fileName: string): string => {
        const extension = fileName.split(".").pop()?.toLowerCase() || "";
        if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(extension)) return "image";
        if (["pdf"].includes(extension)) return "pdf";
        return "document";
    };

    const extractFileNameFromS3Key = (s3Key: string): string => {
        const parts = s3Key.split("/");
        const fullFileName = parts[parts.length - 1];
        // Remove timestamp prefix (format: timestamp-filename)
        const match = fullFileName.match(/^\d+-(.+)$/);
        return match ? match[1] : fullFileName;
    };

    // Load existing documents when component mounts or data changes
    useEffect(() => {
        const loadDocuments = async () => {
            const newDocumentUrls: typeof documentUrls = {};

            // Load education documents
            if (profileData.education) {
                for (let i = 0; i < profileData.education.length; i++) {
                    const edu = profileData.education[i] as EducationEntry;
                    if (edu.documents && edu.documents.length > 0) {
                        const key = `education-${i}`;
                        try {
                            const urlPromises = edu.documents.map(async (s3Key) => {
                                const url = await getFileUrl(s3Key, 3600);
                                const name = extractFileNameFromS3Key(s3Key);
                                const fileType = getFileType(name);
                                return { key: s3Key, url: url || "", name, fileType };
                            });
                            const results = await Promise.all(urlPromises);
                            newDocumentUrls[key] = results.filter(result => result.url);
                        } catch (error) {
                            console.error(`Error loading education documents for index ${i}:`, error);
                        }
                    }
                }
            }

            // Load certification documents
            if (profileData.certifications) {
                for (let i = 0; i < profileData.certifications.length; i++) {
                    const cert = profileData.certifications[i] as CertificationEntry;
                    if (cert.documents && cert.documents.length > 0) {
                        const key = `certification-${i}`;
                        try {
                            const urlPromises = cert.documents.map(async (s3Key) => {
                                const url = await getFileUrl(s3Key, 3600);
                                const name = extractFileNameFromS3Key(s3Key);
                                const fileType = getFileType(name);
                                return { key: s3Key, url: url || "", name, fileType };
                            });
                            const results = await Promise.all(urlPromises);
                            newDocumentUrls[key] = results.filter(result => result.url);
                        } catch (error) {
                            console.error(`Error loading certification documents for index ${i}:`, error);
                        }
                    }
                }
            }

            // Load work experience documents
            if (profileData.workExperience) {
                for (let i = 0; i < profileData.workExperience.length; i++) {
                    const work = profileData.workExperience[i] as WorkExperienceEntry;
                    if (work.documents && work.documents.length > 0) {
                        const key = `workExperience-${i}`;
                        try {
                            const urlPromises = work.documents.map(async (s3Key) => {
                                const url = await getFileUrl(s3Key, 3600);
                                const name = extractFileNameFromS3Key(s3Key);
                                const fileType = getFileType(name);
                                return { key: s3Key, url: url || "", name, fileType };
                            });
                            const results = await Promise.all(urlPromises);
                            newDocumentUrls[key] = results.filter(result => result.url);
                        } catch (error) {
                            console.error(`Error loading work experience documents for index ${i}:`, error);
                        }
                    }
                }
            }

            setDocumentUrls(newDocumentUrls);
        };

        loadDocuments();
    }, [profileData.education, profileData.certifications, profileData.workExperience]);

    // Education functions
    const addEducation = () => {
        const newEducation: EducationEntry = {
            institution: "",
            degree: "",
            fieldOfStudy: "",
            graduationYear: "",
            documents: []
        };
        const updatedEducation = [...(profileData.education || []), newEducation] as Record<string, unknown>[];
        onUpdate({ education: updatedEducation });
    };

    const updateEducation = (index: number, updates: Partial<EducationEntry>) => {
        const updatedEducation = [...(profileData.education || [])];
        updatedEducation[index] = { ...updatedEducation[index], ...updates };
        onUpdate({ education: updatedEducation });
    };

    const removeEducation = (index: number) => {
        const updatedEducation = profileData.education?.filter((_, i) => i !== index) || [];
        onUpdate({ education: updatedEducation });
    };

    // Certification functions
    const addCertification = () => {
        const newCertification: CertificationEntry = {
            certificationName: "",
            issuingOrganization: "",
            issueDate: "",
            expiryDate: "",
            licenseNumber: "",
            documents: []
        };
        const updatedCertifications = [...(profileData.certifications || []), newCertification] as Record<string, unknown>[];
        onUpdate({ certifications: updatedCertifications });
    };

    const updateCertification = (index: number, updates: Partial<CertificationEntry>) => {
        const updatedCertifications = [...(profileData.certifications || [])];
        updatedCertifications[index] = { ...updatedCertifications[index], ...updates };
        onUpdate({ certifications: updatedCertifications });
    };

    const removeCertification = (index: number) => {
        const updatedCertifications = profileData.certifications?.filter((_, i) => i !== index) || [];
        onUpdate({ certifications: updatedCertifications });
    };

    // Work Experience functions
    const addWorkExperience = () => {
        const newWorkExperience: WorkExperienceEntry = {
            employer: "",
            jobTitle: "",
            startDate: "",
            endDate: "",
            description: "",
            documents: []
        };
        const updatedWorkExperience = [...(profileData.workExperience || []), newWorkExperience] as Record<string, unknown>[];
        onUpdate({ workExperience: updatedWorkExperience });
    };

    const updateWorkExperience = (index: number, updates: Partial<WorkExperienceEntry>) => {
        const updatedWorkExperience = [...(profileData.workExperience || [])];
        updatedWorkExperience[index] = { ...updatedWorkExperience[index], ...updates };
        onUpdate({ workExperience: updatedWorkExperience });
    };

    const removeWorkExperience = (index: number) => {
        const updatedWorkExperience = profileData.workExperience?.filter((_, i) => i !== index) || [];
        onUpdate({ workExperience: updatedWorkExperience });
    };

    // Handle file upload for education entries
    const handleEducationFileUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const uploadKey = `education-${index}`;
        setUploadingStates(prev => ({ ...prev, [uploadKey]: true }));

        try {
            const user = await getCurrentUser();
            if (!user?.userId) {
                toast.error("User not found");
                return;
            }

            const uploadPromises = Array.from(files).map(async (file) => {
                // Validate file
                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                    toast.error(`File ${file.name} is too large (max 10MB)`);
                    return null;
                }

                const result = await uploadCredentialsDocument(file, "education");
                return result.success ? result.key : null;
            });

            const uploadResults = await Promise.all(uploadPromises);
            const successfulUploads = uploadResults.filter(key => key !== null) as string[];

            if (successfulUploads.length > 0) {
                // Update form data with new S3 keys
                const updatedEducation = [...(profileData.education || [])];
                const currentDocuments = (updatedEducation[index]?.documents as string[]) || [];
                updatedEducation[index] = {
                    ...updatedEducation[index],
                    documents: [...currentDocuments, ...successfulUploads]
                };
                onUpdate({ education: updatedEducation });

                // Update document URLs for immediate display
                const newDocumentUrls = await Promise.all(
                    successfulUploads.map(async (s3Key) => {
                        const url = await getFileUrl(s3Key, 3600);
                        const name = extractFileNameFromS3Key(s3Key);
                        const fileType = getFileType(name);
                        return { key: s3Key, url: url || "", name, fileType };
                    })
                );

                setDocumentUrls(prev => ({
                    ...prev,
                    [uploadKey]: [...(prev[uploadKey] || []), ...newDocumentUrls.filter(doc => doc.url)]
                }));

                toast.success(`${successfulUploads.length} document(s) uploaded successfully!`);
            }
        } catch (error) {
            console.error("Error uploading education documents:", error);
            toast.error("Failed to upload documents. Please try again.");
        } finally {
            setUploadingStates(prev => ({ ...prev, [uploadKey]: false }));
            // Reset file input
            event.target.value = "";
        }
    };

    // Handle file upload for certification entries
    const handleCertificationFileUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const uploadKey = `certification-${index}`;
        setUploadingStates(prev => ({ ...prev, [uploadKey]: true }));

        try {
            const user = await getCurrentUser();
            if (!user?.userId) {
                toast.error("User not found");
                return;
            }

            const uploadPromises = Array.from(files).map(async (file) => {
                // Validate file
                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                    toast.error(`File ${file.name} is too large (max 10MB)`);
                    return null;
                }

                const result = await uploadCredentialsDocument(file, "certification");
                return result.success ? result.key : null;
            });

            const uploadResults = await Promise.all(uploadPromises);
            const successfulUploads = uploadResults.filter(key => key !== null) as string[];

            if (successfulUploads.length > 0) {
                // Update form data with new S3 keys
                const updatedCertifications = [...(profileData.certifications || [])];
                const currentDocuments = (updatedCertifications[index]?.documents as string[]) || [];
                updatedCertifications[index] = {
                    ...updatedCertifications[index],
                    documents: [...currentDocuments, ...successfulUploads]
                };
                onUpdate({ certifications: updatedCertifications });

                // Update document URLs for immediate display
                const newDocumentUrls = await Promise.all(
                    successfulUploads.map(async (s3Key) => {
                        const url = await getFileUrl(s3Key, 3600);
                        const name = extractFileNameFromS3Key(s3Key);
                        const fileType = getFileType(name);
                        return { key: s3Key, url: url || "", name, fileType };
                    })
                );

                setDocumentUrls(prev => ({
                    ...prev,
                    [uploadKey]: [...(prev[uploadKey] || []), ...newDocumentUrls.filter(doc => doc.url)]
                }));

                toast.success(`${successfulUploads.length} document(s) uploaded successfully!`);
            }
        } catch (error) {
            console.error("Error uploading certification documents:", error);
            toast.error("Failed to upload documents. Please try again.");
        } finally {
            setUploadingStates(prev => ({ ...prev, [uploadKey]: false }));
            // Reset file input
            event.target.value = "";
        }
    };

    // Handle file upload for work experience entries
    const handleWorkExperienceFileUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const uploadKey = `workExperience-${index}`;
        setUploadingStates(prev => ({ ...prev, [uploadKey]: true }));

        try {
            const user = await getCurrentUser();
            if (!user?.userId) {
                toast.error("User not found");
                return;
            }

            const uploadPromises = Array.from(files).map(async (file) => {
                // Validate file
                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                    toast.error(`File ${file.name} is too large (max 10MB)`);
                    return null;
                }

                const result = await uploadCredentialsDocument(file, "work-experience");
                return result.success ? result.key : null;
            });

            const uploadResults = await Promise.all(uploadPromises);
            const successfulUploads = uploadResults.filter(key => key !== null) as string[];

            if (successfulUploads.length > 0) {
                // Update form data with new S3 keys
                const updatedWorkExperience = [...(profileData.workExperience || [])];
                const currentDocuments = (updatedWorkExperience[index]?.documents as string[]) || [];
                updatedWorkExperience[index] = {
                    ...updatedWorkExperience[index],
                    documents: [...currentDocuments, ...successfulUploads]
                };
                onUpdate({ workExperience: updatedWorkExperience });

                // Update document URLs for immediate display
                const newDocumentUrls = await Promise.all(
                    successfulUploads.map(async (s3Key) => {
                        const url = await getFileUrl(s3Key, 3600);
                        const name = extractFileNameFromS3Key(s3Key);
                        const fileType = getFileType(name);
                        return { key: s3Key, url: url || "", name, fileType };
                    })
                );

                setDocumentUrls(prev => ({
                    ...prev,
                    [uploadKey]: [...(prev[uploadKey] || []), ...newDocumentUrls.filter(doc => doc.url)]
                }));

                toast.success(`${successfulUploads.length} document(s) uploaded successfully!`);
            }
        } catch (error) {
            console.error("Error uploading work experience documents:", error);
            toast.error("Failed to upload documents. Please try again.");
        } finally {
            setUploadingStates(prev => ({ ...prev, [uploadKey]: false }));
            // Reset file input
            event.target.value = "";
        }
    };

    // Remove file functions
    const removeEducationFile = async (entryIndex: number, s3Key: string) => {
        try {
            // Delete from S3
            await deleteFile(s3Key);
            console.log("✅ File deleted from S3:", s3Key);

            // Update form data
            const updatedEducation = [...(profileData.education || [])];
            const currentDocuments = (updatedEducation[entryIndex]?.documents as string[]) || [];
            updatedEducation[entryIndex] = {
                ...updatedEducation[entryIndex],
                documents: currentDocuments.filter(key => key !== s3Key)
            };
            onUpdate({ education: updatedEducation });

            // Update local document URLs
            const uploadKey = `education-${entryIndex}`;
            setDocumentUrls(prev => ({
                ...prev,
                [uploadKey]: (prev[uploadKey] || []).filter(doc => doc.key !== s3Key)
            }));

            toast.success("Document removed successfully!");
        } catch (error) {
            console.error("Error removing education file:", error);
            toast.error("Failed to remove document. Please try again.");
        }
    };

    const removeCertificationFile = async (entryIndex: number, s3Key: string) => {
        try {
            // Delete from S3
            await deleteFile(s3Key);
            console.log("✅ File deleted from S3:", s3Key);

            // Update form data
            const updatedCertifications = [...(profileData.certifications || [])];
            const currentDocuments = (updatedCertifications[entryIndex]?.documents as string[]) || [];
            updatedCertifications[entryIndex] = {
                ...updatedCertifications[entryIndex],
                documents: currentDocuments.filter(key => key !== s3Key)
            };
            onUpdate({ certifications: updatedCertifications });

            // Update local document URLs
            const uploadKey = `certification-${entryIndex}`;
            setDocumentUrls(prev => ({
                ...prev,
                [uploadKey]: (prev[uploadKey] || []).filter(doc => doc.key !== s3Key)
            }));

            toast.success("Document removed successfully!");
        } catch (error) {
            console.error("Error removing certification file:", error);
            toast.error("Failed to remove document. Please try again.");
        }
    };

    const removeWorkExperienceFile = async (entryIndex: number, s3Key: string) => {
        try {
            // Delete from S3
            await deleteFile(s3Key);
            console.log("✅ File deleted from S3:", s3Key);

            // Update form data
            const updatedWorkExperience = [...(profileData.workExperience || [])];
            const currentDocuments = (updatedWorkExperience[entryIndex]?.documents as string[]) || [];
            updatedWorkExperience[entryIndex] = {
                ...updatedWorkExperience[entryIndex],
                documents: currentDocuments.filter(key => key !== s3Key)
            };
            onUpdate({ workExperience: updatedWorkExperience });

            // Update local document URLs
            const uploadKey = `workExperience-${entryIndex}`;
            setDocumentUrls(prev => ({
                ...prev,
                [uploadKey]: (prev[uploadKey] || []).filter(doc => doc.key !== s3Key)
            }));

            toast.success("Document removed successfully!");
        } catch (error) {
            console.error("Error removing work experience file:", error);
            toast.error("Failed to remove document. Please try again.");
        }
    };

    // Clean up files when entries are removed
    const handleRemoveEducation = async (index: number) => {
        // Delete all associated files from S3
        const education = profileData.education?.[index] as EducationEntry;
        if (education?.documents && education.documents.length > 0) {
            try {
                await Promise.all(education.documents.map(s3Key => deleteFile(s3Key)));
                console.log("✅ All education files deleted from S3");
            } catch (error) {
                console.warn("⚠️ Some education files could not be deleted from S3:", error);
            }
        }

        // Remove from form data
        removeEducation(index);

        // Clean up local state
        const uploadKey = `education-${index}`;
        setDocumentUrls(prev => {
            const newState = { ...prev };
            delete newState[uploadKey];
            return newState;
        });
    };

    const handleRemoveCertification = async (index: number) => {
        // Delete all associated files from S3
        const certification = profileData.certifications?.[index] as CertificationEntry;
        if (certification?.documents && certification.documents.length > 0) {
            try {
                await Promise.all(certification.documents.map(s3Key => deleteFile(s3Key)));
                console.log("✅ All certification files deleted from S3");
            } catch (error) {
                console.warn("⚠️ Some certification files could not be deleted from S3:", error);
            }
        }

        // Remove from form data
        removeCertification(index);

        // Clean up local state
        const uploadKey = `certification-${index}`;
        setDocumentUrls(prev => {
            const newState = { ...prev };
            delete newState[uploadKey];
            return newState;
        });
    };

    const handleRemoveWorkExperience = async (index: number) => {
        // Delete all associated files from S3
        const workExperience = profileData.workExperience?.[index] as WorkExperienceEntry;
        if (workExperience?.documents && workExperience.documents.length > 0) {
            try {
                await Promise.all(workExperience.documents.map(s3Key => deleteFile(s3Key)));
                console.log("✅ All work experience files deleted from S3");
            } catch (error) {
                console.warn("⚠️ Some work experience files could not be deleted from S3:", error);
            }
        }

        // Remove from form data
        removeWorkExperience(index);

        // Clean up local state
        const uploadKey = `workExperience-${index}`;
        setDocumentUrls(prev => {
            const newState = { ...prev };
            delete newState[uploadKey];
            return newState;
        });
    };

    // File upload component for S3
    const FileUploadSection = ({
        entryIndex,
        entryType,
        onFileUpload,
        onFileRemove,
        uploadId,
        title
    }: {
        entryIndex: number;
        entryType: "education" | "certification" | "workExperience";
        // eslint-disable-next-line no-unused-vars
        onFileUpload: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
        // eslint-disable-next-line no-unused-vars
        onFileRemove: (entryIndex: number, s3Key: string) => void;
        uploadId: string;
        title: string;
    }) => {
        const uploadKey = `${entryType}-${entryIndex}`;
        const isUploading = uploadingStates[uploadKey] || false;
        const documents = documentUrls[uploadKey] || [];

        return (
            <div className="mt-4 space-y-3">
                <label className="text-sm font-medium text-gray-700">{title}</label>

                {/* Upload Area */}
                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors">
                    <input
                        id={uploadId}
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.bmp,.svg"
                        className="hidden"
                        onChange={(e) => onFileUpload(entryIndex, e)}
                        disabled={isUploading}
                    />
                    <label htmlFor={uploadId} className={`cursor-pointer ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                        {isUploading ? (
                            <Loader2 className="mx-auto h-8 w-8 text-indigo-500 mb-2 animate-spin" />
                        ) : (
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                            {isUploading ? "Uploading..." : "Upload Documents"}
                        </span>
                        <span className="block text-xs text-gray-500 mt-1">
                            PDF, PNG, JPG, GIF, WebP up to 10MB each
                        </span>
                    </label>
                </div>

                {/* Existing Documents Display */}
                {documents.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-600">Uploaded Documents ({documents.length})</p>
                        <div className="grid grid-cols-1 gap-3">
                            {documents.map((doc) => (
                                <div key={doc.key} className="group bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                                    <div className="flex items-start gap-3">
                                        {/* File preview/icon */}
                                        <div className="flex-shrink-0">
                                            {doc.fileType === "image" ? (
                                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                                                    <img
                                                        src={doc.url}
                                                        alt={doc.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = "none";
                                                            const parent = target.parentElement;
                                                            if (parent) {
                                                                parent.innerHTML = `
                                                                    <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                        <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                `;
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            ) : doc.fileType === "pdf" ? (
                                                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
                                                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200">
                                                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* File info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{doc.fileType} document</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => window.open(doc.url, "_blank")}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                title="View document"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const link = document.createElement("a");
                                                    link.href = doc.url;
                                                    link.download = doc.name;
                                                    link.click();
                                                }}
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                title="Download document"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onFileRemove(entryIndex, doc.key)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Remove document"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
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

    return (
        <div className="h-full bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500 rounded-xl">
                        <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Credentials & Work History</h2>
                        <p className="text-gray-600">Optional: Add your education, certifications, and work experience to build client trust</p>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto space-y-8">
                    {/* Education Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Education & Training</h3>
                                <p className="text-sm text-gray-600">Add your educational background</p>
                            </div>
                            <button
                                type="button"
                                onClick={addEducation}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Education
                            </button>
                        </div>

                        {!profileData.education || profileData.education.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <p className="text-sm">No education entries added yet</p>
                                <p className="text-xs mt-1">Click &quot;Add Education&quot; to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {profileData.education.map((edu: EducationEntry, index: number) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveEducation(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Institution Name</label>
                                                <input
                                                    type="text"
                                                    value={edu.institution || ""}
                                                    onChange={(e) => updateEducation(index, { institution: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                    placeholder="e.g., University of Toronto"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Degree/Program</label>
                                                <input
                                                    type="text"
                                                    value={edu.degree || ""}
                                                    onChange={(e) => updateEducation(index, { degree: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                    placeholder="e.g., Licensed Practical Nurse (LPN)"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                                                <input
                                                    type="text"
                                                    value={edu.fieldOfStudy || ""}
                                                    onChange={(e) => updateEducation(index, { fieldOfStudy: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                    placeholder="e.g., Nursing, Healthcare, Social Work"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                                                <select
                                                    value={edu.graduationYear || ""}
                                                    onChange={(e) => updateEducation(index, { graduationYear: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                >
                                                    <option value="">Select year</option>
                                                    {graduationYears.map((year) => (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* File Upload for this Education Entry */}
                                        <FileUploadSection
                                            entryIndex={index}
                                            entryType="education"
                                            onFileUpload={handleEducationFileUpload}
                                            onFileRemove={removeEducationFile}
                                            uploadId={`education-files-${index}`}
                                            title="Upload Transcripts, Diplomas, Certificates"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Certifications Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Certifications & Licensure</h3>
                                <p className="text-sm text-gray-600">Add your professional certifications and licenses</p>
                            </div>
                            <button
                                type="button"
                                onClick={addCertification}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Certification
                            </button>
                        </div>

                        {!profileData.certifications || profileData.certifications.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <p className="text-sm">No certifications added yet</p>
                                <p className="text-xs mt-1">Click &quot;Add Certification&quot; to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {profileData.certifications.map((cert: CertificationEntry, index: number) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium text-gray-900">Certification #{index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCertification(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Certification/License Name</label>
                                                <input
                                                    type="text"
                                                    value={cert.certificationName || ""}
                                                    onChange={(e) => updateCertification(index, { certificationName: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                    placeholder="e.g., Licensed Practical Nurse"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Issuing Organization</label>
                                                <input
                                                    type="text"
                                                    value={cert.issuingOrganization || ""}
                                                    onChange={(e) => updateCertification(index, { issuingOrganization: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                    placeholder="e.g., College of Nurses of Ontario"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Issue Date</label>
                                                <input
                                                    type="date"
                                                    value={cert.issueDate || ""}
                                                    onChange={(e) => updateCertification(index, { issueDate: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Expiry Date (if applicable)</label>
                                                <input
                                                    type="date"
                                                    value={cert.expiryDate || ""}
                                                    onChange={(e) => updateCertification(index, { expiryDate: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700">License/Certification Number</label>
                                                <input
                                                    type="text"
                                                    value={cert.licenseNumber || ""}
                                                    onChange={(e) => updateCertification(index, { licenseNumber: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                    placeholder="e.g., LPN-123456"
                                                />
                                            </div>
                                        </div>

                                        {/* File Upload for this Certification Entry */}
                                        <FileUploadSection
                                            entryIndex={index}
                                            entryType="certification"
                                            onFileUpload={handleCertificationFileUpload}
                                            onFileRemove={removeCertificationFile}
                                            uploadId={`certification-files-${index}`}
                                            title="Upload License/Certificate Documents"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Work Experience Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Recent Work Experience</h3>
                                <p className="text-sm text-gray-600">Add your relevant work history</p>
                            </div>
                            <button
                                type="button"
                                onClick={addWorkExperience}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Experience
                            </button>
                        </div>

                        {!profileData.workExperience || profileData.workExperience.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                                </svg>
                                <p className="text-sm">No work experience added yet</p>
                                <p className="text-xs mt-1">Click &quot;Add Experience&quot; to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {profileData.workExperience.map((work: WorkExperienceEntry, index: number) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveWorkExperience(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Employer</label>
                                                <input
                                                    type="text"
                                                    value={work.employer || ""}
                                                    onChange={(e) => updateWorkExperience(index, { employer: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                    placeholder="e.g., Toronto General Hospital"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                                <input
                                                    type="text"
                                                    value={work.jobTitle || ""}
                                                    onChange={(e) => updateWorkExperience(index, { jobTitle: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                    placeholder="e.g., Licensed Practical Nurse"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                                <input
                                                    type="date"
                                                    value={work.startDate || ""}
                                                    onChange={(e) => updateWorkExperience(index, { startDate: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                                <input
                                                    type="date"
                                                    value={work.endDate || ""}
                                                    onChange={(e) => updateWorkExperience(index, { endDate: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                                <textarea
                                                    value={work.description || ""}
                                                    onChange={(e) => updateWorkExperience(index, { description: e.target.value })}
                                                    rows={3}
                                                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                                    placeholder="Brief description of your role and responsibilities..."
                                                />
                                            </div>
                                        </div>

                                        {/* File Upload for this Work Experience Entry */}
                                        <FileUploadSection
                                            entryIndex={index}
                                            entryType="workExperience"
                                            onFileUpload={handleWorkExperienceFileUpload}
                                            onFileRemove={removeWorkExperienceFile}
                                            uploadId={`work-files-${index}`}
                                            title="Upload Reference Letters, Evaluations"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Completion Note */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="text-sm">
                                <p className="font-medium text-blue-800">Optional Section</p>
                                <p className="text-blue-700 mt-1">
                                    This entire section is optional. You can skip it entirely or add as much or as little information as you&apos;re comfortable sharing.
                                    Adding credentials with supporting documents helps build trust with potential clients.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 