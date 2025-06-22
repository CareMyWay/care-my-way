"use client"

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careprovider-dashboard/card";
import GreenButton from "@/components/buttons/green-button";
import OrangeButton from "@/components/buttons/orange-button";
import { Badge } from "@/components/careprovider-dashboard/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/careprovider-dashboard/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/careprovider-dashboard/tabs";
import { SidebarNav } from "@/components/careprovider-dashboard/careprovider-sidenav";
import { TopNav } from "@/components/careprovider-dashboard/dashboard-topnav";

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

interface Message {
  id: string
  patientName: string
  patientAvatar?: string
  lastMessage: string
  timestamp: string
  unread: boolean
}

interface Notification {
  id: string
  type: "appointment_request" | "message" | "reminder"
  patientName: string
  service: string
  date: string
  time: string
  message: string
  timestamp: string
}

export default function CaregiverDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "appointment_request",
      patientName: "Sarah Johnson",
      service: "Physical Therapy",
      date: "2024-01-15",
      time: "10:00 AM",
      message: "New appointment request for Physical Therapy session",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "appointment_request",
      patientName: "Michael Chen",
      service: "Occupational Therapy",
      date: "2024-01-16",
      time: "2:00 PM",
      message: "Recurring appointment request for weekly OT sessions",
      timestamp: "4 hours ago",
    },
  ])

  // Add these state variables after the existing useState declarations
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month")

  // Update the appointments with current dates
  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "Emma Wilson",
      patientAvatar: "/placeholder.svg?height=40&width=40",
      service: "Physical Therapy",
      date: "2025-01-15", // Updated to current dates
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
      date: "2025-01-15", // Today's date
      time: "2:00 PM",
      status: "confirmed",
      type: "one-time",
      location: "Care My Way Clinic",
      notes: "Post-surgery care assessment",
    },
    {
      id: "3",
      patientName: "Lisa Martinez",
      service: "Occupational Therapy",
      date: "2025-01-16",
      time: "11:00 AM",
      status: "pending",
      type: "one-time",
      location: "Patient Home",
    },
  ])

  const [messages] = useState<Message[]>([
    {
      id: "1",
      patientName: "Emma Wilson",
      patientAvatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thank you for the session today. I feel much better!",
      timestamp: "1 hour ago",
      unread: false,
    },
    {
      id: "2",
      patientName: "Sarah Johnson",
      lastMessage: "Can we reschedule tomorrow's appointment?",
      timestamp: "3 hours ago",
      unread: true,
    },
    {
      id: "3",
      patientName: "Michael Chen",
      lastMessage: "Looking forward to our first session next week.",
      timestamp: "1 day ago",
      unread: true,
    },
  ])

  const handleAcceptAppointment = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    // In a real app, this would make an API call to accept the appointment
  }

  const handleDeclineAppointment = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    // In a real app, this would make an API call to decline the appointment
  }
  

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

  const getPageTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Dashboard"
      case "profile":
        return "Profile"
      case "settings":
        return "Settings"
      case "schedule":
        return "Schedule"
      case "messages":
        return "Messages"
      case "appointments":
        return "Appointments"
      case "patients":
        return "My Patients"
      default:
        return "Dashboard"
    }
  }

  return (
    <div className="min-h-screen dashboard-bg-primary font-manrope">
      <div className="flex">
        {/* Sidebar Navigation */}
        <SidebarNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadMessages={messages.filter((m) => m.unread).length}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Top Navigation */}
          <TopNav
            title={getPageTitle()}
            notificationCount={notifications.length}
            userName="Dr. Jane Smith"
            userRole="Physical Therapist"
            onNotificationClick={() => console.log("Notifications clicked")}
          />

          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Appointment Requests - Keep existing but update design */}
              {notifications.length > 0 && (
                <Card className="border-orange-200 bg-orange-50 mb-6">
                  <CardHeader>
                    <CardTitle className="text-orange-800 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Appointment Requests ({notifications.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="bg-white p-4 rounded-lg border border-orange-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium dashboard-text-primary">{notification.patientName}</h4>
                            <p className="text-sm dashboard-text-secondary">{notification.service}</p>
                            <p className="text-sm dashboard-text-secondary">
                              {notification.date} at {notification.time}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="dashboard-button-primary text-primary-white"
                              onClick={() => handleAcceptAppointment(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeclineAppointment(notification.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Stats Cards - Updated design to match screenshot */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl font-bold dashboard-text-primary mb-2">2</div>
                    <div className="dashboard-text-secondary">
                      <div>Upcoming</div>
                      <div>Appointments</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl font-bold dashboard-text-primary mb-2">18</div>
                    <div className="dashboard-text-secondary">Completed Visits</div>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl font-bold dashboard-text-primary mb-2">
                      {messages.filter((m) => m.unread).length}
                    </div>
                    <div className="dashboard-text-secondary">Messages</div>
                  </CardContent>
                </Card>
              </div>

              {/* Today's Appointments Table */}
              <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold dashboard-text-primary mb-6">Upcoming Appointments</h2>
                  <div className="overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-4 px-2 font-semibold dashboard-text-primary">Client</th>
                          <th className="text-left py-4 px-2 font-semibold dashboard-text-primary">Date</th>
                          <th className="text-left py-4 px-2 font-semibold dashboard-text-primary">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments
                          .filter((apt) => new Date(apt.date) >= new Date())
                          .slice(0, 5)
                          .map((appointment, index) => (
                            <tr key={appointment.id} className={index !== 0 ? "border-t border-gray-100" : ""}>
                              <td className="py-4 px-2 dashboard-text-primary">{appointment.patientName}</td>
                              <td className="py-4 px-2 dashboard-text-secondary">{appointment.date}</td>
                              <td className="py-4 px-2 dashboard-text-secondary">{appointment.time}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold dashboard-text-primary mb-2">Appointments</h2>
                <p className="dashboard-text-secondary">Manage your upcoming and past appointments.</p>
              </div>

              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming" className="space-y-4">
                  {appointments
                    .filter((apt) => new Date(apt.date) > new Date("2024-01-12"))
                    .map((appointment) => (
                      <Card key={appointment.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage
                                  src={appointment.patientAvatar || "/placeholder.svg"}
                                  alt={appointment.patientName}
                                />
                                <AvatarFallback className="bg-teal-100 text-teal-800">
                                  {appointment.patientName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium dashboard-text-primary">{appointment.patientName}</h4>
                                <p className="text-sm dashboard-text-secondary">{appointment.service}</p>
                                <p className="text-sm dashboard-text-secondary">
                                  {appointment.date} at {appointment.time}
                                </p>
                                <p className="text-sm dashboard-text-secondary flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {appointment.location}
                                </p>
                                {appointment.notes && (
                                  <p className="text-sm dashboard-text-secondary mt-1">Notes: {appointment.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                              <Badge variant="outline" className="text-teal-700 border-teal-300">
                                {appointment.type}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
                <TabsContent value="today" className="space-y-4">
                  {appointments
                    .filter((apt) => apt.date === "2024-01-12")
                    .map((appointment) => (
                      <Card key={appointment.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage
                                  src={appointment.patientAvatar || "/placeholder.svg"}
                                  alt={appointment.patientName}
                                />
                                <AvatarFallback className="bg-teal-100 text-teal-800">
                                  {appointment.patientName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium dashboard-text-primary">{appointment.patientName}</h4>
                                <p className="text-sm dashboard-text-secondary">{appointment.service}</p>
                                <p className="text-sm dashboard-text-secondary">{appointment.time}</p>
                                <p className="text-sm dashboard-text-secondary flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {appointment.location}
                                </p>
                                {appointment.notes && (
                                  <p className="text-sm dashboard-text-secondary mt-1">Notes: {appointment.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                             <GreenButton className="dashboard-button-primary text-primary-white">
                               Start Session
                             </GreenButton>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
                <TabsContent value="past">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="dashboard-text-secondary">No past appointments to display.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold dashboard-text-primary mb-2">Schedule</h2>
                  <p className="dashboard-text-secondary">Manage your appointments and availability.</p>
                </div>
                <div className="flex gap-2">
                  <GreenButton variant="outline" className="dashboard-button-secondary">
                    Today
                  </GreenButton>
                  <GreenButton className="dashboard-button-primary text-primary-white">+ New Appointment</Button>
                </div>
              </div>

              {/* Calendar Header */}
              <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <GreenButton
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
                      </GreenButton>
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
                      <GreenButton
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
                      </GreenButton>
                    </div>
                    <div className="flex gap-2">
                      <GreenButton
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
                      </GreenButton>
                      <GreenButton
                        variant={calendarView === "week" ? "default" : "ghost"}
                        size="sm"
                        className={
                          calendarView === "week" ? "bg-green-600 hover:bg-green-700 text-white" : "text-gray-600"
                        }
                        onClick={() => setCalendarView("week")}
                      >
                        Week
                      </GreenButton>
                      <GreenButton
                        variant={calendarView === "day" ? "default" : "ghost"}
                        size="sm"
                        className={
                          calendarView === "day" ? "bg-green-600 hover:bg-green-700 text-white" : "text-gray-600"
                        }
                        onClick={() => setCalendarView("day")}
                      >
                        Day
                      </GreenButton>
                    </div>
                  </div>

                  {/* Calendar Views */}
                  {calendarView === "month" && (
                    <div className="grid grid-cols-7 gap-1">
                      {/* Day Headers */}
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div
                          key={day}
                          className="p-3 text-center text-sm font-medium dashboard-text-secondary border-b"
                        >
                          {day}
                        </div>
                      ))}

                      {/* Calendar Days */}
                      {(() => {
                        const year = currentDate.getFullYear()
                        const month = currentDate.getMonth()
                        const firstDay = new Date(year, month, 1)
                        const lastDay = new Date(year, month + 1, 0)
                        const startDate = new Date(firstDay)
                        startDate.setDate(startDate.getDate() - firstDay.getDay())

                        const days = []
                        for (let i = 0; i < 42; i++) {
                          const day = new Date(startDate)
                          day.setDate(startDate.getDate() + i)
                          days.push(day)
                        }

                        return days.map((day, i) => {
                          const isCurrentMonth = day.getMonth() === month
                          const isToday = day.toDateString() === new Date().toDateString()
                          const dayString = day.toISOString().split("T")[0]
                          const hasAppointment = appointments.some((apt) => apt.date === dayString)

                          return (
                            <div
                              key={i}
                              className={`min-h-[120px] p-2 border border-gray-100 ${
                                !isCurrentMonth ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                              } ${isToday ? "bg-blue-50 border-blue-200" : ""}`}
                            >
                              <div
                                className={`text-sm mb-2 ${
                                  !isCurrentMonth
                                    ? "text-gray-400"
                                    : isToday
                                      ? "text-blue-600 font-semibold"
                                      : "dashboard-text-primary"
                                }`}
                              >
                                {day.getDate()}
                              </div>

                              {/* Appointments */}
                              {hasAppointment && isCurrentMonth && (
                                <div className="space-y-1">
                                  {appointments
                                    .filter((apt) => apt.date === dayString)
                                    .map((appointment, idx) => (
                                      <div key={idx} className="text-xs bg-teal-100 text-teal-800 p-1 rounded truncate">
                                        {appointment.time} - {appointment.patientName}
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          )
                        })
                      })()}
                    </div>
                  )}

                  {calendarView === "week" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-8 gap-1">
                        <div className="p-3 text-center text-sm font-medium dashboard-text-secondary"></div>
                        {(() => {
                          const startOfWeek = new Date(currentDate)
                          startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

                          return Array.from({ length: 7 }, (_, i) => {
                            const day = new Date(startOfWeek)
                            day.setDate(startOfWeek.getDate() + i)
                            const isToday = day.toDateString() === new Date().toDateString()

                            return (
                              <div key={i} className={`p-3 text-center border-b ${isToday ? "bg-blue-50" : ""}`}>
                                <div className="text-sm font-medium dashboard-text-secondary">
                                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                                </div>
                                <div
                                  className={`text-lg ${isToday ? "text-blue-600 font-semibold" : "dashboard-text-primary"}`}
                                >
                                  {day.getDate()}
                                </div>
                              </div>
                            )
                          })
                        })()}
                      </div>

                      {/* Time slots */}
                      {Array.from({ length: 12 }, (_, i) => {
                        const hour = i + 8 // Start from 8 AM
                        const timeString = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`

                        return (
                          <div key={i} className="grid grid-cols-8 gap-1 min-h-[60px] border-b border-gray-100">
                            <div className="p-2 text-sm dashboard-text-secondary text-right">{timeString}</div>
                            {Array.from({ length: 7 }, (_, dayIndex) => {
                              const startOfWeek = new Date(currentDate)
                              startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
                              const day = new Date(startOfWeek)
                              day.setDate(startOfWeek.getDate() + dayIndex)
                              const dayString = day.toISOString().split("T")[0]

                              const dayAppointments = appointments.filter(
                                (apt) =>
                                  apt.date === dayString &&
                                  Number.parseInt(apt.time.split(":")[0]) === (hour > 12 ? hour - 12 : hour),
                              )

                              return (
                                <div key={dayIndex} className="p-1 border-r border-gray-100 hover:bg-gray-50">
                                  {dayAppointments.map((apt, idx) => (
                                    <div key={idx} className="text-xs bg-teal-100 text-teal-800 p-1 rounded mb-1">
                                      {apt.patientName}
                                    </div>
                                  ))}
                                </div>
                              )
                            })}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {calendarView === "day" && (
                    <div className="space-y-2">
                      {Array.from({ length: 12 }, (_, i) => {
                        const hour = i + 8 // Start from 8 AM
                        const timeString = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`
                        const dayString = currentDate.toISOString().split("T")[0]

                        const hourAppointments = appointments.filter(
                          (apt) =>
                            apt.date === dayString &&
                            Number.parseInt(apt.time.split(":")[0]) === (hour > 12 ? hour - 12 : hour),
                        )

                        return (
                          <div key={i} className="flex min-h-[80px] border-b border-gray-100">
                            <div className="w-20 p-4 text-sm dashboard-text-secondary text-right border-r border-gray-100">
                              {timeString}
                            </div>
                            <div className="flex-1 p-4 hover:bg-gray-50">
                              {hourAppointments.map((apt, idx) => (
                                <div key={idx} className="bg-teal-100 text-teal-800 p-3 rounded-lg mb-2">
                                  <div className="font-medium">{apt.patientName}</div>
                                  <div className="text-sm">{apt.service}</div>
                                  <div className="text-xs dashboard-text-secondary">{apt.location}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Today's Schedule - only show if not in day view */}
              {calendarView !== "day" && (
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
                            <div
                              key={appointment.id}
                              className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg"
                            >
                              <div className="text-sm font-medium dashboard-text-primary min-w-[80px]">
                                {appointment.time}
                              </div>
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
                            <div
                              key={day}
                              className="flex items-center justify-between p-2 border border-gray-200 rounded"
                            >
                              <span className="text-sm font-medium">{day}</span>
                              <div className="flex items-center gap-2 text-sm dashboard-text-secondary">
                                <span>9:00 AM - 5:00 PM</span>
                                <GreenButton variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Settings className="h-3 w-3" />
                                </GreenButton>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <GreenButton className="dashboard-button-primary text-primary-white">Update Availability</Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold dashboard-text-primary mb-2">Messages</h2>
                <p className="dashboard-text-secondary">Communicate securely with your patients.</p>
              </div>

              {/* Messages List Only */}
              <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
                <CardHeader className="pb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="w-full pl-10 pr-4 py-2 dashboard-input focus:outline-none"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                          index === 0 ? "bg-teal-50 border-l-4 border-l-teal-500" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={message.patientAvatar || "/placeholder.svg"} alt={message.patientName} />
                            <AvatarFallback className="bg-teal-100 text-teal-800">
                              {message.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium dashboard-text-primary">{message.patientName}</h4>
                              <span className="text-xs dashboard-text-secondary">{message.timestamp}</span>
                            </div>
                            <p className="text-sm dashboard-text-secondary">{message.lastMessage}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {message.unread && <div className="w-3 h-3 bg-orange-500 rounded-full"></div>}
                            <GreenButton
                              size="sm"
                              variant="outline"
                              className="border-teal-300 text-teal-700 hover:bg-teal-50"
                            >
                              Reply
                            </GreenButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold dashboard-text-primary mb-2">Profile</h2>
                <p className="dashboard-text-secondary">Manage your professional profile and credentials.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
                  <CardHeader>
                    <CardTitle className="dashboard-text-primary">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Dr. Jane Smith" />
                        <AvatarFallback className="bg-teal-100 text-teal-800 text-xl">JS</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold dashboard-text-primary">Dr. Jane Smith</h3>
                        <p className="dashboard-text-secondary">Licensed Physical Therapist</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm dashboard-text-secondary ml-1">4.9 (127 reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 dashboard-text-secondary">
                        <Mail className="h-4 w-4" />
                        <span>jane.smith@caregivers.com</span>
                      </div>
                      <div className="flex items-center gap-2 dashboard-text-secondary">
                        <Phone className="h-4 w-4" />
                        <span>(555) 123-4567</span>
                      </div>
                      <div className="flex items-center gap-2 dashboard-text-secondary">
                        <MapPin className="h-4 w-4" />
                        <span>San Francisco, CA</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
                  <CardHeader>
                    <CardTitle className="dashboard-text-primary">Professional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium dashboard-text-primary">Specializations</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="border-teal-300 text-teal-700">
                          Physical Therapy
                        </Badge>
                        <Badge variant="outline" className="border-teal-300 text-teal-700">
                          Sports Rehabilitation
                        </Badge>
                        <Badge variant="outline" className="border-teal-300 text-teal-700">
                          Geriatric Care
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium dashboard-text-primary">Experience</h4>
                      <p className="dashboard-text-secondary">8 years in physical therapy</p>
                    </div>
                    <div>
                      <h4 className="font-medium dashboard-text-primary">Credentials</h4>
                      <div className="space-y-1">
                        <p className="text-sm dashboard-text-secondary">• Licensed Physical Therapist (CA)</p>
                        <p className="text-sm dashboard-text-secondary">
                          • Board Certified in Orthopedic Physical Therapy
                        </p>
                        <p className="text-sm dashboard-text-secondary">• CPR/AED Certified</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium dashboard-text-primary">Languages</h4>
                      <p className="dashboard-text-secondary">English, Spanish</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
                <CardHeader>
                  <CardTitle className="dashboard-text-primary">Service Areas & Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium dashboard-text-primary mb-2">Service Areas</h4>
                      <div className="space-y-1">
                        <p className="text-sm dashboard-text-secondary">• San Francisco, CA</p>
                        <p className="text-sm dashboard-text-secondary">• Oakland, CA</p>
                        <p className="text-sm dashboard-text-secondary">• Berkeley, CA</p>
                        <p className="text-sm dashboard-text-secondary">• Within 25 miles radius</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium dashboard-text-primary mb-2">Hourly Rates</h4>
                      <div className="space-y-1">
                        <p className="text-sm dashboard-text-secondary">• Physical Therapy: $85/hour</p>
                        <p className="text-sm dashboard-text-secondary">• Home Visits: $95/hour</p>
                        <p className="text-sm dashboard-text-secondary">• Initial Assessment: $120</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <GreenButton className="dashboard-button-primary text-primary-white">Edit Profile</GreenButton>
                <GreenButton variant="outline" className="dashboard-button-secondary">
                  Update Credentials
                </GreenButton>
              </div>
            </div>
          )}

          {/* Add settings tab content */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold dashboard-text-primary mb-2">Settings</h2>
                <p className="dashboard-text-secondary">Manage your account preferences and notifications.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
                  <CardHeader>
                    <CardTitle className="dashboard-text-primary">Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium dashboard-text-primary mb-2">Language Preference</h4>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                    <div>
                      <h4 className="font-medium dashboard-text-primary mb-2">Time Zone</h4>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>Pacific Time (PT)</option>
                        <option>Mountain Time (MT)</option>
                        <option>Central Time (CT)</option>
                        <option>Eastern Time (ET)</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
                  <CardHeader>
                    <CardTitle className="dashboard-text-primary">Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="dashboard-text-primary">Email Notifications</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="dashboard-text-primary">SMS Notifications</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="dashboard-text-primary">Appointment Reminders</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <GreenButton className="dashboard-button-primary text-primary-white">Save Settings</Button>
            </div>
          )}

          {/* Add patients tab content */}
          {activeTab === "patients" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold dashboard-text-primary mb-2">My Patients</h2>
                <p className="dashboard-text-secondary">View and manage your current patients.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {["Emma Wilson", "Robert Davis", "Lisa Martinez", "Sarah Johnson"].map((patientName, index) => (
                  <Card key={index} className="border-gray-200 dashboard-bg-primary rounded-2xl dashboard-card">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={patientName} />
                          <AvatarFallback className="bg-teal-100 text-teal-800">
                            {patientName.split(" ").map((n) => n[0])}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium dashboard-text-primary">{patientName}</h4>
                          <p className="dashboard-text-secondary">Active Patient</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="dashboard-text-secondary">Last Session: Jan 10, 2024</p>
                        <p className="dashboard-text-secondary">Next Appointment: Jan 15, 2024</p>
                      </div>
                      <GreenButton size="sm" variant="outline" className="w-full mt-4 dashboard-button-secondary">
                        View Details
                      </GreenButton>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
