"use client"

import GreenButton from "@/components/buttons/green-button";
import OrangeButton from "@/components/buttons/orange-button";
import { Badge } from "@/components/careprovider-dashboard/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/careprovider-dashboard/avatar";
import { Bell } from "lucide-react";

interface TopNavProps {
  title: string;
  notificationCount: number;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  onNotificationClick?: () => void;
  onActionClick?: () => void;
  actionLabel?: string;
  useOrangeAction?: boolean;
}

export function TopNav({
  title,
  notificationCount,
  userName = "Dr. Jane Smith",
  userRole = "Physical Therapist",
  userAvatar = "/placeholder.svg?height=40&width=40",
  onNotificationClick,
  onActionClick,
  actionLabel,
  useOrangeAction = false,
}: TopNavProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-h3 font-bold dashboard-text-primary">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          {/* Notification Button */}
          <button
            type="button"
            className="relative focus:outline-none"
            onClick={onNotificationClick}
            aria-label="Notifications"
          >
            <GreenButton variant="action" className="p-2" label="" href="#" />
            <Bell className="h-5 w-5 text-teal-700 absolute inset-0 m-auto pointer-events-none" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
                {notificationCount}
              </Badge>
            )}
          </button>
        </div>
        {/* Optional Action Button */}
        {actionLabel && (
          useOrangeAction ? (
            <OrangeButton label={actionLabel} variant="route" href="#" />
          ) : (
            onActionClick && <GreenButton onClick={onActionClick} label={actionLabel} variant="action" href="#" />
          )
        )}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-teal-800 font-medium block">Welcome, {userName}</span>
            {userRole && <span className="text-teal-600 text-sm block">{userRole}</span>}
          </div>
          <Avatar>
            <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
            <AvatarFallback className="bg-teal-600 text-white font-semibold">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default TopNav;