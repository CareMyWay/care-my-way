"use client"

import type React from "react"

import { Button } from "@/components/provider-dashboard-ui/button"
import { Badge } from "@/components/provider-dashboard-ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/provider-dashboard-ui/avatar"
import { Bell } from "lucide-react"

interface TopNavProps {
  title: string
  subtitle?: string
  notificationCount?: number
  userName?: string
  userRole?: string
  userAvatar?: string
  onNotificationClick?: () => void
  children?: React.ReactNode
}

export function TopNav({
  title,
  subtitle,
  notificationCount = 0,
  userName = "Dr. Jane Smith",
  userRole = "Physical Therapist",
  userAvatar = "/placeholder.svg?height=40&width=40",
  onNotificationClick,
  children,
}: TopNavProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-h3 font-bold dashboard-text-primary">{title}</h1>
          {subtitle && <p className="dashboard-text-secondary mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative" onClick={onNotificationClick}>
              <Bell className="h-5 w-5 text-teal-700" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </div>
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
      {children}
    </div>
  )
}
