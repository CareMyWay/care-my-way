"use client"

import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card"
import { Button } from "@/components/provider-dashboard-ui/button"
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav"

export default function DashboardOverview() {
  const [notifications, setNotifications] = useState([
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

  const appointments = [
    {
      id: "1",
      patientName: "Emma Wilson",
      date: "2025-01-15",
      time: "9:00 AM",
    },
    {
      id: "2",
      patientName: "Robert Davis",
      date: "2025-01-15",
      time: "2:00 PM",
    },
    {
      id: "3",
      patientName: "Lisa Martinez",
      date: "2025-01-16",
      time: "11:00 AM",
    },
  ]

  const messages = [
    {
      id: "1",
      patientName: "Emma Wilson",
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
  ]

  const handleAcceptAppointment = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const handleDeclineAppointment = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  return (
    <>
      <TopNav title="Dashboard" notificationCount={notifications.length} />

      <div className="space-y-6">
        {/* Appointment Requests */}
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

        {/* Stats Cards */}
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
    </>
  )
}

