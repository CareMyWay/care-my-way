"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Clock, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card"
import { Button } from "@/components/provider-dashboard-ui/button"
import { Badge } from "@/components/provider-dashboard-ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/provider-dashboard-ui/avatar"
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav"

interface Appointment {
  id: string
  patientName: string
  patientAvatar?: string
  service: string
  date: string
  time: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  type: "one-time" | "recurring"
  location: string
  notes?: string
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month")

  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "Emma Wilson",
      patientAvatar: "/placeholder.svg?height=40&width=40",
      service: "Physical Therapy",
      date: "2025-01-15",
      time: "9:00 AM",
      status: "confirmed",
      type: "recurring",
      location: "Patient Home",
      notes: "Focus on mobility exercises",
    },
    {
      id: "2",
      patientName: "Robert Davis",
      service: "Nursing Care",
      date: "2025-01-15",
      time: "2:00 PM",
      status: "confirmed",
      type: "one-time",
      location: "Care My Way Clinic",
      notes: "Post-surgery care assessment",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <>
      <TopNav title="Schedule" notificationCount={2}>
        <div className="flex gap-2">
          <Button variant="outline" className="dashboard-button-secondary">
            Today
          </Button>
          <Button className="dashboard-button-primary text-primary-white">+ New Appointment</Button>
        </div>
      </TopNav>

      {/* Calendar */}
      <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate)
                  if (calendarView === "month") {
                    newDate.setMonth(newDate.getMonth() - 1)
                  } else if (calendarView === "week") {
                    newDate.setDate(newDate.getDate() - 7)
                  } else {
                    newDate.setDate(newDate.getDate() - 1)
                  }
                  setCurrentDate(newDate)
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-xl font-semibold dashboard-text-primary">
                {calendarView === "month" &&
                  currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                {calendarView === "week" &&
                  `Week of ${currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                {calendarView === "day" &&
                  currentDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate)
                  if (calendarView === "month") {
                    newDate.setMonth(newDate.getMonth() + 1)
                  } else if (calendarView === "week") {
                    newDate.setDate(newDate.getDate() + 7)
                  } else {
                    newDate.setDate(newDate.getDate() + 1)
                  }
                  setCurrentDate(newDate)
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={calendarView === "month" ? "default" : "outline"}
                size="sm"
                className={
                  calendarView === "month"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "border-teal-300 text-teal-700"
                }
                onClick={() => setCalendarView("month")}
              >
                Month
              </Button>
              <Button
                variant={calendarView === "week" ? "default" : "ghost"}
                size="sm"
                className={calendarView === "week" ? "bg-green-600 hover:bg-green-700 text-white" : "text-gray-600"}
                onClick={() => setCalendarView("week")}
              >
                Week
              </Button>
              <Button
                variant={calendarView === "day" ? "default" : "ghost"}
                size="sm"
                className={calendarView === "day" ? "bg-green-600 hover:bg-green-700 text-white" : "text-gray-600"}
                onClick={() => setCalendarView("day")}
              >
                Day
              </Button>
            </div>
          </div>

          {/* Calendar content would go here - keeping it simple for now */}
          <div className="text-center py-12 text-gray-500">
            Calendar view for {calendarView} - {currentDate.toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule and Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
          <CardHeader>
            <CardTitle className="dashboard-text-primary flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments
                .filter((apt) => apt.date === new Date().toISOString().split("T")[0])
                .map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                    <div className="text-sm font-medium dashboard-text-primary min-w-[80px]">{appointment.time}</div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={appointment.patientAvatar || "/placeholder.svg"}
                        alt={appointment.patientName}
                      />
                      <AvatarFallback className="bg-teal-100 text-teal-800 text-xs">
                        {appointment.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium dashboard-text-primary">{appointment.patientName}</h4>
                      <p className="text-sm dashboard-text-secondary">{appointment.service}</p>
                    </div>
                    <Badge className={getStatusColor(appointment.status)} variant="outline">
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
          <CardHeader>
            <CardTitle className="dashboard-text-primary">Availability Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium dashboard-text-primary mb-3">Working Hours</h4>
              <div className="space-y-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                  <div key={day} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                    <span className="text-sm font-medium">{day}</span>
                    <div className="flex items-center gap-2 text-sm dashboard-text-secondary">
                      <span>9:00 AM - 5:00 PM</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button className="dashboard-button-primary text-primary-white">Update Availability</Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
