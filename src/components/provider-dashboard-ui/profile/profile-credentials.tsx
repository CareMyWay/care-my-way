"use client";

import { useState, useEffect } from "react";
import { BookOpen, Award, Briefcase, Calendar, Building, GraduationCap, FileText, Download, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type ProviderProfileData } from "@/actions/providerProfileActions";
import { getFileUrl } from "@/utils/s3-upload";

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

// Component to display document attachments
function DocumentList({ documents, title }: { documents: string[]; title: string }) {
  const [documentUrls, setDocumentUrls] = useState<{ key: string; url: string; name: string; fileType: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadDocumentUrls = async () => {
      if (!documents || documents.length === 0) return;

      setIsLoading(true);
      try {
        const urlPromises = documents.map(async (s3Key) => {
          const url = await getFileUrl(s3Key, 3600); // 1 hour expiry
          const name = extractFileNameFromS3Key(s3Key);
          const fileType = getFileType(name);
          return { key: s3Key, url: url || '', name, fileType };
        });

        const results = await Promise.all(urlPromises);
        console.log('📄 Document processing results:', results);
        setDocumentUrls(results.filter(result => result.url)); // Only keep successful ones
      } catch (error) {
        console.error('Error loading document URLs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocumentUrls();
  }, [documents]);

  // Helper function to extract filename from S3 key
  const extractFileNameFromS3Key = (s3Key: string): string => {
    const parts = s3Key.split('/');
    const fullFileName = parts[parts.length - 1];
    // Remove timestamp prefix (format: timestamp-filename)
    const match = fullFileName.match(/^\d+-(.+)$/);
    return match ? match[1] : fullFileName;
  };

  // Helper function to determine file type
  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension)) return 'image';
    if (['pdf'].includes(extension)) return 'pdf';
    return 'document';
  };

  if (!documents || documents.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-white/70 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-4 w-4 text-gray-600" />
        <span className="font-medium text-gray-700 text-sm">{title}</span>
        <Badge variant="secondary" className="text-xs">
          {documents.length} file{documents.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
          <span>Loading documents...</span>
        </div>
      ) : (
        // Clean attachment card layout for all documents
        <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-4">
          {documentUrls.map((doc, index) => (
            <div key={index} className="group relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden">

              {/* Action Icons - Top Right Corner */}
              <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm border-0 shadow-md hover:bg-white hover:shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(doc.url, '_blank');
                  }}
                  title="View document"
                >
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm border-0 shadow-md hover:bg-white hover:shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement('a');
                    link.href = doc.url;
                    link.download = doc.name;
                    link.click();
                  }}
                  title="Download document"
                >
                  <Download className="h-4 w-4 text-green-600" />
                </Button>
              </div>

              {/* Document Preview */}
              <div className="cursor-pointer" onClick={() => window.open(doc.url, '_blank')}>
                <div className="aspect-[4/3] w-full bg-gray-50 flex items-center justify-center overflow-hidden">
                  {doc.fileType === 'image' ? (
                    <img
                      src={doc.url}
                      alt={doc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onLoad={() => {
                        console.log('✅ Image loaded successfully:', doc.name, doc.fileType, doc.url);
                      }}
                      onError={(e) => {
                        console.log('❌ Image failed to load:', doc.name, doc.fileType, doc.url);
                        // Fallback to file icon if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gray-100">
                              <div class="text-center">
                                <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                                </svg>
                                <div class="text-xs text-gray-500">Image Preview</div>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : doc.fileType === 'pdf' ? (
                    <div className="w-full h-full flex items-center justify-center bg-red-50">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-red-600 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <div className="text-red-600 font-bold text-lg">PDF</div>
                        <div className="text-red-500 text-xs mt-1">Click to view</div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-blue-600 mx-auto mb-3" />
                        <div className="text-blue-600 font-bold text-lg">DOC</div>
                        <div className="text-blue-500 text-xs mt-1">Click to view</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* File Info */}
              <div className="p-3 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 text-sm truncate mb-1">{doc.name}</h4>
                <p className="text-xs text-gray-500 capitalize">{doc.fileType}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
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

                  {/* Documents */}
                  {edu.documents && edu.documents.length > 0 && (
                    <DocumentList documents={edu.documents} title="Supporting Documents" />
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

                  {/* Documents */}
                  {cert.documents && cert.documents.length > 0 && (
                    <DocumentList documents={cert.documents} title="Certification Documents" />
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

                  {/* Documents */}
                  {work.documents && work.documents.length > 0 && (
                    <DocumentList documents={work.documents} title="Work Documents" />
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