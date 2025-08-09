"use client";

import { useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav";
import GreenButton from "@/components/buttons/green-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, startOfWeek, addDays, isSameDay, isSameMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import ClientNotificationsSection from "./client-notifications-section";

export default function EnhancedClientHomeDashPage() {
  const todos = [
    {
      id: "1",
      type: "future_task",
      href: "client-dashboard/to-dos/complete-profile",
      taskTitle: "Complete User Profile",
      dueDate: "Jan 20, 2025",
      dueTime: "8:00 AM - 10:00 AM",
      completed: false,
      description: "Provide personal care assistance for Sarah Johnson.",
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      type: "future_task",
      href: "client-dashboard/to-dos/complete-profile",
      taskTitle: "Complete Booking with Provider",
      dueDate: "Jan 20, 2025",
      dueTime: "8:00 AM - 10:00 AM",
      completed: false,
      description: "Find and book a caregiver for your needs.",
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "3",
      type: "future_task",
      href: "client-dashboard/to-dos/complete-profile",
      taskTitle: "Review Care Plan",
      dueDate: "Jan 22, 2025",
      dueTime: "10:00 AM - 11:00 AM",
      description: "Review your personalized care plan with your provider.",
      createdAt: "2024-01-15T10:00:00Z",
    },
  ];

  const todayAppointment = {
    patientName: "Emma Wilson",
    service: "Physical Therapy",
    time: "9:00 AM - 11:00 AM",
    date: "Jan 15, 2025",
    location: "123 Main Street, San Francisco, CA",
    notes:
      "Focus on mobility exercises and strength training. Patient has been making good progress with previous sessions.",
    avatar: "/placeholder.svg?height=60&width=60",
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Example: appointments for the current week (replace with your real data)
  const appointments = [
    {
      id: "1",
      date: "2025-08-05",
      time: "9:00 AM - 10:00 AM",
      client: "Dr. Smith",
      color: "bg-blue-200",
    },
    {
      id: "2",
      date: "2025-08-07",
      time: "2:00 PM - 3:00 PM",
      client: "Dr. Johnson",
      color: "bg-green-200",
    },
  ];

  return (
    <>
      <TopNav title="My Dashboard" notificationCount={todos.length} />

      <div className="space-y-6">
        {/* To Do List and Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* To-Do Items */}
          <Card className="border border-gray-200 bg-white rounded-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold dashboard-text-primary">
                To-Do Items
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4 max-h-[400px] overflow-y-auto">
              {todos.map((task) => (
                <div
                  key={task.id}
                  className="bg-[var(--color-lightest-green,#e6f4f1)] p-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium text-[var(--color-darkest-green)]">
                          {task.taskTitle}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Due: {task.dueDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full md:w-auto justify-center md:justify-end">
                      {!task.completed ? (
                        <GreenButton
                          variant="route"
                          href={task.href}
                        >
                          <span className="text-xs text-center">Start</span>
                        </GreenButton>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-[var(--color-darkest-green)]">
                    {task.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="border border-gray-200 bg-white rounded-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold dashboard-text-primary">
                Today&#39;s Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="border border-gray-200 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={todayAppointment.avatar || "/placeholder.svg"}
                      alt={todayAppointment.patientName}
                    />
                    <AvatarFallback className="bg-teal-100 text-teal-800">
                      {todayAppointment.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm dashboard-text-secondary">
                        Provider:
                      </span>
                      <span className="font-medium dashboard-text-primary">
                        {todayAppointment.patientName}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold dashboard-text-primary mb-2">
                  {todayAppointment.service}
                </h3>
                <p className="text-sm dashboard-text-primary mb-3 leading-relaxed">
                  {todayAppointment.notes}
                </p>

                <div className="space-y-2 text-sm dashboard-text-primary">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {todayAppointment.date} @ {todayAppointment.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{todayAppointment.location}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications and Booking History */}
        <ClientNotificationsSection />

        {/* Weekly Schedule */}
        <Card className="border border-gray-200 bg-white rounded-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold dashboard-text-primary">
                Weekly Schedule
              </CardTitle>
              <div className="text-sm dashboard-text-secondary border border-gray-300 px-3 py-1">
                {format(weekDays[0], "MMM d")} -{" "}
                {format(weekDays[6], "MMM d, yyyy")}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(addDays(currentDate, -7))}
                  aria-label="Previous Week"
                >
                  <span>&lt;</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(addDays(currentDate, 7))}
                  aria-label="Next Week"
                >
                  <span>&gt;</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div key={day.toISOString()} className="text-center">
                  <div className="text-xs dashboard-text-secondary mb-1">
                    {format(day, "EEE")}
                  </div>
                  <div
                    className={`text-lg font-semibold dashboard-text-primary mb-2 ${
                      isSameDay(day, new Date()) ? "text-green-700" : ""
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1 min-h-[100px]">
                    {appointments
                      .filter(
                        (apt) =>
                          isSameDay(new Date(apt.date), day) &&
                          isSameMonth(new Date(apt.date), currentDate)
                      )
                      .map((apt) => (
                        <div
                          key={apt.id}
                          className={`${apt.color} p-2 text-xs rounded`}
                        >
                          <div className="font-medium text-gray-800">
                            {apt.time}
                          </div>
                          <div className="text-gray-700">{apt.client}</div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
