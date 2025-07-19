"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Calendar, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card";
import { Button } from "@/components/provider-dashboard-ui/button";
import { Badge } from "@/components/provider-dashboard-ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/provider-dashboard-ui/avatar";
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav";
import { AvailabilityEditorModal } from "@/components/provider-dashboard-ui/AvailabilityEditorModal";
import { WeeklyAvailabilityPreview } from "@/components/provider-dashboard-ui/WeeklyAvailabilityPreview";
import { type TimeSlot } from "@/utils/schedule-utils";
import { format, startOfWeek, endOfWeek, addDays } from "date-fns";

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

export default function SchedulePage() {
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("week");
  const [showAvailabilityEditor, setShowAvailabilityEditor] = useState(false);
  
  // Provider ID - in real app, get from auth context
  const providerId = "provider-123"; // Replace with actual provider ID

  // Get current date properly to fix timezone issues
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");

  // Mock function to save availability to backend
  const handleSaveAvailability = async (date: string, timeSlots: TimeSlot[]): Promise<void> => {
    try {
      // Here you would call your actual API
      console.log("Saving availability for", date, timeSlots);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message or update UI
    } catch (error) {
      console.error("Failed to save availability:", error);
    }
  };

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

      {/* Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Schedule Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyAvailabilityPreview currentDate={currentDate} />
              
              <div className="mt-6 text-center">
                <Button
                  onClick={() => setShowAvailabilityEditor(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Availability
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today&apos;s Schedule
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
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm font-medium text-blue-600 min-w-[70px]">
                      {appointment.time}
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
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Today&apos;s Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Appointments</span>
                  <span className="font-semibold">{todayAppointments.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Confirmed</span>
                  <span className="font-semibold text-green-600">
                    {todayAppointments.filter(apt => apt.status === "confirmed").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">
                    {todayAppointments.filter(apt => apt.status === "pending").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Date</span>
                  <span className="font-semibold text-blue-600">
                    {format(today, "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
