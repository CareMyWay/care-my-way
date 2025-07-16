/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useFormSection } from "@/hooks/useFormSection";
import { FormSectionHeader } from "./form-section-header";
import { CredentialsData, BaseFormSectionProps } from "@/types/provider-profile-form";

// Individual entry schemas - all optional
const educationEntrySchema = z.object({
    institution: z.string().optional(),
    degree: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    graduationYear: z.string().optional(),
    documents: z.array(z.string()).optional(), // File names/paths
});

const certificationEntrySchema = z.object({
    certificationName: z.string().optional(),
    issuingOrganization: z.string().optional(),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional(),
    licenseNumber: z.string().optional(),
    documents: z.array(z.string()).optional(), // File names/paths
});

const workExperienceEntrySchema = z.object({
    employer: z.string().optional(),
    jobTitle: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().optional(),
    documents: z.array(z.string()).optional(), // File names/paths
});

// Main schema with arrays - everything optional
const credentialsSchema = z.object({
    education: z.array(educationEntrySchema).optional(),
    certifications: z.array(certificationEntrySchema).optional(),
    workExperience: z.array(workExperienceEntrySchema).optional(),
});

interface CredentialsSectionProps extends BaseFormSectionProps<CredentialsData> {
    // Props are inherited from BaseFormSectionProps
}

// Graduation year options (last 50 years)
const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

