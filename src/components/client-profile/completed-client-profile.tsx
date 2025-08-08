// app/user/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  User,
  MapPin,
  Shield,
  FolderHeart,
  BrainCircuit,
  PersonStanding,
} from "lucide-react";
import ProfileNotComplete from "./profile-not-complete";

const client = generateClient<Schema>();

export default function CompletedClientProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("personal-info");

  const [profile, setProfile] = useState<
    Schema["ClientProfile"]["type"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const userId = attributes.sub;

        // Query ClientProfile where userId == Cognito sub
        const { data, errors } = await client.models.ClientProfile.list({
          filter: { userId: { eq: userId } },
          selectionSet: [
            "id",
            "firstName",
            "lastName",
            "email",
            "gender",
            "dateOfBirth",
            "address",
            "city",
            "province",
            "postalCode",
            "emergencyContactFirstName",
            "emergencyContactLastName",
            "emergencyContactPhone",
            "hasRepSupportPerson",
            "supportFirstName",
            "supportLastName",
            "supportRelationship",
            "supportContactPhone",
            "medicalConditions",
            "surgeriesOrHospitalizations",
            "chronicIllnesses",
            "allergies",
            "medications",
            "mobilityStatus",
            "cognitiveDifficulties",
            "cognitiveDifficultiesOther",
            "sensoryImpairments",
            "sensoryImpairmentsOther",
            "typicalDay",
            "physicalActivity",
            "dietaryPreferences",
            "sleepHours",
            "hobbies",
            "socialTime",
            "userId",
            "userType",
            "phoneNumber",
            "createdAt",
            "updatedAt",
          ],
        });

        if (errors) {
          console.error("GraphQL errors:", errors);
          setError("Failed to load profile due to server error.");
          return;
        }

        if (data.length > 0) {
          console.log("Loaded profile:", data[0]);
          setProfile(data[0]);
        } else {
          setError("No profile found.");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <Loading />;
  if (error)
    return <div className="text-red-600 p-4">{<ProfileNotComplete />}</div>;

  if (!profile)
    return <div className="text-red-600 p-4">{<ProfileNotComplete />}</div>;

  const navigationItems = [
    {
      category: "MY PROFILE",
      items: [
        { id: "personal-info", label: "Personal", icon: User },
        { id: "address-info", label: "Address", icon: MapPin },
        {
          id: "emergency-support",
          label: "Emergency & Support",
          icon: Shield,
        },
        {
          id: "medical-info",
          label: "Medical History",
          icon: FolderHeart,
        },
        {
          id: "abilities",
          label: "Function & Cognition",
          icon: BrainCircuit,
        },
        {
          id: "lifestyle",
          label: "Lifestyle",
          icon: PersonStanding,
        },
      ],
    },
    // {
    //   category: "SYSTEM",
    //   items: [
    //     { id: "notifications", label: "Notifications", icon: Bell },
    //     { id: "preferences", label: "Preferences", icon: Settings },
    //   ],
    // },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Vertical Top Nav */}
      <div className="lg:hidden px-4 py-2">
        <div className="flex flex-col gap-2">
          {navigationItems.flatMap((section) =>
            section.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm
                ${
                  activeSection === item.id
                    ? "bg-teal-100 text-teal-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })
          )}
        </div>
      </div>
      {/* Sidebar */}
      <aside
        className={`min-h-screen 
    fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
    transform transition-transform duration-200 ease-in-out
    flex flex-col
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `}
      >
        <div className="p-4 pt-20 lg:pt-4">
          {navigationItems.map((section) => (
            <div key={section.category} className="mb-6">
              <h3 className="text-md font-semibold text-darkest-green uppercase tracking-wider mb-3">
                {section.category}
              </h3>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                          w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors
                          ${
                            activeSection === item.id
                              ? "bg-teal-50 text-teal-700 border-r-2 border-teal-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }
                        `}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Mobile Sidebar Toggle Button */}
      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
        {renderContent(activeSection, profile)}
      </main>{" "}
    </div>
  );
}

function renderContent(
  activeSection: string,
  profile: Schema["ClientProfile"]["type"]
) {
  switch (activeSection) {
    case "personal-info":
      return <PersonalInfoContent profile={profile} />;
    case "address-info":
      return <AddressInfoContent profile={profile} />;
    case "emergency-support":
      return <EmergencySupportContent profile={profile} />;
    case "medical-info":
      return <MedicalInfoContent profile={profile} />;
    case "abilities":
      return <AbilitiesInfoContent profile={profile} />;
    case "lifestyle":
      return <LifestyleInfoContent profile={profile} />;
    default:
      return <PersonalInfoContent profile={profile} />;
  }
}

import OrangeButton from "@/components/buttons/orange-button";
import { Button } from "@/components/ui/button";
import Loading from "../ui/loading";

function PersonalInfoContent({
  profile,
}: {
  profile: Schema["ClientProfile"]["type"];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    email: profile.email ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    dateOfBirth: profile.dateOfBirth ?? "",
    gender: profile.gender ?? "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      email: profile.email ?? "",
      phoneNumber: profile.phoneNumber ?? "",
      dateOfBirth: profile.dateOfBirth ?? "",
      gender: profile.gender ?? "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await client.models.ClientProfile.update({
        id: profile.id,
        ...formData,
      });
      setIsEditing(false);
      // Optionally: show a toast
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-darkest-green">Personal</h1>
      <Card className="border-1 drop-shadow-sm border-medium-green  rounded-lg">
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="flex gap-2 mt-4">
            {isEditing ? (
              <>
                <OrangeButton variant="action" onClick={handleSave}>
                  Save
                </OrangeButton>
                <Button variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <OrangeButton variant="action" onClick={() => setIsEditing(true)}>
                Edit
              </OrangeButton>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AddressInfoContent({
  profile,
}: {
  profile: Schema["ClientProfile"]["type"];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: profile.address ?? "",
    city: profile.city ?? "",
    province: profile.province ?? "",
    postalCode: profile.postalCode ?? "",
  });
  const addressLabels: Record<string, string> = {
    address: "Street Address",
    city: "City",
    province: "Province",
    postalCode: "Postal Code",
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({
      address: profile.address ?? "",
      city: profile.city ?? "",
      province: profile.province ?? "",
      postalCode: profile.postalCode ?? "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await client.models.ClientProfile.update({
        id: profile.id,
        ...formData,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update address", err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-darkest-green">Address</h1>
      <Card className="border-1 drop-shadow-sm border-medium-green  rounded-lg">
        <CardContent className="space-y-4 p-6">
          {["address", "city", "province", "postalCode"].map((field) => (
            <div key={field}>
              <Label htmlFor={addressLabels[field]}>
                {addressLabels[field]}
              </Label>
              <Input
                id={field}
                value={formData[field as keyof typeof formData]}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={!isEditing}
              />
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            {isEditing ? (
              <>
                <OrangeButton variant="action" onClick={handleSave}>
                  Save
                </OrangeButton>
                <Button variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <OrangeButton variant="action" onClick={() => setIsEditing(true)}>
                Edit
              </OrangeButton>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmergencySupportContent({
  profile,
}: {
  profile: Schema["ClientProfile"]["type"];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    emergencyContactFirstName: profile.emergencyContactFirstName ?? "",
    emergencyContactLastName: profile.emergencyContactLastName ?? "",
    emergencyContactPhone: profile.emergencyContactPhone ?? "",
    supportFirstName: profile.supportFirstName ?? "",
    supportLastName: profile.supportLastName ?? "",
    supportRelationship: profile.supportRelationship ?? "",
    supportContactPhone: profile.supportContactPhone ?? "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({
      emergencyContactFirstName: profile.emergencyContactFirstName ?? "",
      emergencyContactLastName: profile.emergencyContactLastName ?? "",
      emergencyContactPhone: profile.emergencyContactPhone ?? "",
      supportFirstName: profile.supportFirstName ?? "",
      supportLastName: profile.supportLastName ?? "",
      supportRelationship: profile.supportRelationship ?? "",
      supportContactPhone: profile.supportContactPhone ?? "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await client.models.ClientProfile.update({
        id: profile.id,
        ...formData,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update emergency/support contact", err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-darkest-green">
        Emergency & Support
      </h1>
      <Card className="border-1 drop-shadow-sm border-medium-green  rounded-lg">
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="emergencyContactFirstName">First Name</Label>
            <Input
              id="emergencyContactFirstName"
              value={formData.emergencyContactFirstName}
              onChange={(e) =>
                handleChange("emergencyContactFirstName", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="emergencyContactLastName">Last Name</Label>
            <Input
              id="emergencyContactLastName"
              value={formData.emergencyContactLastName}
              onChange={(e) =>
                handleChange("emergencyContactLastName", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="emergencyContactPhone">Phone</Label>
            <Input
              id="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={(e) =>
                handleChange("emergencyContactPhone", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>

          {profile.hasRepSupportPerson && (
            <>
              <h1 className="text-lg font-semibold mt-4  text-darkest-green">
                Support Person
              </h1>
              <div>
                <Label htmlFor="supportFirstName">First Name</Label>
                <Input
                  id="supportFirstName"
                  value={formData.supportFirstName}
                  onChange={(e) =>
                    handleChange("supportFirstName", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="supportLastName">Last Name</Label>
                <Input
                  id="supportLastName"
                  value={formData.supportLastName}
                  onChange={(e) =>
                    handleChange("supportLastName", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="supportRelationship">Relationship</Label>
                <Input
                  id="supportRelationship"
                  value={formData.supportRelationship}
                  onChange={(e) =>
                    handleChange("supportRelationship", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="supportContactPhone">Phone</Label>
                <Input
                  id="supportContactPhone"
                  value={formData.supportContactPhone}
                  onChange={(e) =>
                    handleChange("supportContactPhone", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
            </>
          )}

          <div className="flex gap-2 mt-4">
            {isEditing ? (
              <>
                <OrangeButton variant="action" onClick={handleSave}>
                  Save
                </OrangeButton>
                <Button variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <OrangeButton variant="action" onClick={() => setIsEditing(true)}>
                Edit
              </OrangeButton>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MedicalInfoContent({
  profile,
}: {
  profile: Schema["ClientProfile"]["type"];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    medicalConditions: profile.medicalConditions ?? "",
    surgeriesOrHospitalizations: profile.surgeriesOrHospitalizations ?? "",
    chronicIllnesses: profile.chronicIllnesses ?? "",
    allergies: profile.allergies ?? "",
    medications: profile.medications ?? "",
  });
  const medicalLabels: Record<string, string> = {
    medicalConditions: "Medical Conditions",
    surgeriesOrHospitalizations: "Surgeries/Hospitalizations",
    chronicIllnesses: "Chronic Illnesses",
    allergies: "Allergies",
    medications: "Medications",
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({
      medicalConditions: profile.medicalConditions ?? "",
      surgeriesOrHospitalizations: profile.surgeriesOrHospitalizations ?? "",
      chronicIllnesses: profile.chronicIllnesses ?? "",
      allergies: profile.allergies ?? "",
      medications: profile.medications ?? "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await client.models.ClientProfile.update({
        id: profile.id,
        ...formData,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update address", err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-darkest-green">Medical History</h1>
      <Card className="border-1 drop-shadow-sm border-medium-green  rounded-lg">
        <CardContent className="space-y-4 p-6">
          {[
            "medicalConditions",
            "surgeriesOrHospitalizations",
            "chronicIllnesses",
            "allergies",
            "medications",
          ].map((field) => (
            <div key={field}>
              <Label htmlFor={medicalLabels[field]}>
                {medicalLabels[field]}
              </Label>
              <Input
                id={field}
                value={formData[field as keyof typeof formData]}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={!isEditing}
              />
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            {isEditing ? (
              <>
                <OrangeButton variant="action" onClick={handleSave}>
                  Save
                </OrangeButton>
                <Button variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <OrangeButton variant="action" onClick={() => setIsEditing(true)}>
                Edit
              </OrangeButton>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
function AbilitiesInfoContent({
  profile,
}: {
  profile: Schema["ClientProfile"]["type"];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    mobilityStatus: profile.mobilityStatus ?? "",
    cognitiveDifficulties: profile.cognitiveDifficulties ?? "",
    cognitiveDifficultiesOther: profile.cognitiveDifficultiesOther ?? "",
    sensoryImpairments: profile.sensoryImpairments ?? "",
    sensoryImpairmentsOther: profile.sensoryImpairmentsOther ?? "",
  });
  const abilitiesLabels: Record<string, string> = {
    mobilityStatus: "Mobility Status",
    cognitiveDifficulties: "Cognitive Difficulties",
    cognitiveDifficultiesOther: "Other Cognitive Difficulties ",
    sensoryImpairments: "Sensory Impairments",
    sensoryImpairmentsOther: "Other Sensory Impairments",
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({
      mobilityStatus: profile.mobilityStatus ?? "",
      cognitiveDifficulties: profile.cognitiveDifficulties ?? "",
      cognitiveDifficultiesOther: profile.cognitiveDifficultiesOther ?? "",
      sensoryImpairments: profile.sensoryImpairments ?? "",
      sensoryImpairmentsOther: profile.sensoryImpairmentsOther ?? "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await client.models.ClientProfile.update({
        id: profile.id,
        ...formData,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update address", err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-darkest-green">
        Functional & Cognitive Abilities
      </h1>
      <Card className="border-1 drop-shadow-sm border-medium-green  rounded-lg">
        <CardContent className="space-y-4 p-6">
          {[
            "mobilityStatus",
            "cognitiveDifficulties",
            "cognitiveDifficultiesOther",
            "sensoryImpairments",
            "sensoryImpairmentsOther",
          ].map((field) => (
            <div key={field}>
              <Label htmlFor={abilitiesLabels[field]}>
                {abilitiesLabels[field]}
              </Label>
              <Input
                id={field}
                value={formData[field as keyof typeof formData]}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={!isEditing}
              />
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            {isEditing ? (
              <>
                <OrangeButton variant="action" onClick={handleSave}>
                  Save
                </OrangeButton>
                <Button variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <OrangeButton variant="action" onClick={() => setIsEditing(true)}>
                Edit
              </OrangeButton>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
function LifestyleInfoContent({
  profile,
}: {
  profile: Schema["ClientProfile"]["type"];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    typicalDay: profile.typicalDay ?? "",
    physicalActivity: profile.physicalActivity ?? "",
    dietaryPreferences: profile.dietaryPreferences ?? "",
    sleepHours: profile.sleepHours ?? "",
    hobbies: profile.hobbies ?? "",
    socialTime: profile.socialTime ?? "",
  });
  const lifestyleLabels: Record<string, string> = {
    typicalDay: "Typical Day",
    physicalActivity: "Physical Activity",
    dietaryPreferences: "Dietary Preferences",
    sleepHours: "Sleep Hours",
    hobbies: "Hobbies",
    socialTime: "Social Time",
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({
      typicalDay: profile.typicalDay ?? "",
      physicalActivity: profile.physicalActivity ?? "",
      dietaryPreferences: profile.dietaryPreferences ?? "",
      sleepHours: profile.sleepHours ?? "",
      hobbies: profile.hobbies ?? "",
      socialTime: profile.socialTime ?? "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await client.models.ClientProfile.update({
        id: profile.id,
        ...formData,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update address", err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-darkest-green">Lifestyle</h1>
      <Card className="border-1 drop-shadow-sm border-medium-green  rounded-lg">
        <CardContent className="space-y-4 p-6">
          {[
            "typicalDay",
            "physicalActivity",
            "dietaryPreferences",
            "sleepHours",
            "hobbies",
            "socialTime",
          ].map((field) => (
            <div key={field}>
              <Label htmlFor={lifestyleLabels[field]}>
                {lifestyleLabels[field]}
              </Label>
              <Input
                id={field}
                value={formData[field as keyof typeof formData]}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={!isEditing}
              />
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            {isEditing ? (
              <>
                <OrangeButton variant="action" onClick={handleSave}>
                  Save
                </OrangeButton>
                <Button variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <OrangeButton variant="action" onClick={() => setIsEditing(true)}>
                Edit
              </OrangeButton>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
