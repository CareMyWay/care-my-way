"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  MapPin,
  Heart,
  Activity,
  Shield,
  Bell,
  Settings,
  Upload,
  Trash2,
  Edit,
  Menu,
  X,
} from "lucide-react";

export default function UserProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("account-settings");

  const navigationItems = [
    {
      category: "GENERAL",
      items: [
        { id: "account-settings", label: "Account Settings", icon: User },
        { id: "personal-info", label: "Personal Information", icon: User },
        { id: "address-info", label: "Address Information", icon: MapPin },
        {
          id: "emergency-support",
          label: "Emergency & Support Person Details",
          icon: Shield,
        },
        { id: "medical-info", label: "Medical Information", icon: Heart },
        {
          id: "functional-cognitive",
          label: "Functional & Cognitive Abilities",
          icon: Activity,
        },
      ],
    },
    {
      category: "SYSTEM",
      items: [
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "preferences", label: "Preferences", icon: Settings },
      ],
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "account-settings":
        return <AccountSettingsContent />;
      case "personal-info":
        return <PersonalInfoContent />;
      case "address-info":
        return <AddressInfoContent />;
      case "emergency-support":
        return <EmergencySupportContent />;
      case "medical-info":
        return <MedicalInfoContent />;
      case "functional-cognitive":
        return <FunctionalCognitiveContent />;
      case "notifications":
        return <NotificationsContent />;
      case "preferences":
        return <PreferencesContent />;
      default:
        return <AccountSettingsContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-teal-600" />
              <span className="font-semibold text-lg">Care My Way</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Health Care Quiz
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Find a Caregiver
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Schedule
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Messages
            </a>
            <a href="#" className="text-teal-600 font-medium">
              Settings
            </a>
          </nav>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
            LOGOUT
          </Button>
        </div>
      </header>

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
        <main className="flex-1 p-4 lg:p-6">{renderContent()}</main>
      </div>
    </div>
  );
}

function AccountSettingsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account information and preferences
        </p>
      </div>

      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="text-lg">JD</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Profile picture</p>
              <p className="text-xs text-gray-500">JPG, GIF or PNG. 1MB max.</p>
              <div className="flex gap-2">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <Upload className="h-4 w-4 mr-2" />
                  UPLOAD NEW PICTURE
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="h-4 w-4 mr-2" />
                  DELETE
                </Button>
              </div>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="James" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Anderson" />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">User Name</Label>
            <Input id="username" placeholder="janderson" />
          </div>

          {/* Birthday and Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <Input id="birthday" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Male" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="james.anderson@gmail.com"
              />
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                CHANGE EMAIL
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="(555) 123-4567" />
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                CHANGE PHONE NUMBER
              </Button>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password (minimum 8 characters)"
            />
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
              CHANGE PASSWORD
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="123 Hunter Drive SW" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Time Zone</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Mountain Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mountain">Mountain Time</SelectItem>
                <SelectItem value="pacific">Pacific Time</SelectItem>
                <SelectItem value="central">Central Time</SelectItem>
                <SelectItem value="eastern">Eastern Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Edit className="h-4 w-4 mr-2" />
            EDIT
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PersonalInfoContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">
            Personal information content would go here...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function AddressInfoContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Address Information</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">
            Address information content would go here...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function EmergencySupportContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Emergency & Support Person Details
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name</Label>
            <Input id="contactName" placeholder="Name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship to Patient</Label>
            <Input id="relationship" placeholder="Relationship" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Phone Number</Label>
            <Input id="emergencyPhone" placeholder="(555) 999-9999" />
          </div>
          <div className="space-y-2">
            <Label>Do you have a Support Person who will represent you?</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Yes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Support Person Information</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="emergency-contact" />
              <Label htmlFor="emergency-contact">
                Same as Emergency Contact
              </Label>
            </div>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Edit className="h-4 w-4 mr-2" />
            EDIT
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function MedicalInfoContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Medical Information</h1>
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your medical history details..."
            className="min-h-[120px]"
          />
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Edit className="h-4 w-4 mr-2" />
            EDIT
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lifestyle & Habits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Dietary Restrictions</Label>
            <Textarea placeholder="Enter dietary restrictions..." />
          </div>
          <div className="space-y-2">
            <Label>Exercise Routine</Label>
            <Textarea placeholder="Describe your exercise routine..." />
          </div>
          <div className="space-y-2">
            <Label>Drug or Alcohol Use</Label>
            <Textarea placeholder="Enter relevant information..." />
          </div>
          <div className="space-y-2">
            <Label>Sleep-related Issues</Label>
            <Textarea placeholder="Describe any sleep issues..." />
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Edit className="h-4 w-4 mr-2" />
            EDIT
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function FunctionalCognitiveContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Functional & Cognitive Abilities
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Mobility Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea placeholder="Describe mobility status..." />
          <div className="space-y-2">
            <Label>Experiences with memory or cognitive issues</Label>
            <Textarea placeholder="Enter relevant information..." />
          </div>
          <div className="space-y-2">
            <Label>Sensory Impairments</Label>
            <Textarea placeholder="Describe any sensory impairments..." />
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Edit className="h-4 w-4 mr-2" />
            EDIT
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationsContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">
            Notification preferences would go here...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function PreferencesContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Preferences</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">User preferences would go here...</p>
        </CardContent>
      </Card>
    </div>
  );
}
