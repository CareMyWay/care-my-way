"use client"

import type React from "react"

import { Button } from "@/components/provider-dashboard-ui/button"
import { Badge } from "@/components/provider-dashboard-ui/badge"
import { Bell, Info } from "lucide-react"

interface TopNavProps {
  title: string
  subtitle?: string
  notificationCount?: number
  onNotificationClick?: () => void
  onInfoClick?: () => void
  children?: React.ReactNode
}

export function TopNav({
  title,
  subtitle,
  notificationCount = 0,
  onNotificationClick,
  onInfoClick,
  children,
}: TopNavProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1
            className="font-bold dashboard-text-primary"
            style={{ fontSize: "var(--text-h4-size)" }} 
          >
            {title}
          </h1>
          {subtitle && <p className="dashboard-text-secondary mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative" onClick={onNotificationClick}>
            <Bell className="h-5 w-5 text-teal-700" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
                {notificationCount}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={onInfoClick}>
            <Info className="h-5 w-5 text-teal-700" />
          </Button>
        </div>
      </div>
      {children}
    </div>
  )
}
