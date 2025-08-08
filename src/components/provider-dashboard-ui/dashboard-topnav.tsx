"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Info, MessageSquare, Menu } from "lucide-react";

interface NavTab {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface TopNavProps {
  title: string;
  subtitle?: string;
  notificationCount?: number;
  onNotificationClick?: () => void;
  onInfoClick?: () => void;
  children?: React.ReactNode;
  tabs?: NavTab[];
  showClientTabs?: boolean;
  showMobileMenu?: boolean;
  onMobileMenuClick?: () => void;
}

export function TopNav({
  title,
  subtitle,
  notificationCount = 0,
  onNotificationClick,
  onInfoClick,
  children,
  tabs,
  showClientTabs = false,
  showMobileMenu = false,
  onMobileMenuClick,
}: TopNavProps) {
  const pathname = usePathname();

  // Default client dashboard tabs
  const defaultClientTabs: NavTab[] = [
    {
      href: "/client-dashboard",
      label: "Dashboard",
    },
    {
      href: "/client-dashboard/profile",
      label: "Profile",
    },
    {
      href: "/client-dashboard/messages",
      label: "Messages",
      icon: MessageSquare,
      badge: 2, // This should be dynamic based on actual unread count
    },
  ];

  const displayTabs = tabs || (showClientTabs ? defaultClientTabs : []);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          {showMobileMenu && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMobileMenuClick}
            >
              <Menu className="h-5 w-5 text-teal-700" />
            </Button>
          )}
          <div className="lg:ml-0 ml-0">
            <h1
              className="font-bold dashboard-text-primary"
              style={{ fontSize: "var(--text-h4-size)" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="dashboard-text-secondary mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onNotificationClick}
          >
            <Bell className="h-5 w-5 text-teal-700" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
                {notificationCount}
              </Badge>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onInfoClick}
          >
            <Info className="h-5 w-5 text-teal-700" />
          </Button>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      {displayTabs.length > 0 && (
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {displayTabs.map((tab) => {
              const isActive = pathname === tab.href;
              const Icon = tab.icon;
              
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4 mr-2" />}
                  {tab.label}
                  {tab.badge && tab.badge > 0 && (
                    <Badge className="ml-2 bg-orange-500 text-white text-xs px-2 py-1">
                      {tab.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
      
      {children}
    </div>
  );
}
