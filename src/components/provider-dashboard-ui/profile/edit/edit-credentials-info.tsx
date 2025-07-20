"use client";

import { BookOpen, Award, Briefcase, Plus, Trash2, Calendar, Building, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card";
import { Button } from "@/components/provider-dashboard-ui/button";
import { type ProviderProfileData } from "@/actions/providerProfileActions";
import { useState } from "react";

interface EditCredentialsInfoProps {
    profileData: Partial<ProviderProfileData>;
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

export function EditCredentialsInfo({ profileData, onUpdate }: EditCredentialsInfoProps) {
    const [activeTab, setActiveTab] = useState<'education' | 'certifications' | 'workExperience'>('education');

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

    return (
        <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-indigo-500 rounded-xl">
                        <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    Professional Credentials
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">

                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('education')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeTab === 'education'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <GraduationCap className="h-4 w-4" />
                        Education
                    </button>
                    <button
                        onClick={() => setActiveTab('certifications')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeTab === 'certifications'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Award className="h-4 w-4" />
                        Certifications
                    </button>
                    <button
                        onClick={() => setActiveTab('workExperience')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeTab === 'workExperience'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Briefcase className="h-4 w-4" />
                        Experience
                    </button>
                </div>

                {/* Education Tab */}
                {activeTab === 'education' && (
                    <div className="space-y-6">
                        {profileData.education?.map((edu: EducationEntry, index: number) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-semibold text-gray-900">Education #{index + 1}</h4>
                                    <Button
                                        onClick={() => removeEducation(index)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                                        <input
                                            type="text"
                                            value={edu.institution || ""}
                                            onChange={(e) => updateEducation(index, { institution: e.target.value })}
                                            placeholder="University of Toronto"
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                                        <input
                                            type="text"
                                            value={edu.degree || ""}
                                            onChange={(e) => updateEducation(index, { degree: e.target.value })}
                                            placeholder="Bachelor of Science"
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                                        <input
                                            type="text"
                                            value={edu.fieldOfStudy || ""}
                                            onChange={(e) => updateEducation(index, { fieldOfStudy: e.target.value })}
                                            placeholder="Nursing"
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                                        <input
                                            type="text"
                                            value={edu.graduationYear || ""}
                                            onChange={(e) => updateEducation(index, { graduationYear: e.target.value })}
                                            placeholder="2020"
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button
                            onClick={addEducation}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Education
                        </Button>
                    </div>
                )}

                {/* Certifications Tab */}
                {activeTab === 'certifications' && (
                    <div className="space-y-6">
                        {profileData.certifications?.map((cert: CertificationEntry, index: number) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-semibold text-gray-900">Certification #{index + 1}</h4>
                                    <Button
                                        onClick={() => removeCertification(index)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name</label>
                                        <input
                                            type="text"
                                            value={cert.certificationName || ""}
                                            onChange={(e) => updateCertification(index, { certificationName: e.target.value })}
                                            placeholder="Registered Nurse"
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
                                        <input
                                            type="text"
                                            value={cert.issuingOrganization || ""}
                                            onChange={(e) => updateCertification(index, { issuingOrganization: e.target.value })}
                                            placeholder="College of Nurses of Ontario"
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                                        <input
                                            type="text"
                                            value={cert.licenseNumber || ""}
                                            onChange={(e) => updateCertification(index, { licenseNumber: e.target.value })}
                                            placeholder="12345678"
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                                        <input
                                            type="date"
                                            value={cert.issueDate || ""}
                                            onChange={(e) => updateCertification(index, { issueDate: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                                        <input
                                            type="date"
                                            value={cert.expiryDate || ""}
                                            onChange={(e) => updateCertification(index, { expiryDate: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button
                            onClick={addCertification}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Certification
                        </Button>
                    </div>
                )}

                {/* Work Experience Tab */}
                {activeTab === 'workExperience' && (
                    <div className="space-y-6">
                        {profileData.workExperience?.map((work: WorkExperienceEntry, index: number) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-semibold text-gray-900">Work Experience #{index + 1}</h4>
                                    <Button
                                        onClick={() => removeWorkExperience(index)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Employer</label>
                                        <input
                                            type="text"
                                            value={work.employer || ""}
                                            onChange={(e) => updateWorkExperience(index, { employer: e.target.value })}
                                            placeholder="Toronto General Hospital"
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                                        <input
                                            type="text"
                                            value={work.jobTitle || ""}
                                            onChange={(e) => updateWorkExperience(index, { jobTitle: e.target.value })}
                                            placeholder="Registered Nurse"
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                        <input
                                            type="date"
                                            value={work.startDate || ""}
                                            onChange={(e) => updateWorkExperience(index, { startDate: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                        <input
                                            type="date"
                                            value={work.endDate || ""}
                                            onChange={(e) => updateWorkExperience(index, { endDate: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Leave blank if current position</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={work.description || ""}
                                            onChange={(e) => updateWorkExperience(index, { description: e.target.value })}
                                            rows={3}
                                            placeholder="Describe your key responsibilities and achievements..."
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button
                            onClick={addWorkExperience}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Work Experience
                        </Button>
                    </div>
                )}

                {/* Information Note */}
                <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg mt-1">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 mb-2">Building Trust with Credentials</h4>
                            <p className="text-sm text-blue-800">
                                Adding your professional credentials helps build trust with clients. Include your
                                most relevant education, certifications, and work experience to showcase your
                                qualifications and expertise in healthcare services.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 