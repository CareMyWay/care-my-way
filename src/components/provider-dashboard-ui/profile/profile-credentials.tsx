"use client";

import { BookOpen, Award, Briefcase, Calendar, Building, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ProviderProfileData } from "@/actions/providerProfileActions";

// Types for credential entries
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

interface ProfileCredentialsProps {
  profileData: ProviderProfileData;
}

export function ProfileCredentials({ profileData }: ProfileCredentialsProps) {
  return (
    <div className="space-y-6">

      {/* Education */}
      {profileData.education && profileData.education.length > 0 && (
        <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 p-0">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b px-6 py-6">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-indigo-500 rounded-xl">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              Education
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {profileData.education.map((edu: EducationEntry, index: number) => (
              <div key={index} className="relative pl-6 pb-4 border-l-4 border-indigo-200 last:pb-0">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white"></div>

                <div className="bg-indigo-50 rounded-xl p-4 hover:bg-indigo-100 transition-colors duration-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <GraduationCap className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{edu.degree}</h4>
                      <p className="text-indigo-600 font-medium">{edu.institution}</p>
                    </div>
                  </div>

                  {edu.fieldOfStudy && (
                    <p className="text-gray-700 mb-2 font-medium">{edu.fieldOfStudy}</p>
                  )}

                  {edu.graduationYear && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>Graduated {edu.graduationYear}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {profileData.certifications && profileData.certifications.length > 0 && (
        <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 p-0">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b px-6 py-6">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-emerald-500 rounded-xl">
                <Award className="h-5 w-5 text-white" />
              </div>
              Certifications & Licenses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {profileData.certifications.map((cert: CertificationEntry, index: number) => (
              <div key={index} className="relative pl-6 pb-4 border-l-4 border-emerald-200 last:pb-0">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>

                <div className="bg-emerald-50 rounded-xl p-4 hover:bg-emerald-100 transition-colors duration-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Award className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{cert.certificationName}</h4>
                      <p className="text-emerald-600 font-medium">{cert.issuingOrganization}</p>
                    </div>
                  </div>

                  {cert.licenseNumber && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full">
                        License: {cert.licenseNumber}
                      </span>
                    </div>
                  )}

                  {cert.issueDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Issued {new Date(cert.issueDate).toLocaleDateString()}
                        {cert.expiryDate && (
                          <span className="ml-1">
                            • Expires {new Date(cert.expiryDate).toLocaleDateString()}
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Work Experience */}
      {profileData.workExperience && profileData.workExperience.length > 0 && (
        <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 p-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b px-6 py-6">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-blue-500 rounded-xl">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {profileData.workExperience.map((work: WorkExperienceEntry, index: number) => (
              <div key={index} className="relative pl-6 pb-4 border-l-4 border-blue-200 last:pb-0">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>

                <div className="bg-blue-50 rounded-xl p-4 hover:bg-blue-100 transition-colors duration-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Building className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{work.jobTitle}</h4>
                      <p className="text-blue-600 font-medium">{work.employer}</p>
                    </div>
                  </div>

                  {work.startDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(work.startDate).toLocaleDateString()} -
                        {work.endDate ? new Date(work.endDate).toLocaleDateString() :
                          <span className="text-green-600 font-medium ml-1">Present</span>}
                      </span>
                    </div>
                  )}

                  {work.description && (
                    <div className="prose prose-sm prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {work.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State - when no credentials are available */}
      {(!profileData.education || profileData.education.length === 0) &&
        (!profileData.certifications || profileData.certifications.length === 0) &&
        (!profileData.workExperience || profileData.workExperience.length === 0) && (
          <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Credentials Added</h3>
              <p className="text-gray-600 mb-4">
                Add your education, certifications, and work experience to build trust with clients.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
} 