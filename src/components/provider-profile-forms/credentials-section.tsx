/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const credentialsSchema = z.object({
    // Education
    institution: z.string().min(1, "Institution name is required"),
    degree: z.string().min(1, "Degree/Program is required"),
    fieldOfStudy: z.string().min(1, "Field of study is required"),
    graduationYear: z.string().min(1, "Graduation year is required"),

    // Certifications
    certificationName: z.string().min(1, "Certification name is required"),
    issuingOrganization: z.string().min(1, "Issuing organization is required"),
    issueDate: z.string().min(1, "Issue date is required"),
    expiryDate: z.string().optional(),
    licenseNumber: z.string().optional(),

    // Work Experience (optional)
    previousEmployer: z.string().optional(),
    jobTitle: z.string().optional(),
    workStartDate: z.string().optional(),
    workEndDate: z.string().optional(),
    jobDescription: z.string().optional(),
});

type CredentialsFormFields = z.infer<typeof credentialsSchema>;

interface CredentialsSectionProps {
    onDataChange: (_data: CredentialsFormFields) => void;
    isCompleted: boolean;
    defaultValues?: Partial<CredentialsFormFields>;
}

// Graduation year options (last 50 years)
const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

export function CredentialsSection({
    onDataChange,
    isCompleted,
    defaultValues,
}: CredentialsSectionProps) {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const {
        register,
        watch,
        formState: { errors },
    } = useForm<CredentialsFormFields>({
        mode: "onChange",
        defaultValues: {
            institution: defaultValues?.institution || "",
            degree: defaultValues?.degree || "",
            fieldOfStudy: defaultValues?.fieldOfStudy || "",
            graduationYear: defaultValues?.graduationYear || "",
            certificationName: defaultValues?.certificationName || "",
            issuingOrganization: defaultValues?.issuingOrganization || "",
            issueDate: defaultValues?.issueDate || "",
            expiryDate: defaultValues?.expiryDate || "",
            licenseNumber: defaultValues?.licenseNumber || "",
            previousEmployer: defaultValues?.previousEmployer || "",
            jobTitle: defaultValues?.jobTitle || "",
            workStartDate: defaultValues?.workStartDate || "",
            workEndDate: defaultValues?.workEndDate || "",
            jobDescription: defaultValues?.jobDescription || "",
        },
        resolver: zodResolver(credentialsSchema),
    });

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setUploadedFiles(prev => [...prev, ...newFiles]);
        }
    };

    // Remove uploaded file
    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Track and notify parent of progress
    useEffect(() => {
        const subscription = watch((value) => {
            onDataChange(value as CredentialsFormFields);
        });
        return () => subscription.unsubscribe();
    }, [watch, onDataChange]);

    return (
        <div className="h-full bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold ${isCompleted
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-[#4A9B9B] bg-[#4A9B9B] text-white"
                            }`}
                    >
                        {isCompleted ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            "5"
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-darkest-green">
                            Credentials & Work History
                        </h2>
                        <p className="text-sm text-gray-600">
                            Add your education, certifications, and relevant work experience
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form className="flex-1 overflow-y-auto space-y-8">
                    {/* Education Section */}
                    <div className="space-y-4">
                        <div className="border-b border-gray-200 pb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Education & Training</h3>
                            <p className="text-sm text-gray-600">Your most relevant educational background</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="institution" className="std-form-label">
                                    Institution Name *
                                </label>
                                <input
                                    id="institution"
                                    {...register("institution")}
                                    className="std-form-input"
                                    placeholder="e.g., University of Toronto"
                                />
                                {errors.institution && (
                                    <p className="text-sm text-red-600">
                                        {errors.institution.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="degree" className="std-form-label">
                                    Degree/Program *
                                </label>
                                <input
                                    id="degree"
                                    {...register("degree")}
                                    className="std-form-input"
                                    placeholder="e.g., Licensed Practical Nurse (LPN)"
                                />
                                {errors.degree && (
                                    <p className="text-sm text-red-600">
                                        {errors.degree.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="fieldOfStudy" className="std-form-label">
                                    Field of Study *
                                </label>
                                <input
                                    id="fieldOfStudy"
                                    {...register("fieldOfStudy")}
                                    className="std-form-input"
                                    placeholder="e.g., Nursing, Healthcare, Social Work"
                                />
                                {errors.fieldOfStudy && (
                                    <p className="text-sm text-red-600">
                                        {errors.fieldOfStudy.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="graduationYear" className="std-form-label">
                                    Graduation Year *
                                </label>
                                <select
                                    id="graduationYear"
                                    {...register("graduationYear")}
                                    className="std-form-input"
                                >
                                    <option value="">Select year</option>
                                    {graduationYears.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                {errors.graduationYear && (
                                    <p className="text-sm text-red-600">
                                        {errors.graduationYear.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Certifications Section */}
                    <div className="space-y-4">
                        <div className="border-b border-gray-200 pb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Certifications & Licensure</h3>
                            <p className="text-sm text-gray-600">Your primary certification or license</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="certificationName" className="std-form-label">
                                    Certification/License Name *
                                </label>
                                <input
                                    id="certificationName"
                                    {...register("certificationName")}
                                    className="std-form-input"
                                    placeholder="e.g., Licensed Practical Nurse"
                                />
                                {errors.certificationName && (
                                    <p className="text-sm text-red-600">
                                        {errors.certificationName.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="issuingOrganization" className="std-form-label">
                                    Issuing Organization *
                                </label>
                                <input
                                    id="issuingOrganization"
                                    {...register("issuingOrganization")}
                                    className="std-form-input"
                                    placeholder="e.g., College of Nurses of Ontario"
                                />
                                {errors.issuingOrganization && (
                                    <p className="text-sm text-red-600">
                                        {errors.issuingOrganization.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="issueDate" className="std-form-label">
                                    Issue Date *
                                </label>
                                <input
                                    type="date"
                                    id="issueDate"
                                    {...register("issueDate")}
                                    className="std-form-input"
                                />
                                {errors.issueDate && (
                                    <p className="text-sm text-red-600">
                                        {errors.issueDate.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="expiryDate" className="std-form-label">
                                    Expiry Date (if applicable)
                                </label>
                                <input
                                    type="date"
                                    id="expiryDate"
                                    {...register("expiryDate")}
                                    className="std-form-input"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="licenseNumber" className="std-form-label">
                                    License/Certification Number (optional)
                                </label>
                                <input
                                    id="licenseNumber"
                                    {...register("licenseNumber")}
                                    className="std-form-input"
                                    placeholder="e.g., LPN-123456"
                                />
                            </div>
                        </div>

                        {/* File Upload Section */}
                        <div className="space-y-3">
                            <label className="std-form-label">
                                Upload Certificates/Licenses
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#4A9B9B] transition-colors">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="mt-4">
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <span className="mt-2 block text-sm font-medium text-gray-900">
                                            Click to upload certificates or licenses
                                        </span>
                                        <span className="mt-1 block text-xs text-gray-500">
                                            PDF, PNG, JPG up to 10MB each
                                        </span>
                                    </label>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        multiple
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        className="sr-only"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            </div>

                            {/* Uploaded Files Display */}
                            {uploadedFiles.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-gray-900">Uploaded Files:</h4>
                                    <div className="space-y-2">
                                        {uploadedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm text-gray-900">{file.name}</span>
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Work Experience Section (Optional) */}
                    <div className="space-y-4">
                        <div className="border-b border-gray-200 pb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Work Experience</h3>
                            <p className="text-sm text-gray-600">Optional: Add your most relevant work experience</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="previousEmployer" className="std-form-label">
                                    Previous Employer
                                </label>
                                <input
                                    id="previousEmployer"
                                    {...register("previousEmployer")}
                                    className="std-form-input"
                                    placeholder="e.g., Toronto General Hospital"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="jobTitle" className="std-form-label">
                                    Job Title
                                </label>
                                <input
                                    id="jobTitle"
                                    {...register("jobTitle")}
                                    className="std-form-input"
                                    placeholder="e.g., Licensed Practical Nurse"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="workStartDate" className="std-form-label">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    id="workStartDate"
                                    {...register("workStartDate")}
                                    className="std-form-input"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="workEndDate" className="std-form-label">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="workEndDate"
                                    {...register("workEndDate")}
                                    className="std-form-input"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="jobDescription" className="std-form-label">
                                    Job Description
                                </label>
                                <textarea
                                    id="jobDescription"
                                    {...register("jobDescription")}
                                    rows={3}
                                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B9B] focus:border-[#4A9B9B] resize-none"
                                    placeholder="Brief description of your role and responsibilities..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Completion Note */}
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="text-sm">
                                <p className="font-medium text-green-800">Final Step</p>
                                <p className="text-green-700 mt-1">
                                    Complete this section to finish your provider profile setup.
                                    Your credentials help clients trust and choose your services.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
} 