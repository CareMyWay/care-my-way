"use client";

import { useState } from "react";
import { Camera, Save, X, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card";
import { Button } from "@/components/provider-dashboard-ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/provider-dashboard-ui/avatar";
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav";
import Link from "next/link";
// imported bad-words library from npm to filter profanity for specializations
import { Filter } from "bad-words";

const filter = new Filter();

const LANGUAGES = [
  "English", "Spanish", "French", "Mandarin", "Cantonese", "Tagalog", "Hindi", "Punjabi", "German", "Russian", "Arabic", "Portuguese", "Vietnamese", "Korean", "Italian", "Japanese"
];

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@caregivers.com",
    phone: "(555) 123-4567",
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    bio: "Licensed Physical Therapist with 8 years of experience specializing in sports rehabilitation and geriatric care.",
    specializations: ["Physical Therapy", "Sports Rehabilitation", "Geriatric Care"],
    languages: ["English", "Spanish"],
    hourlyRate: "85",
    serviceRadius: "25",
    credentials: [
      "Licensed Physical Therapist (CA)",
      "Board Certified in Orthopedic Physical Therapy",
      "CPR/AED Certified",
    ],
  });

  const [newSpecialization, setNewSpecialization] = useState("");
  const [specialtyError, setSpecialtyError] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [hourlyRateError, setHourlyRateError] = useState("");
  const [bioWordCount, setBioWordCount] = useState(formData.bio.split(/\s+/).filter(Boolean).length);

  const handleInputChange = (field: string, value: string) => {
    if (field === "hourlyRate") {
      // Restrict hourly rate between 20 and 500
      const num = Number(value);
      if (value === "" || (num >= 20 && num <= 500)) {
        setHourlyRateError("");
        setFormData((prev) => ({ ...prev, [field]: value }));
      } else {
        setHourlyRateError("Hourly rate must be between $20 and $500");
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (field === "bio") {
        setBioWordCount(value.split(/\s+/).filter(Boolean).length);
      }
    }
  };

  const addSpecialization = () => {
    if (newSpecialization.trim()) {
      if (filter.isProfane(newSpecialization)) {
        setSpecialtyError("Specialization contains inappropriate language or violence-related terms.");
        return;
      }
      if (newSpecialization.length > 25) {
        setSpecialtyError("Specialization must be 25 characters or less.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()],
      }));
      setNewSpecialization("");
      setSpecialtyError("");
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index),
    }));
  };

  const addLanguage = () => {
    if (newLanguage && !formData.languages.includes(newLanguage)) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage],
      }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    console.log("Saving profile data:", formData);
    // Handle save logic here
  };

  return (
    <>
      <TopNav title="Edit Profile" subtitle="Update your professional information" notificationCount={2} />

      <div className="space-y-6">
        {/* Profile Photo */}
        <Card className="border border-gray-200 bg-white rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold dashboard-text-primary">Profile Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                  <AvatarFallback className="bg-teal-100 text-teal-800 text-2xl">
                    {formData.firstName[0]}
                    {formData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full p-2"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h3 className="font-medium dashboard-text-primary mb-1">
                  Dr. {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-sm dashboard-text-secondary mb-2">Licensed Physical Therapist</p>
                <Button variant="outline" size="sm" className="dashboard-button-secondary">
                  Change Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="border border-gray-200 bg-white rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold dashboard-text-primary">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium dashboard-text-primary mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="w-full p-3 dashboard-input focus:outline-none rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dashboard-text-primary mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="w-full p-3 dashboard-input focus:outline-none rounded-md"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium dashboard-text-primary mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full p-3 dashboard-input focus:outline-none rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dashboard-text-primary mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full p-3 dashboard-input focus:outline-none rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium dashboard-text-primary mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={3}
                className="w-full p-3 dashboard-input focus:outline-none rounded-md resize-none"
                placeholder="Tell patients about your experience and approach..."
              />
              <div className="text-xs text-gray-500 mt-1">{bioWordCount} words</div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="border border-gray-200 bg-white rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold dashboard-text-primary">Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium dashboard-text-primary mb-2">Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full p-3 dashboard-input focus:outline-none rounded-md"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium dashboard-text-primary mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full p-3 dashboard-input focus:outline-none rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dashboard-text-primary mb-2">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full p-3 dashboard-input focus:outline-none rounded-md"
                >
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium dashboard-text-primary mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  className="w-full p-3 dashboard-input focus:outline-none rounded-md"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Details */}
        <Card className="border border-gray-200 bg-white rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold dashboard-text-primary">Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Specializations */}
            <div>
              <label className="block text-sm font-medium dashboard-text-primary mb-2">Specializations</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.specializations.map((spec, index) => (
                  <div
                    key={index}
                    className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {spec}
                    <button onClick={() => removeSpecialization(index)} className="text-teal-600 hover:text-teal-800">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => {
                    setNewSpecialization(e.target.value);
                    setSpecialtyError("");
                  }}
                  placeholder="Add specialization"
                  className="flex-1 p-2 dashboard-input focus:outline-none rounded-md"
                  maxLength={25}
                />
                <Button onClick={addSpecialization} className="dashboard-button-primary text-primary-white">
                  Add
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs ${newSpecialization.length > 25 ? "text-red-500" : "text-gray-500"}`}>
                  {newSpecialization.length}/25
                </span>
                {specialtyError && (
                  <span className="text-xs text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" /> {specialtyError}
                  </span>
                )}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium dashboard-text-primary mb-2">Languages</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {lang}
                    <button onClick={() => removeLanguage(index)} className="text-green-600 hover:text-green-800">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="flex-1 p-2 dashboard-input focus:outline-none rounded-md"
                >
                  <option value="">Select language</option>
                  {LANGUAGES.filter(l => !formData.languages.includes(l)).map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <Button onClick={addLanguage} className="dashboard-button-primary text-primary-white" disabled={!newLanguage}>
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card className="border border-gray-200 bg-white rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold dashboard-text-primary">Service Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium dashboard-text-primary mb-2">Hourly Rate ($)</label>
              <input
                type="number"
                value={formData.hourlyRate}
                min={20}
                max={500}
                onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                className="w-full p-3 dashboard-input focus:outline-none rounded-md"
              />
              {hourlyRateError && (
                <div className="text-xs text-red-600 mt-1">{hourlyRateError}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>


        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Link href="/provider-dashboard/profile">
            <Button variant="outline" className="dashboard-button-secondary px-6">
              Cancel
            </Button>
          </Link>
          <Button onClick={handleSave} className="dashboard-button-primary text-primary-white px-6">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </>
    );
}