"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/provider-dashboard-ui/card";
import { Button } from "@/components/provider-dashboard-ui/button";
import { Badge } from "@/components/provider-dashboard-ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/provider-dashboard-ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/provider-dashboard-ui/tabs";
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav";

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

export default function AppointmentsPage() {
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
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      <TopNav title="Appointments" notificationCount={2} />

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
                      <Button size="sm" className="dashboard-button-primary text-primary-white">
                        Start Session
                      </Button>
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
    </>
  );
}
