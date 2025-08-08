"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  MessageSquare,
  User,
  Clock,
  //Settings,
  Users,
  LogOut,
  Menu,
  X,
  //LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { getProviderProfile } from "@/actions/providerProfileActions";

interface ProviderInfo {
  firstName: string;
  lastName: string;
  profileTitle?: string;
  profilePhoto?: string;
  username?: string;
}

export function SidebarNav({ isTopNavOpen = false }: { isTopNavOpen?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch provider information
  useEffect(() => {
    const fetchProviderInfo = async () => {
      try {
        const user = await getCurrentUser();
        console.log("Current user:", user);
        
        // Use getProviderProfile with userId instead of getProviderProfileById
        const providerProfile = await getProviderProfile(user.userId);
        console.log("Provider profile:", providerProfile);
        
        if (providerProfile && (providerProfile.firstName || providerProfile.lastName)) {
          console.log("Found provider profile with name data");
          setProviderInfo({
            firstName: providerProfile.firstName || "",
            lastName: providerProfile.lastName || "",
            profileTitle: providerProfile.profileTitle || "",
            profilePhoto: providerProfile.profilePhoto || "",
            username: user.username || "",
          });
        } else {
          console.log("No provider profile found or no name data, using fallback");
          // Fallback to username if no profile found
          setProviderInfo({
            firstName: user.username || "Provider",
            lastName: "",
            username: user.username || "",
          });
        }
      } catch (error) {
        console.error("Error fetching provider info:", error);
        // Fallback data
        setProviderInfo({
          firstName: "Provider",
          lastName: "",
          username: "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProviderInfo();
  }, []);

  // Helper function to generate initials
  const getInitials = (firstName: string, lastName: string, username?: string): string => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    } else if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return "P";
  };

  // Helper function to format display name
  const getDisplayName = (firstName: string, lastName: string, username?: string): string => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (username) {
      return username;
    }
    return "Provider";
  };

  const navigationItems = [
    // {
    //   href: "/provider-dashboard",
    //   label: "Dashboard",
    //   icon: LayoutDashboard,
    // },
    {
      href: "/provider-dashboard/profile",
      label: "Profile",
      icon: User,
    },
    // {
    //   href: "/provider-dashboard/settings",
    //   label: "Settings",
    //   icon: Settings,
    // },
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

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      return error;
    }
  };

  // Close mobile menu when clicking on a link
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className={`lg:hidden fixed left-0 z-30 bg-teal-600 text-white p-2 rounded-r-md shadow-lg transition-all duration-300 ${
          isTopNavOpen ? "top-32" : "top-16"
        }`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <span className="sr-only">Close menu</span>
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={`
        fixed lg:relative z-40
        w-64 dashboard-sidebar flex flex-col
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "top-16 h-[calc(100vh-4rem)]" : "top-0 min-h-screen lg:min-h-screen"}
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Close button for mobile - positioned at top right of sidebar */}
        {isMobileMenuOpen && (
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-teal-200 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        )}
        
        {/* Profile Section */}
        <div className={`p-6 border-b border-teal-700 ${isMobileMenuOpen ? "pt-2" : ""}`}>
        {/* <div className="mb-4">
          <h1 className="text-primary-white text-h5 font-bold">CareMyWay</h1>
        </div> */}
        {loading ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-teal-600 text-white text-lg font-semibold animate-pulse">
                ...
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium">Loading...</p>
              <p className="text-teal-200 text-sm">Please wait</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={providerInfo?.profilePhoto || "/placeholder.svg?height=48&width=48"}
                alt={getDisplayName(providerInfo?.firstName || "", providerInfo?.lastName || "", providerInfo?.username)}
              />
              <AvatarFallback className="bg-teal-600 text-white text-lg font-semibold">
                {getInitials(providerInfo?.firstName || "", providerInfo?.lastName || "", providerInfo?.username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium">
                {getDisplayName(providerInfo?.firstName || "", providerInfo?.lastName || "", providerInfo?.username)}
              </p>
              <p className="text-teal-200 text-sm">
                {providerInfo?.profileTitle || "Healthcare Provider"}
              </p>
            </div>
          </div>
        )}
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
                onClick={handleLinkClick}
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
    </>
  );
}
