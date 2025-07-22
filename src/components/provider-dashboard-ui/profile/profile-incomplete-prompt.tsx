"use client";

import { AlertCircle, FileText, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ProfileIncompletePrompt() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <Card className="border-2 border-dashed border-gray-300 bg-white shadow-xl">
          <CardContent className="text-center p-12">
            <div className="w-32 h-32 bg-gradient-to-br from-[#4A9B9B] via-[#5CAB9B] to-[#6CBB9B] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <FileText className="h-16 w-16 text-white" />
            </div>

            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Complete Your Profile
              </h2>

              <p className="text-gray-600 text-xl mb-8 leading-relaxed">
                Your professional profile is not yet complete. Setting up your
                profile helps clients find and connect with you based on your
                services, experience, and credentials.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
                <div className="flex items-start justify-center">
                  <AlertCircle className="h-6 w-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="font-semibold text-blue-900 text-lg mb-3">
                      What you&apos;ll add:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-blue-800">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>Personal and contact information</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>Professional summary and services</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>Credentials and work experience</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>Emergency contact details</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link href="/provider-dashboard/to-dos/complete-profile">
                  <Button className="dashboard-button-primary text-primary-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Complete Profile Now
                  </Button>
                </Link>
                <Link href="/provider-dashboard">
                  <Button
                    variant="outline"
                    className="dashboard-button-secondary px-10 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
                  >
                    Return to Dashboard
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">
                  This will take about 5-10 minutes to complete
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
