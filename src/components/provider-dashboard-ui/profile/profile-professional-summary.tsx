"use client";

import { FileText, Briefcase, Award, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type ProviderProfileData } from "@/actions/providerProfileActions";

interface ProfileProfessionalSummaryProps {
  profileData: ProviderProfileData;
}

export function ProfileProfessionalSummary({
  profileData,
}: ProfileProfessionalSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Professional Bio */}
      <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-blue-500 rounded-xl">
              <FileText className="h-5 w-5 text-white" />
            </div>
            About Me
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {profileData.bio ? (
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-900 leading-relaxed text-base whitespace-pre-wrap">
                {profileData.bio}
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 italic">No bio provided yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience & Rates */}
      <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-green-500 rounded-xl">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            Experience & Rates
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Years of Experience */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-4 w-4 text-gray-600" />
                </div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  Experience
                </p>
              </div>
              <p className="font-bold text-gray-900 text-xl">
                {profileData.yearsExperience || "Not specified"}
              </p>
            </div>

            {/* Asking Rate */}
            {profileData.askingRate && (
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">$</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rate</p>
                    <p className="font-semibold text-gray-800">
                      ${profileData.askingRate} per hour
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Response Time */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="h-4 w-4 text-gray-600" />
              </div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                Response Time
              </p>
            </div>
            <p className="font-bold text-gray-900 text-lg">
              {profileData.responseTime || "Not specified"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Services Offered */}
      <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-orange-500 rounded-xl">
              <Award className="h-5 w-5 text-white" />
            </div>
            Services Offered
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {profileData.servicesOffered &&
          profileData.servicesOffered.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profileData.servicesOffered.map((service, index) => (
                  <div key={index} className="group">
                    <Badge className="bg-gradient-to-r from-[#4A9B9B] to-[#5CAB9B] text-white px-4 py-2 rounded-xl font-medium text-sm w-full justify-center hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                      {service}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 italic">No services specified</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
