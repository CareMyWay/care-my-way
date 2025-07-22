"use client";

import { User, Phone, Mail, Calendar, Users, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card";
import { Button } from "@/components/provider-dashboard-ui/button";
import { type ProviderProfileData } from "@/actions/providerProfileActions";
import { useState } from "react";
import ISO6391 from "iso-639-1";

interface EditPersonalInfoProps {
    profileData: Partial<ProviderProfileData>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onUpdate: (updates: Partial<ProviderProfileData>) => void;
}

// Get comprehensive list of languages from ISO 639-1 standard
const LANGUAGES = [...ISO6391.getAllNames().sort(), "Other"];

const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];
const CONTACT_METHODS = ["Phone Call", "Text Message", "Email", "Video Call", "Any method"];

export function EditPersonalInfo({ profileData, onUpdate }: EditPersonalInfoProps) {
    const [newLanguage, setNewLanguage] = useState("");

    const addLanguage = () => {
        if (newLanguage && !profileData.languages?.includes(newLanguage)) {
            const updatedLanguages = [...(profileData.languages || []), newLanguage];
            onUpdate({ languages: updatedLanguages });
            setNewLanguage("");
        }
    };

    const removeLanguage = (index: number) => {
        const updatedLanguages = profileData.languages?.filter((_, i) => i !== index) || [];
        onUpdate({ languages: updatedLanguages });
    };

    return (
        <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-blue-500 rounded-xl">
                        <User className="h-5 w-5 text-white" />
                    </div>
                    Personal Information
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={profileData.firstName || ""}
                            onChange={(e) => onUpdate({ firstName: e.target.value })}
                            placeholder="Enter your first name"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={profileData.lastName || ""}
                            onChange={(e) => onUpdate({ lastName: e.target.value })}
                            placeholder="Enter your last name"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            required
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail className="h-4 w-4 inline mr-1" />
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={profileData.email || ""}
                            onChange={(e) => onUpdate({ email: e.target.value })}
                            placeholder="your.email@example.com"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="h-4 w-4 inline mr-1" />
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={profileData.phone || ""}
                            onChange={(e) => onUpdate({ phone: e.target.value })}
                            placeholder="(555) 123-4567"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            required
                        />
                    </div>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            value={profileData.dob || ""}
                            onChange={(e) => onUpdate({ dob: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                        </label>
                        <select
                            value={profileData.gender || ""}
                            onChange={(e) => onUpdate({ gender: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        >
                            <option value="">Select gender</option>
                            {GENDER_OPTIONS.map((gender) => (
                                <option key={gender} value={gender}>{gender}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Preferred Contact Method */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Contact Method
                    </label>
                    <select
                        value={profileData.preferredContact || ""}
                        onChange={(e) => onUpdate({ preferredContact: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    >
                        <option value="">Select preferred method</option>
                        {CONTACT_METHODS.map((method) => (
                            <option key={method} value={method}>{method}</option>
                        ))}
                    </select>
                    <p className="mt-2 text-sm text-gray-500">
                        How would you prefer clients to contact you initially?
                    </p>
                </div>

                {/* Languages */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users className="h-4 w-4 inline mr-1" />
                        Languages Spoken
                    </label>

                    {/* Current Languages */}
                    {profileData.languages && profileData.languages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {profileData.languages.map((lang, index) => (
                                <div
                                    key={index}
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                >
                                    {lang}
                                    <button
                                        onClick={() => removeLanguage(index)}
                                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Language */}
                    <div className="flex gap-2">
                        <select
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        >
                            <option value="">Select a language</option>
                            {LANGUAGES.filter(lang => !profileData.languages?.includes(lang)).map((lang) => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                        <Button
                            onClick={addLanguage}
                            disabled={!newLanguage}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                        >
                            Add
                        </Button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                        Select all languages you can speak fluently with clients
                    </p>
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Bio
                    </label>
                    <textarea
                        value={profileData.bio || ""}
                        onChange={(e) => onUpdate({ bio: e.target.value })}
                        rows={4}
                        placeholder="Tell clients about your experience, approach, and what makes you special as a healthcare provider..."
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gray-500">
                            This appears on your profile to help clients understand your background
                        </p>
                        <span className="text-sm text-gray-400">
                            {profileData.bio?.split(/\s+/).filter(Boolean).length || 0} words
                        </span>
                    </div>
                </div>

                {/* Required Fields Note */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">
                        <span className="text-red-500">*</span> Required fields must be completed for your profile to be visible to clients
                    </p>
                </div>
            </CardContent>
        </Card>
    );
} 