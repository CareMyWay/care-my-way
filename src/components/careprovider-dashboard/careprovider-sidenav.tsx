"use client"

import GreenButton from "@/components/buttons/green-button";
import OrangeButton from "@/components/buttons/orange-button";
import { Badge } from "@/components/careprovider-dashboard/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/careprovider-dashboard/avatar";
import { Calendar, MessageSquare, User, Clock, Settings, Users, LogOut } from "lucide-react";

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadMessages: number;
}

export function SidebarNav({ activeTab, onTabChange, unreadMessages }: SidebarNavProps) {
  const navigationItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: Calendar,
    },
    {
      id: "profile",
      label: "Manage Profile",
      icon: User,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: Calendar,
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: Clock,
    },
    {
      id: "patients",
      label: "My Patients",
      icon: Users,
    },
  ];

  const handleSignOut = () => {
    // Handle sign out logic
    console.log("Sign out clicked");
  };

  return (
    <nav className="w-64 dashboard-sidebar min-h-screen flex flex-col bg-darkest-green">
      {/* Profile Section */}
      <div className="p-6 border-b border-teal-700">
        <div className="mb-4">
          <h1 className="text-primary-white text-h5 font-bold">CareMyWay</h1>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Dr. Jane Smith" />
            <AvatarFallback className="bg-teal-600 text-white text-lg font-semibold">JS</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-medium">Dr. Jane Smith</p>
            <p className="text-teal-200 text-sm">Physical Therapist</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-6">
        <div className="space-y-2 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            // Use OrangeButton for "Appointments", GreenButton for others
            if (item.id === "appointments") {
              return (
                <OrangeButton
                  key={item.id}
                  variant="action"
                  href="#"
                  className={`w-full flex items-center justify-start h-12 px-4 font-medium ${
                    isActive
                      ? "bg-orange-600 text-white"
                      : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  }`}
                  onClick={() => onTabChange(item.id)}
                  label={
                    <span className="flex items-center w-full">
                      <Icon className="mr-3 h-5 w-5" />
                      <span className="text-base">{item.label}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-orange-500 text-white text-xs px-2 py-1">{item.badge}</Badge>
                      )}
                    </span>
                  }
                />
              );
            } else {
              return (
                <GreenButton
                  key={item.id}
                  href="#"
                  variant={isActive ? "route" : "action"}
                  className={`w-full flex items-center justify-start h-12 px-4 font-medium ${
                    isActive
                      ? "bg-medium-green text-white"
                      : "bg-transparent text-green-700 hover:bg-medium-green/10"
                  }`}
                  onClick={() => onTabChange(item.id)}
                  label={
                    <span className="flex items-center w-full">
                      <Icon className="mr-3 h-5 w-5" />
                      <span className="text-base">{item.label}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-orange-500 text-white text-xs px-2 py-1">{item.badge}</Badge>
                      )}
                    </span>
                  }
                />
              );
            }
          })}
        </div>
      </div>

      {/* Sign Out */}
      <div className="p-3 border-t border-teal-700">
        <GreenButton
          variant="action"
          href="#"
          className="w-full flex items-center justify-start h-12 px-4 text-teal-100 hover:bg-teal-700 hover:text-white"
          onClick={handleSignOut}
          label={
            <span className="flex items-center w-full">
              <LogOut className="mr-3 h-5 w-5" />
              <span className="text-base">Sign Out</span>
            </span>
          }
        />
      </div>
      </nav>
    );
  }