"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav";

interface Appointment {
  id: string;
  patientName: string;
  patientAvatar?: string;
  service: string;
  date: string; // format: YYYY-MM-DD
  time: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  type: "one-time" | "recurring";
  location: string;
  notes?: string;
}

const WORKING_HOURS = {
  Monday: "9:00 AM - 5:00 PM",
  Tuesday: "9:00 AM - 5:00 PM",
  Wednesday: "9:00 AM - 5:00 PM",
  Thursday: "9:00 AM - 5:00 PM",
  Friday: "9:00 AM - 5:00 PM",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getDayOfWeek(year: number, month: number, day: number) {
  return new Date(year, month, day).getDay();
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");

  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "Emma Wilson",
      patientAvatar: "/placeholder.svg?height=40&width=40",
      service: "Physical Therapy",
      date: "2025-06-25",
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
      date: "2025-06-30",
      time: "2:00 PM",
      status: "confirmed",
      type: "one-time",
      location: "Care My Way Clinic",
      notes: "Post-surgery care assessment",
    },
  ]);

  // Helper for calendar
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const todayStr = new Date().toISOString().split("T")[0];

  // Build calendar grid for month view
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getDayOfWeek(year, month, 1);
  const calendarDays: {
    date: string;
    isToday: boolean;
    appointments: Appointment[];
  }[] = [];

  if (calendarView === "month") {
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push({ date: "", isToday: false, appointments: [] });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateStr = dateObj.toISOString().split("T")[0];
      calendarDays.push({
        date: dateStr,
        isToday: dateStr === todayStr,
        appointments: appointments.filter((apt) => apt.date === dateStr),
      });
    }
  } else {
    // week view: show current week (Sunday to Saturday)
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    for (let i = 0; i < 7; i++) {
      const dateObj = new Date(weekStart);
      dateObj.setDate(weekStart.getDate() + i);
      const dateStr = dateObj.toISOString().split("T")[0];
      calendarDays.push({
        date: dateStr,
        isToday: dateStr === todayStr,
        appointments: appointments.filter((apt) => apt.date === dateStr),
      });
    }
  }

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

  // Today's appointments
  const todayAppointments = appointments.filter((apt) => apt.date === todayStr);

  return (
    <>
      <TopNav title="Schedule" notificationCount={2}>
        <div className="flex gap-2"></div>
      </TopNav>

      {/* Calendar */}
      <Card className="border-none dashboard-bg-primary rounded-2xl dashboard-card mb-6 !shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  if (calendarView === "month") {
                    newDate.setMonth(newDate.getMonth() - 1);
                  } else {
                    newDate.setDate(newDate.getDate() - 7);
                  }
                  setCurrentDate(newDate);
                }}
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h3 className="text-2xl font-bold dashboard-text-primary tracking-tight">
                {calendarView === "month"
                  ? currentDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : (() => {
                      const weekStart = new Date(currentDate);
                      weekStart.setDate(
                        currentDate.getDate() - currentDate.getDay()
                      );
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekStart.getDate() + 6);
                      return `${weekStart.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })} - ${weekEnd.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}`;
                    })()}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  if (calendarView === "month") {
                    newDate.setMonth(newDate.getMonth() + 1);
                  } else {
                    newDate.setDate(newDate.getDate() + 7);
                  }
                  setCurrentDate(newDate);
                }}
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div>
              <select
                value={calendarView}
                onChange={(e) =>
                  setCalendarView(e.target.value as "month" | "week")
                }
                className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none"
                aria-label="Calendar View"
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
              </select>
            </div>
          </div>
          {/* Calendar grid */}
          <div className="border-gray-200 grid grid-cols-7 gap-2 text-center p-4 shadow-sm ">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="font-semibold text-xs text-gray-500 pb-2 uppercase tracking-wide"
              >
                {d}
              </div>
            ))}
            {calendarDays.map((day, idx) =>
              day.date ? (
                <div
                  key={idx}
                  className={`
                    group relative rounded-lg p-2 min-h-[70px] flex flex-col items-center border transition
                    ${day.isToday ? "border-green-600 bg-green-50 shadow-md" : "border-gray-200 bg-white hover:bg-teal-50"}
                    cursor-pointer
                  `}
                >
                  <div
                    className={`text-base font-semibold mb-1 ${day.isToday ? "text-green-700" : "text-gray-800"}`}
                  >
                    {new Date(day.date).getDate()}
                  </div>
                  {day.appointments.length > 0 && (
                    <div className="mt-1 flex flex-col gap-1 w-full">
                      {day.appointments.map((apt) => (
                        <Badge
                          key={apt.id}
                          className={`w-full text-[11px] px-1 py-0.5 mt-1 ${getStatusColor(apt.status)} border`}
                          variant="outline"
                        >
                          <span className="font-semibold">{apt.time}</span>{" "}
                          <span className="truncate">{apt.patientName}</span>
                        </Badge>
                      ))}
                    </div>
                  )}
                  {/* Tooltip for appointments */}
                  {day.appointments.length > 0 && (
                    <div className="absolute left-1/2 z-10 hidden group-hover:flex flex-col bg-white border border-gray-300 rounded shadow-lg p-2 min-w-[160px] -translate-x-1/2 top-14">
                      {day.appointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="text-xs text-left mb-1 last:mb-0"
                        >
                          <span className="font-semibold">{apt.time}</span> -{" "}
                          {apt.patientName}
                          <div className="text-gray-500">{apt.service}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div key={idx}></div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-400 dashboard-bg-primary rounded-2xl dashboard-card mb-6 !shadow-none">
          <CardHeader>
            <CardTitle className="dashboard-text-primary flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today&#39;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.length === 0 && (
                <div className="text-gray-400 text-center py-8">
                  No appointments today.
                </div>
              )}
              {todayAppointments.map((appointment) => (
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
                    <h4 className="font-medium dashboard-text-primary">
                      {appointment.patientName}
                    </h4>
                    <p className="text-sm dashboard-text-secondary">
                      {appointment.service}
                    </p>
                  </div>
                  <Badge
                    className={getStatusColor(appointment.status)}
                    variant="outline"
                  >
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-400 dashboard-bg-primary rounded-2xl dashboard-card mb-6 !shadow-none">
          <CardHeader>
            <CardTitle className="dashboard-text-primary">
              Availability Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium dashboard-text-primary mb-3">
                Working Hours
              </h4>
              <div className="space-y-2">
                {Object.entries(WORKING_HOURS).map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between p-2 border border-gray-200 rounded"
                  >
                    <span className="text-sm font-medium">{day}</span>
                    <div className="flex items-center gap-2 text-sm dashboard-text-secondary">
                      <span>{hours}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button className="dashboard-button-primary text-primary-white">
              Update Availability
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
