"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/provider-dashboard-ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/provider-dashboard-ui/avatar";
import {
  Calendar,
  MessageSquare,
  User,
  Clock,
  Settings,
  Users,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";

export function SidebarNav() {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: "/provider-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/provider-dashboard/profile",
      label: "Profile",
      icon: User,
    },
    {
      href: "/provider-dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
    {
      href: "/provider-dashboard/schedule",
      label: "Schedule",
      icon: Calendar,
    },
    {
      href: "/provider-dashboard/messages",
      label: "Messages",
      icon: MessageSquare,
      badge: 2,
    },
    {
      href: "/provider-dashboard/appointments",
      label: "Appointments",
      icon: Clock,
    },
    {
      href: "/provider-dashboard/patients",
      label: "My Patients",
      icon: Users,
    },
  ];

  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      return error;
    }
  };

  // const handleSignOut = async () => {
  //   // Example: Clear authentication tokens from localStorage/sessionStorage
  //   localStorage.removeItem("authToken");
  //   sessionStorage.removeItem("authToken");

  //   // Optionally, call your sign out API endpoint if needed
  //   // await fetch("/api/auth/signout", { method: "POST" });

  //   // Redirect to home page
  //   router.push("/");
  // };

  return (
    <nav className="w-64 dashboard-sidebar min-h-screen flex flex-col">
      {/* Profile Section */}
      <div className="p-6 border-b border-teal-700">
        <div className="mb-4">
          <h1 className="text-primary-white text-h5 font-bold">CareMyWay</h1>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src="/placeholder.svg?height=48&width=48"
              alt="Dr. Jane Smith"
            />
            <AvatarFallback className="bg-teal-600 text-white text-lg font-semibold">
              JS
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-medium">Dr. Jane Smith</p>
            <p className="text-teal-200 text-sm">Physical Therapist</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-6">
        <div className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dashboard-sidebar-link flex items-center w-full justify-start h-12 px-4 rounded-md font-medium transition
                  ${isActive ? "dashboard-sidebar-active" : "dashboard-sidebar-hover"}
                `}
                style={{
                  color: "#fff",
                  backgroundColor: isActive
                    ? "var(--color-medium-green)"
                    : "transparent",
                }}
              >
                <Icon className="mr-3 h-5 w-5" color="#fff" />
                <span className="text-base">{item.label}</span>
                {item.badge && (
                  <Badge className="ml-auto bg-orange-500 text-white text-xs px-2 py-1">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sign Out */}
      <div className="p-3 border-t border-teal-700">
        <button
          className="flex items-center w-full justify-start h-12 px-4 rounded-md text-teal-100 hover:bg-teal-700 hover:text-white transition-colors"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-5 w-5" color="#fff" />
          <span className="text-base">Sign Out</span>
        </button>
      </div>
    </nav>
  );
}
