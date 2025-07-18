"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card";
import { Button } from "@/components/provider-dashboard-ui/button";
import { Badge } from "@/components/provider-dashboard-ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/provider-dashboard-ui/avatar";
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav";
import { format } from "date-fns";
import { generateDayTimeSlots, formatDisplayTime, type TimeSlot } from "@/utils/schedule-utils";

interface Appointment {
  id: string
  patientName: string
  patientAvatar?: string
  service: string
  date: string // format: YYYY-MM-DD
  time: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  type: "one-time" | "recurring"
  location: string
  notes?: string
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getDayOfWeek(year: number, month: number, day: number) {
  return new Date(year, month, day).getDay();
}

export default function SchedulePage() {
  // Real-time date state
  const [realTimeDate, setRealTimeDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");
  
  // Availability management state
  const [dayTimeSlots, setDayTimeSlots] = useState<TimeSlot[]>(generateDayTimeSlots());
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  
  // Update real-time date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "Emma Wilson",
      patientAvatar: "/placeholder.svg?height=40&width=40",
      service: "Physical Therapy",
      date: todayStr, // Use today's date
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
      date: format(addDays(today, 1), "yyyy-MM-dd"), // Tomorrow
      time: "2:00 PM",
      status: "confirmed",
      type: "one-time",
      location: "Care My Way Clinic",
      notes: "Post-surgery care assessment",
    },
    {
      id: "3",
      patientName: "Sarah Johnson",
      service: "Medication Management",
      date: todayStr, // Today
      time: "11:30 AM",
      status: "pending",
      type: "one-time",
      location: "Patient Home",
      notes: "Weekly medication review",
    },
  ]);

  // Helper functions for week view
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    switch (calendarView) {
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    switch (calendarView) {
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get title based on view
  const getViewTitle = () => {
    switch (calendarView) {
      case "month":
        return format(currentDate, "MMMM yyyy");
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy");
      default:
        return "";
    }
  };

  // Today's appointments
  const todayAppointments = appointments.filter(
    (apt) => apt.date === todayStr
  );

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
      <TopNav title="Schedule" notificationCount={2}>
        <div className="flex gap-2">
          <Button
            onClick={goToToday}
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            Today
          </Button>
          <Button
            onClick={() => setShowAvailabilityEditor(!showAvailabilityEditor)}
            variant="outline"
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Availability
          </Button>
        </div>
      </TopNav>

      {/* Modern Header with Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={navigatePrevious}
                className="p-2 hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={navigateNext}
                className="p-2 hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getViewTitle()}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(["month", "week", "day"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setCalendarView(view)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    calendarView === view
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

        <Card className="border-gray-400 dashboard-bg-primary rounded-2xl dashboard-card mb-6 !shadow-none">
          <CardHeader>
            <CardTitle className="dashboard-text-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Availability Management
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditingAvailability(!isEditingAvailability)}
                className="text-xs"
              >
                {isEditingAvailability ? "Save Changes" : "Edit Availability"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium dashboard-text-primary mb-3">
                Today&apos;s Time Slots - {format(realTimeDate, "EEEE, MMMM d")}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {dayTimeSlots.map((slot) => (
                  <div
                    key={slot.time}
                    className={`
                      p-2 rounded border text-center cursor-pointer transition-colors
                      ${slot.isBooked 
                        ? "bg-red-100 border-red-300 text-red-800" 
                        : slot.isAvailable 
                          ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200" 
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }
                      ${isEditingAvailability ? "hover:shadow-md" : ""}
                    `}
                    onClick={() => {
                      if (isEditingAvailability && !slot.isBooked) {
                        setDayTimeSlots(slots => 
                          slots.map(s => 
                            s.time === slot.time 
                              ? { ...s, isAvailable: !s.isAvailable }
                              : s
                          )
                        );
                      }
                    }}
                  >
                    <div className="text-sm font-medium">
                      {formatDisplayTime(slot.time)}
                    </div>
                    <div className="text-xs mt-1">
                      {slot.isBooked 
                        ? "Booked" 
                        : slot.isAvailable 
                          ? "Available" 
                          : "Blocked"
                      }
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={appointment.patientAvatar || "/placeholder.svg"}
                        alt={appointment.patientName}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                        {appointment.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {appointment.patientName}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">{appointment.service}</p>
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
              {isEditingAvailability && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 Click on time slots to toggle availability. Green = Available, Gray = Blocked, Red = Already Booked
                  </p>
                </div>
              )}
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium dashboard-text-primary mb-3">Quick Actions</h4>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setDayTimeSlots(slots => 
                      slots.map(s => ({ ...s, isAvailable: true }))
                    );
                  }}
                  disabled={!isEditingAvailability}
                >
                  Mark All Available
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setDayTimeSlots(slots => 
                      slots.map(s => s.isBooked ? s : { ...s, isAvailable: false })
                    );
                  }}
                  disabled={!isEditingAvailability}
                >
                  Block All Unbooked
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Reset to default business hours (9 AM - 5 PM available)
                    setDayTimeSlots(generateDayTimeSlots());
                  }}
                  disabled={!isEditingAvailability}
                >
                  Reset to Default
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Availability Editor Modal */}
      <AvailabilityEditorModal
        isOpen={showAvailabilityEditor}
        onClose={() => setShowAvailabilityEditor(false)}
        onSave={handleSaveAvailability}
        providerId={providerId}
      />
    </>
  );
}
