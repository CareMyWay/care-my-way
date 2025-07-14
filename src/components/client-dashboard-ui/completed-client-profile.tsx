// app/user/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import OrangeButton from "@/components/buttons/orange-button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  User,
  MapPin,
  Shield,
  // Bell,
  // Settings,
  // Upload,
  // Trash2,
  // Edit,
} from "lucide-react";

const client = generateClient<Schema>();

export default function CompletedClientProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("account-settings");

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
            "userId",
            "userType",
            "phoneNumber",
            "createdAt",
            "updatedAt",
          ],
        });

        if (errors) throw new Error("GraphQL error");
        setProfile(data?.[0] ?? null);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <div className="text-xl p-10">Loading profile...</div>;
  if (error || !profile)
    return (
      <div className="text-red-600 p-4">{error || "Profile not found."}</div>
    );

  const navigationItems = [
    {
      category: "GENERAL",
      items: [
        // { id: "account-settings", label: "Account Settings", icon: User },
        { id: "personal-info", label: "Personal", icon: User },
        { id: "address-info", label: "Address", icon: MapPin },
        {
          id: "emergency-support",
          label: "Emergency & Support",
          icon: Shield,
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
    <div className="min-h-screen bg-gray-50">
      {/* <div className="flex max-w-7xl mx-auto ">
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="p-4 pt-20 lg:pt-4">
            {navigationItems.map((section) => (
              <div key={section.category} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {section.category}
                </h3>
                <nav className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors
                          ${
                            activeSection === item.id
                              ? "bg-teal-50 text-teal-700 border-r-2 border-teal-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-4 lg:p-6">
          {renderContent(activeSection, profile)}
        </main>
      </div>
    </div> */}
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside
          className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="p-4 pt-20 lg:pt-4">
            {navigationItems.map((section) => (
              <div key={section.category} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
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
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {renderContent(activeSection, profile)}
        </main>{" "}
      </div>
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
    default:
      return <PersonalInfoContent profile={profile} />;
  }
}

function PersonalInfoContent({
  profile,
}: {
  profile: Schema["ClientProfile"]["type"];
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-darkest-green">
        Profile Information
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue={profile.firstName ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue={profile.lastName ?? ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={profile.email ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Phone Number</Label>
            <Input id="phoneNumber" defaultValue={profile.phoneNumber ?? ""} />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="date"
              type="date"
              defaultValue={profile.dateOfBirth ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              type="gender"
              defaultValue={profile.gender ?? ""}
            />
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
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-darkest-green">
        Address Information
      </h1>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <Label htmlFor="Address">Address</Label>
            <Input defaultValue={profile.address ?? ""} placeholder="Address" />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input defaultValue={profile.city ?? ""} placeholder="City" />
          </div>
          <div>
            <Label htmlFor="province">Province</Label>
            <Input
              defaultValue={profile.province ?? ""}
              placeholder="Province"
            />
          </div>
          <div>
            <Label htmlFor="PostalCode">Postal Code</Label>

            <Input
              defaultValue={profile.postalCode ?? ""}
              placeholder="Postal Code"
            />
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
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-darkest-green">
        Emergency & Support Person Details
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="emergencyContactFirstName">First Name</Label>
            <Input
              defaultValue={profile.emergencyContactFirstName ?? ""}
              placeholder="First Name"
            />
          </div>
          <div>
            <Label htmlFor="emergencyContactLastName">Last Name</Label>
            <Input
              defaultValue={profile.emergencyContactLastName ?? ""}
              placeholder="Last Name"
            />
          </div>
          <div>
            <Label htmlFor="emergencyRelationship">Relationship</Label>
            <Input
              defaultValue={profile.emergencyContactPhone ?? ""}
              placeholder="Phone"
            />
          </div>
          {profile.hasRepSupportPerson && (
            <>
              <h3 className="text-lg font-semibold mt-4">Support Person</h3>
              <div>
                <Label htmlFor="supportFirstName">First Name</Label>
                <Input
                  defaultValue={profile.supportFirstName ?? ""}
                  placeholder="First Name"
                />
              </div>
              <div>
                <Label htmlFor="supportLastName">Last Name</Label>
                <Input
                  defaultValue={profile.supportLastName ?? ""}
                  placeholder="Last Name"
                />
              </div>
              <div>
                <Label htmlFor="supportRelationship">Relationship</Label>
                <Input
                  defaultValue={profile.supportRelationship ?? ""}
                  placeholder="Relationship"
                />
              </div>
              <div>
                <Label htmlFor="supportContactPhone">Phone</Label>
                <Input
                  defaultValue={profile.supportContactPhone ?? ""}
                  placeholder="Phone"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