export function CredentialsSection({
    onDataChange,
    isCompleted,
    defaultValues,
}: CredentialsSectionProps) {
    // Store files for each entry by type and index
    const [educationFiles, setEducationFiles] = useState<{ [key: number]: File[] }>({});
    const [certificationFiles, setCertificationFiles] = useState<{ [key: number]: File[] }>({});
    const [workExperienceFiles, setWorkExperienceFiles] = useState<{ [key: number]: File[] }>({});

    const {
        register,
        control,
        setValue,
    } = useFormSection({
        schema: credentialsSchema,
        defaultValues: {
            education: defaultValues?.education || [],
            certifications: defaultValues?.certifications || [],
            workExperience: defaultValues?.workExperience || [],
        },
        onDataChange: onDataChange as (data: z.infer<typeof credentialsSchema>) => void,
    });

    // Field arrays for dynamic entries
    const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
        control,
        name: "education",
    });

    const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({
        control,
        name: "certifications",
    });

    const { fields: workExperienceFields, append: appendWorkExperience, remove: removeWorkExperience } = useFieldArray({
        control,
        name: "workExperience",
    });

    // Add new entries
    const addEducation = () => {
        appendEducation({
            institution: "",
            degree: "",
            fieldOfStudy: "",
            graduationYear: "",
            documents: [],
        });
    };

    const addCertification = () => {
        appendCertification({
            certificationName: "",
            issuingOrganization: "",
            issueDate: "",
            expiryDate: "",
            licenseNumber: "",
            documents: [],
        });
    };

    const addWorkExperience = () => {
        appendWorkExperience({
            employer: "",
            jobTitle: "",
            startDate: "",
            endDate: "",
            description: "",
            documents: [],
        });
    };

    // Handle file upload for education entries
    const handleEducationFileUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const updatedFiles = { ...educationFiles };
            updatedFiles[index] = [...(updatedFiles[index] || []), ...newFiles];
            setEducationFiles(updatedFiles);

            // Update form data with file names
            const fileNames = updatedFiles[index].map(file => file.name);
            setValue(`education.${index}.documents`, fileNames);
        }
    };

    // Handle file upload for certification entries
    const handleCertificationFileUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const updatedFiles = { ...certificationFiles };
            updatedFiles[index] = [...(updatedFiles[index] || []), ...newFiles];
            setCertificationFiles(updatedFiles);

            // Update form data with file names
            const fileNames = updatedFiles[index].map(file => file.name);
            setValue(`certifications.${index}.documents`, fileNames);
        }
    };

    // Handle file upload for work experience entries
    const handleWorkExperienceFileUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const updatedFiles = { ...workExperienceFiles };
            updatedFiles[index] = [...(updatedFiles[index] || []), ...newFiles];
            setWorkExperienceFiles(updatedFiles);

            // Update form data with file names
            const fileNames = updatedFiles[index].map(file => file.name);
            setValue(`workExperience.${index}.documents`, fileNames);
        }
    };

    // Remove file functions
    const removeEducationFile = (entryIndex: number, fileIndex: number) => {
        const updatedFiles = { ...educationFiles };
        if (updatedFiles[entryIndex]) {
            updatedFiles[entryIndex] = updatedFiles[entryIndex].filter((_, i) => i !== fileIndex);
            setEducationFiles(updatedFiles);

            // Update form data
            const fileNames = updatedFiles[entryIndex].map(file => file.name);
            setValue(`education.${entryIndex}.documents`, fileNames);
        }
    };

    const removeCertificationFile = (entryIndex: number, fileIndex: number) => {
        const updatedFiles = { ...certificationFiles };
        if (updatedFiles[entryIndex]) {
            updatedFiles[entryIndex] = updatedFiles[entryIndex].filter((_, i) => i !== fileIndex);
            setCertificationFiles(updatedFiles);

            // Update form data
            const fileNames = updatedFiles[entryIndex].map(file => file.name);
            setValue(`certifications.${entryIndex}.documents`, fileNames);
        }
    };

    const removeWorkExperienceFile = (entryIndex: number, fileIndex: number) => {
        const updatedFiles = { ...workExperienceFiles };
        if (updatedFiles[entryIndex]) {
            updatedFiles[entryIndex] = updatedFiles[entryIndex].filter((_, i) => i !== fileIndex);
            setWorkExperienceFiles(updatedFiles);

            // Update form data
            const fileNames = updatedFiles[entryIndex].map(file => file.name);
            setValue(`workExperience.${entryIndex}.documents`, fileNames);
        }
    };

    // Clean up files when entries are removed
    const handleRemoveEducation = (index: number) => {
        removeEducation(index);
        const updatedFiles = { ...educationFiles };
        delete updatedFiles[index];
        setEducationFiles(updatedFiles);
    };

    const handleRemoveCertification = (index: number) => {
        removeCertification(index);
        const updatedFiles = { ...certificationFiles };
        delete updatedFiles[index];
        setCertificationFiles(updatedFiles);
    };

    const handleRemoveWorkExperience = (index: number) => {
        removeWorkExperience(index);
        const updatedFiles = { ...workExperienceFiles };
        delete updatedFiles[index];
        setWorkExperienceFiles(updatedFiles);
    };

    // File upload component
    const FileUploadSection = ({
        entryIndex,
        files,
        onFileUpload,
        onFileRemove,
        uploadId,
        title
    }: {
        entryIndex: number;
        files: File[];
        onFileUpload: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
        onFileRemove: (entryIndex: number, fileIndex: number) => void;
        uploadId: string;
        title: string;
    }) => (
        <div className="mt-4 space-y-2">
            <label className="text-sm font-medium text-gray-700">{title}</label>

            {/* Upload Area */}
            <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-[#4A9B9B] transition-colors">
                <input
                    id={uploadId}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => onFileUpload(entryIndex, e)}
                />
                <label htmlFor={uploadId} className="cursor-pointer">
                    <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Upload Documents</span>
                    <span className="block text-xs text-gray-500 mt-1">PDF, PNG, JPG up to 10MB each</span>
                </label>
            </div>

            {/* Uploaded Files Display */}
            {files && files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, fileIndex) => (
                        <div key={fileIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-gray-900">{file.name}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => onFileRemove(entryIndex, fileIndex)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="h-full bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6 h-full flex flex-col">
                <FormSectionHeader
                    stepNumber={5}
                    title="Credentials & Work History"
                    subtitle="Optional: Add your education, certifications, and work experience to build client trust"
                    isCompleted={isCompleted}
                />

                {/* Form */}
                <form className="flex-1 overflow-y-auto space-y-8">
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
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-[#4A9B9B] text-white rounded-md hover:bg-[#3a7a7a] transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Education
                            </button>
                        </div>

                        {educationFields.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <p className="text-sm">No education entries added yet</p>
                                <p className="text-xs mt-1">Click &quot;Add Education&quot; to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {educationFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveEducation(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="std-form-label">Institution Name</label>
                                                <input
                                                    {...register(`education.${index}.institution`)}
                                                    className="std-form-input"
                                                    placeholder="e.g., University of Toronto"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="std-form-label">Degree/Program</label>
                                                <input
                                                    {...register(`education.${index}.degree`)}
                                                    className="std-form-input"
                                                    placeholder="e.g., Licensed Practical Nurse (LPN)"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="std-form-label">Field of Study</label>
                                                <input
                                                    {...register(`education.${index}.fieldOfStudy`)}
                                                    className="std-form-input"
                                                    placeholder="e.g., Nursing, Healthcare, Social Work"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="std-form-label">Graduation Year</label>
                                                <select
                                                    {...register(`education.${index}.graduationYear`)}
                                                    className="std-form-input"
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
                                            files={educationFiles[index] || []}
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
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-[#4A9B9B] text-white rounded-md hover:bg-[#3a7a7a] transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Certification
                            </button>
                        </div>

                        {certificationFields.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <p className="text-sm">No certifications added yet</p>
                                <p className="text-xs mt-1">Click &quot;Add Certification&quot; to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {certificationFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium text-gray-900">Certification #{index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCertification(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="std-form-label">Certification/License Name</label>
                                                <input
                                                    {...register(`certifications.${index}.certificationName`)}
                                                    className="std-form-input"
                                                    placeholder="e.g., Licensed Practical Nurse"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="std-form-label">Issuing Organization</label>
                                                <input
                                                    {...register(`certifications.${index}.issuingOrganization`)}
                                                    className="std-form-input"
                                                    placeholder="e.g., College of Nurses of Ontario"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="std-form-label">Issue Date</label>
                                                <input
                                                    type="date"
                                                    {...register(`certifications.${index}.issueDate`)}
                                                    className="std-form-input"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="std-form-label">Expiry Date (if applicable)</label>
                                                <input
                                                    type="date"
                                                    {...register(`certifications.${index}.expiryDate`)}
                                                    className="std-form-input"
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <label className="std-form-label">License/Certification Number</label>
                                                <input
                                                    {...register(`certifications.${index}.licenseNumber`)}
                                                    className="std-form-input"
                                                    placeholder="e.g., LPN-123456"
                                                />
                                            </div>
                                        </div>

                                        {/* File Upload for this Certification Entry */}
                                        <FileUploadSection
                                            entryIndex={index}
                                            files={certificationFiles[index] || []}
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
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-[#4A9B9B] text-white rounded-md hover:bg-[#3a7a7a] transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Experience
                            </button>
                        </div>

                        {workExperienceFields.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                                </svg>
                                <p className="text-sm">No work experience added yet</p>
                                <p className="text-xs mt-1">Click &quot;Add Experience&quot; to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {workExperienceFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveWorkExperience(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="std-form-label">Employer</label>
                                                <input
                                                    {...register(`workExperience.${index}.employer`)}
                                                    className="std-form-input"
                                                    placeholder="e.g., Toronto General Hospital"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="std-form-label">Job Title</label>
                                                <input
                                                    {...register(`workExperience.${index}.jobTitle`)}
                                                    className="std-form-input"
                                                    placeholder="e.g., Licensed Practical Nurse"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="std-form-label">Start Date</label>
                                                <input
                                                    type="date"
                                                    {...register(`workExperience.${index}.startDate`)}
                                                    className="std-form-input"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="std-form-label">End Date</label>
                                                <input
                                                    type="date"
                                                    {...register(`workExperience.${index}.endDate`)}
                                                    className="std-form-input"
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <label className="std-form-label">Description</label>
                                                <textarea
                                                    {...register(`workExperience.${index}.description`)}
                                                    rows={3}
                                                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B9B] focus:border-[#4A9B9B] resize-none"
                                                    placeholder="Brief description of your role and responsibilities..."
                                                />
                                            </div>
                                        </div>

                                        {/* File Upload for this Work Experience Entry */}
                                        <FileUploadSection
                                            entryIndex={index}
                                            files={workExperienceFiles[index] || []}
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
                </form>
            </div>
        </div>
    );
} 