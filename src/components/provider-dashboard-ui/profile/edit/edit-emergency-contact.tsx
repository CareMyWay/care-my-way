"use client";

import { AlertTriangle, Phone, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card";
import { type ProviderProfileData } from "@/actions/providerProfileActions";

interface EditEmergencyContactProps {
    profileData: Partial<ProviderProfileData>;
    onUpdate: (updates: Partial<ProviderProfileData>) => void;
}

const RELATIONSHIP_OPTIONS = [
    "Spouse", "Partner", "Parent", "Child", "Sibling", "Friend",
    "Colleague", "Neighbor", "Other Family Member", "Other"
];

export function EditEmergencyContact({ profileData, onUpdate }: EditEmergencyContactProps) {
    return (
        <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
                <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-red-500 rounded-xl">
                        <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    Emergency Contact
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">

                {/* Emergency Contact Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="h-4 w-4 inline mr-1" />
                        Emergency Contact Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={profileData.emergencyContactName || ""}
                        onChange={(e) => onUpdate({ emergencyContactName: e.target.value })}
                        placeholder="John Smith"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Full name of your emergency contact person
                    </p>
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="h-4 w-4 inline mr-1" />
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={profileData.emergencyContactPhone || ""}
                            onChange={(e) => onUpdate({ emergencyContactPhone: e.target.value })}
                            placeholder="(555) 123-4567"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Relationship <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={profileData.emergencyContactRelationship || ""}
                            onChange={(e) => onUpdate({ emergencyContactRelationship: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                            required
                        >
                            <option value="">Select relationship</option>
                            {RELATIONSHIP_OPTIONS.map((relationship) => (
                                <option key={relationship} value={relationship}>
                                    {relationship}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Emergency Contact Information */}
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 rounded-lg mt-1">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-red-900 mb-2">Why We Need This Information</h4>
                            <p className="text-sm text-red-800 mb-3">
                                Your emergency contact is essential for:
                            </p>
                            <ul className="text-sm text-red-800 space-y-1">
                                <li>• Medical emergencies while providing care</li>
                                <li>• Safety incidents during home visits</li>
                                <li>• Professional compliance requirements</li>
                                <li>• Emergency communication when unreachable</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Contact Guidelines */}
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg mt-1">
                            <Phone className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-orange-900 mb-2">Emergency Contact Guidelines</h4>
                            <ul className="text-sm text-orange-800 space-y-1">
                                <li>• Choose someone who is usually available by phone</li>
                                <li>• Ensure they live in Canada or can respond quickly</li>
                                <li>• Inform them they are listed as your emergency contact</li>
                                <li>• Provide them with your work schedule when possible</li>
                                <li>• Update this information if contact details change</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Privacy Note */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg mt-1">
                            <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 mb-2">Privacy & Confidentiality</h4>
                            <p className="text-sm text-blue-800">
                                Emergency contact information is kept strictly confidential and is only accessed
                                in genuine emergency situations. This information is not shared with clients
                                or displayed on your public profile.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Required Fields Note */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">
                        <span className="text-red-500">*</span> Emergency contact information is required for all healthcare providers for safety and compliance reasons
                    </p>
                </div>
            </CardContent>
        </Card>
    );
} 