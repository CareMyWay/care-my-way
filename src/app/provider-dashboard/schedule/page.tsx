"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight, Grid, List, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";

const client = generateClient<Schema>();

interface TimeSlot {
  id: string
  start: string
  end: string
  isAvailable: boolean
  isBooked: boolean
  clientName?: string
  service?: string
}

interface DayAvailability {
  date: string
  isEnabled: boolean
  timeSlots: TimeSlot[]
}

interface Booking {
  id: string
  date: string
  time: string
  clientName: string
  service: string
  duration: number
  status: "confirmed" | "pending" | "cancelled"
}

export default function SchedulingPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [realTime, setRealTime] = useState(new Date());
  const [editMode] = useState(false);
  const [editCurrentDate, setEditCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // TODO: This should come from authentication context
  const currentProviderId = "current-provider-id";

  // ── DATA STATE ────────────────────────────────────────────
  const [weeklyAvailability, setWeeklyAvailability] = useState<DayAvailability[]>([]);

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [tempAvailability, setTempAvailability] = useState<DayAvailability[]>([]);

  // Load availability data from backend
  const loadAvailabilityData = useCallback(async () => {
    setLoading(true);
    try {
      // Get current week/month date range
      const startDate = viewMode === "week" 
        ? getWeekDays(currentDate)[0]
        : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = viewMode === "week"
        ? getWeekDays(currentDate)[6]
        : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      // Load availability data for this provider
      const availabilityResult = await client.models.Availability.list({
        filter: {
          providerId: { eq: currentProviderId }
        }
      });

      // Load booking data for this provider
      const bookingResult = await client.models.Booking.list();

      // Transform backend data to match frontend structure
      const availabilityData = availabilityResult.data || [];
      const bookingData = bookingResult.data || [];

      // Convert bookings to frontend format
      const transformedBookings: Booking[] = bookingData.map(booking => ({
        id: booking.id,
        date: booking.date,
        time: booking.time,
        clientName: booking.clientId || "Unknown Client",
        service: "Care Service",
        duration: 60, // Default 1 hour
        status: "confirmed" as const
      }));

      // Group availability by date and create time slots
      const dateMap = new Map<string, DayAvailability>();
      
      // Initialize dates in range
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];
        dateMap.set(dateStr, {
          date: dateStr,
          isEnabled: false,
          timeSlots: []
        });
      }

      // Process availability data
      availabilityData.forEach(avail => {
        if (!avail.date || !dateMap.has(avail.date)) return;

        const dayData = dateMap.get(avail.date)!;
        if (!dayData.isEnabled) dayData.isEnabled = true;

        // Check if this time slot is booked by a client
        const isBooked = transformedBookings.some(booking => 
          booking.date === avail.date && booking.time === avail.time
        );
        const bookedClient = transformedBookings.find(booking => 
          booking.date === avail.date && booking.time === avail.time
        );

        dayData.timeSlots.push({
          id: avail.id,
          start: avail.time || "00:00",
          end: addHours(avail.time || "00:00", avail.duration || 1),
          isAvailable: avail.isAvailable || false,
          isBooked,
          clientName: bookedClient?.clientName,
          service: bookedClient?.service
        });
      });

      setWeeklyAvailability(Array.from(dateMap.values()));
      setBookings(transformedBookings);
    } catch (error) {
      console.error("Error loading provider schedule data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentProviderId, currentDate, viewMode]);

  // Helper function to add hours to time string
  const addHours = (timeStr: string, hours: number): string => {
    const [hour, minute] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hour + hours, minute, 0, 0);
    return date.toTimeString().slice(0, 5);
  };

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setRealTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load data when component mounts or date/view changes
  useEffect(() => {
    loadAvailabilityData();
  }, [loadAvailabilityData]);

  // Initialize temp availability when entering edit mode
  useEffect(() => {
    if (editMode) {
      setTempAvailability(JSON.parse(JSON.stringify(weeklyAvailability)));
      setEditCurrentDate(new Date(currentDate));
    }
  }, [editMode, weeklyAvailability, currentDate]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDuration = (start: string, end: string) => {
    const startTime = new Date(`2000-01-01T${start}:00`);
    const endTime = new Date(`2000-01-01T${end}:00`);
    let diffMs = endTime.getTime() - startTime.getTime();

    // Handle overnight shifts
    if (diffMs < 0) {
      diffMs += 24 * 60 * 60 * 1000; // Add 24 hours
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;

    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }

    return week;
  };

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateDate = (direction: "prev" | "next") => {
    const targetDate = editMode ? editCurrentDate : currentDate;
    const setTargetDate = editMode ? setEditCurrentDate : setCurrentDate;

    const newDate = new Date(targetDate);
    if (viewMode === "week") {
      newDate.setDate(targetDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(targetDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setTargetDate(newDate);
    
    // Reload data for new date range
    if (!editMode) {
      loadAvailabilityData();
    }
  };

  const canEditDate = (date: string) => {
    const targetDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 3;
  };



  const renderWeekView = () => {
    const weekDays = getWeekDays(editMode ? editCurrentDate : currentDate);
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
      return `${i.toString().padStart(2, "0")}:00`;
    });

    return (
      <div className="space-y-4">
        {/* Week Grid */}
        <div className="week-view-grid">
          {/* Time column header */}
          <div className="week-time-slot flex items-center justify-center font-semibold dashboard-text-primary bg-[var(--color-light-gray)]">
            Time
          </div>

          {/* Day headers */}
          {weekDays.map((day, index) => {
            const dayDate = day.toISOString().split("T")[0];
            const dayBookings = bookings.filter((b) => b.date === dayDate);
            const canEdit = canEditDate(dayDate);
            const isToday = day.toDateString() === realTime.toDateString();

            return (
              <div
                key={index}
                className={`week-time-slot flex flex-col items-center justify-center font-semibold dashboard-text-primary bg-[var(--color-light-gray)] relative ${
                  isToday ? "ring-2 ring-[var(--color-primary-orange)] ring-inset" : ""
                }`}
              >
                <div className="text-sm">{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
                <div className={`text-lg ${isToday ? "text-[var(--color-primary-orange)]" : ""}`}>{day.getDate()}</div>

                {/* Day stats */}
                <div className="text-xs dashboard-text-secondary mt-1">
                  {dayBookings.length > 0 && (
                    <span className="inline-block w-2 h-2 bg-[var(--color-success-green)] rounded-full mr-1"></span>
                  )}
                  {dayBookings.length}
                </div>

                {!canEdit && editMode && (
                  <div className="absolute -top-1 -right-1">
                    <div
                      className="h-5 w-5 flex items-center justify-center bg-red-100 rounded text-xs"
                      title="Cannot edit - less than 3 days notice"
                    >
                      🔒
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Time slots */}
          {timeSlots.map((time, timeIndex) => (
            <>
              {/* Time label */}
              <div
                key={`time-${timeIndex}`}
                className="week-time-slot flex items-center justify-center text-sm dashboard-text-secondary bg-[var(--color-light-gray)]"
              >
                {time}
              </div>

              {/* Day slots */}
              {weekDays.map((day, dayIndex) => {
                const dayDate = day.toISOString().split("T")[0];
                const dayAvailability = (editMode ? tempAvailability : weeklyAvailability).find(
                  (d) => d.date === dayDate,
                );

                // Find if this hour is part of any time slot
                const currentHour = Number.parseInt(time.split(":")[0]);
                const timeSlot = dayAvailability?.timeSlots.find((slot) => {
                  const startHour = Number.parseInt(slot.start.split(":")[0]);
                  const endHour = Number.parseInt(slot.end.split(":")[0]);

                  // Handle overnight shifts
                  if (endHour < startHour) {
                    return currentHour >= startHour || currentHour < endHour;
                  }
                  return currentHour >= startHour && currentHour < endHour;
                });

                const booking = bookings.find((b) => {
                  if (b.date !== dayDate) return false;
                  const bookingStartHour = Number.parseInt(b.time.split(":")[0]);
                  const bookingEndHour = bookingStartHour + Math.floor(b.duration / 60);
                  return currentHour >= bookingStartHour && currentHour < bookingEndHour;
                });

                // Check if this is the first hour of a time slot (to show details)
                const isSlotStart = timeSlot && Number.parseInt(timeSlot.start.split(":")[0]) === currentHour;

                return (
                  <div
                    key={`${dayIndex}-${timeIndex}`}
                    className={`week-time-slot p-1 transition-all duration-200 relative ${
                      timeSlot?.isBooked
                        ? "bg-[var(--color-booked-green)] text-white"
                        : timeSlot?.isAvailable
                          ? "bg-[var(--color-available-green)]"
                          : timeSlot
                            ? "bg-[var(--color-medium-gray)]"
                            : "bg-white border border-[var(--color-medium-gray)]"
                    }`}
                  >
                    {booking && isSlotStart && (
                      <div className="text-xs">
                        <div className="font-semibold truncate">{booking.clientName}</div>
                        <div className="truncate">{booking.service}</div>
                        <div className="text-xs opacity-75">{Math.floor(booking.duration / 60)}h</div>
                      </div>
                    )}
                    {timeSlot && !booking && isSlotStart && (
                      <div className="text-xs text-center">
                        <div className="font-medium">{timeSlot.isAvailable ? "Available" : "Unavailable"}</div>
                        <div className="text-xs opacity-75">{formatDuration(timeSlot.start, timeSlot.end)}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthDays = getMonthDays(editMode ? editCurrentDate : currentDate);
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div>
        {/* Month header */}
        <div className="calendar-grid mb-4">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-4 text-center font-semibold dashboard-text-primary bg-[var(--color-light-gray)]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Month grid */}
        <div className="calendar-grid">
          {monthDays.map((day, index) => {
            if (!day) {
              return <div key={index} className="calendar-cell bg-[var(--color-light-gray)]" />;
            }

            const dayBookings = bookings.filter((b) => b.date === day.toISOString().split("T")[0]);
            const dayAvailability = (editMode ? tempAvailability : weeklyAvailability).find(
              (d) => d.date === day.toISOString().split("T")[0],
            );

            const isToday = day.toDateString() === realTime.toDateString();

            return (
              <div
                key={index}
                className={`calendar-cell ${isToday ? "ring-2 ring-[var(--color-primary-orange)]" : ""}`}
              >
                <div
                  className={`text-sm font-semibold mb-2 ${isToday ? "text-[var(--color-primary-orange)]" : "dashboard-text-primary"}`}
                >
                  {day.getDate()}
                </div>

                {dayBookings.map((booking) => (
                  <div key={booking.id} className="time-slot time-slot-booked mb-1">
                    <div className="text-xs font-semibold">{booking.time}</div>
                    <div className="text-xs truncate">{booking.clientName}</div>
                    <div className="text-xs opacity-75">{Math.floor(booking.duration / 60)}h</div>
                  </div>
                ))}

                {dayAvailability?.timeSlots
                  .filter((slot) => slot.isAvailable && !slot.isBooked)
                  .map((slot) => (
                    <div key={slot.id} className="time-slot time-slot-available mb-1">
                      <div className="text-xs">
                        {slot.start} - {slot.end}
                      </div>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen dashboard-bg-primary p-6">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your schedule...</p>
          </div>
        </div>
      ) : (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold dashboard-text-primary mb-2">Provider Scheduling</h1>
            <div className="flex items-center gap-4 text-sm dashboard-text-secondary">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(realTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(realTime)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            {/* Edit availability button */}
            <Link href="/provider-dashboard/schedule/edit">
              <Button className="dashboard-button-primary text-white">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Availability
              </Button>
            </Link>

            {/* View mode toggle */}
            <div className="flex items-center gap-2 dashboard-card p-1 rounded-lg">
              <Button
                variant={viewMode === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setViewMode("week");
                  loadAvailabilityData();
                }}
                className={viewMode === "week" ? "dashboard-button-primary text-white" : "dashboard-text-primary"}
              >
                <List className="w-4 h-4 mr-2" />
                Week
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setViewMode("month");
                  loadAvailabilityData();
                }}
                className={viewMode === "month" ? "dashboard-button-primary text-white" : "dashboard-text-primary"}
              >
                <Grid className="w-4 h-4 mr-2" />
                Month
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Card className="dashboard-card mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => navigateDate("prev")} className="dashboard-button-secondary">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous {viewMode}
              </Button>

              <h2 className="text-2xl font-semibold dashboard-text-primary">
                {viewMode === "week"
                  ? `Week of ${getWeekDays(currentDate)[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })}`
                  : currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h2>

              <Button variant="outline" onClick={() => navigateDate("next")} className="dashboard-button-secondary">
                Next {viewMode}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="dashboard-text-primary">
              {viewMode === "week" ? "Weekly Schedule" : "Monthly Overview"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">{viewMode === "week" ? renderWeekView() : renderMonthView()}</CardContent>
        </Card>

        {/* Legend */}
        <Card className="dashboard-card mt-6">
          <CardHeader>
            <CardTitle className="dashboard-text-primary">Legend</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-available-green)] border border-[var(--color-success-green)]"></div>
                <span className="text-sm dashboard-text-primary">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-booked-green)]"></div>
                <span className="text-sm dashboard-text-primary">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--color-medium-gray)]"></div>
                <span className="text-sm dashboard-text-primary">Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-[var(--color-primary-orange)]"></div>
                <span className="text-sm dashboard-text-primary">Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  );
}
