"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight, Grid, List, Edit3, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";

const client = generateClient<Schema>();

interface TimeSlot {
  id: string
  start: string
  end: string
  isAvailable: boolean
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
  providerName: string
  providerRate: string
  clientId?: string
}

// Helper functions moved outside component to prevent re-creation
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

// Helper function to add minutes to time string (used for both 30-min and 60-min calculations)
const addMinutes = (timeStr: string, minutes: number): string => {
  const [hours, mins] = timeStr.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, "0")}:${newMins.toString().padStart(2, "0")}`;
};

export default function SchedulingPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [realTime, setRealTime] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  // Backend data states
  const [weeklyAvailability, setWeeklyAvailability] = useState<DayAvailability[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  // Real-time clock update
  useEffect(() => {
    // Set initial time when component mounts
    setRealTime(new Date());
    
    const timer = setInterval(() => {
      setRealTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load availability data from backend
  const loadAvailability = useCallback(async () => {
    try {
      setIsLoadingAvailability(true);
      setErrors([]);

      // Get current week dates
      const weekDays = getWeekDays(currentDate);
      const startDate = weekDays[0].toISOString().split("T")[0];
      const endDate = weekDays[6].toISOString().split("T")[0];

      // Load availability data
      const { data: availabilityData, errors: availabilityErrors } = await client.models.Availability.list({
        filter: {
          date: { between: [startDate, endDate] },
        },
      });

      if (availabilityErrors && availabilityErrors.length > 0) {
        throw new Error(`Failed to load availability: ${availabilityErrors[0].message}`);
      }

      // Group availability by date
      const availabilityByDate: { [key: string]: Schema["Availability"]["type"][] } = {};
      availabilityData?.forEach((item) => {
        if (!availabilityByDate[item.date]) {
          availabilityByDate[item.date] = [];
        }
        availabilityByDate[item.date].push(item);
      });

      // Create day availability structure
      const dayAvailability: DayAvailability[] = weekDays.map((day) => {
        const dateStr = day.toISOString().split("T")[0];
        const dayData = availabilityByDate[dateStr] || [];

        // Convert to time slots (each slot is 1 hour)
        const timeSlots: TimeSlot[] = [];
        const sortedSlots = dayData.filter((slot) => slot.isAvailable).sort((a, b) => a.time.localeCompare(b.time));

        // Create individual hour slots (no need to group since each is already 1 hour)
        for (const slot of sortedSlots) {
          timeSlots.push({
            id: slot.id,
            start: slot.time,
            end: addMinutes(slot.time, 60), // 1-hour slots
            isAvailable: true,
          });
        }

        return {
          date: dateStr,
          isEnabled: dayData.length > 0,
          timeSlots,
        };
      });

      setWeeklyAvailability(dayAvailability);
    } catch (err) {
      console.error("Error loading availability:", err);
      setErrors((prev) => [...prev, err instanceof Error ? err.message : "Failed to load availability"]);
    } finally {
      setIsLoadingAvailability(false);
    }
  }, [currentDate]);

  // Load bookings data from backend
  const loadBookings = useCallback(async () => {
    try {
      setIsLoadingBookings(true);

      // Get current month date range for bookings
      const monthDays = getMonthDays(currentDate);
      const validDays = monthDays.filter((day) => day !== null) as Date[];
      const startDate = validDays[0].toISOString().split("T")[0];
      const endDate = validDays[validDays.length - 1].toISOString().split("T")[0];

      const { data: bookingData, errors: bookingErrors } = await client.models.Booking.list({
        filter: {
          date: { between: [startDate, endDate] },
        },
      });

      if (bookingErrors && bookingErrors.length > 0) {
        throw new Error(`Failed to load bookings: ${bookingErrors[0].message}`);
      }

      const formattedBookings: Booking[] =
        bookingData?.map((booking) => ({
          id: booking.id,
          date: booking.date,
          time: booking.time,
          providerName: booking.providerName,
          providerRate: booking.providerRate,
          clientId: booking.clientId || undefined,
        })) || [];

      setBookings(formattedBookings);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setErrors((prev) => [...prev, err instanceof Error ? err.message : "Failed to load bookings"]);
    } finally {
      setIsLoadingBookings(false);
    }
  }, [currentDate]);

  // Load data when date changes
  useEffect(() => {
    loadAvailability();
    loadBookings();
  }, [currentDate, loadAvailability, loadBookings]);

  const formatTime = (date: Date | null) => {
    if (!date) return "--:--:--";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Loading...";
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

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
      return `${i.toString().padStart(2, "0")}:00`;
    });

    if (isLoadingAvailability || isLoadingBookings) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 dashboard-text-primary" />
            <p className="dashboard-text-secondary">Loading schedule...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="week-view-grid">
          <div className="week-time-slot flex items-center justify-center font-semibold dashboard-text-primary bg-[var(--color-light-gray)]">
            Time
          </div>

          {weekDays.map((day, index) => {
            const dayDate = day.toISOString().split("T")[0];
            const dayBookings = bookings.filter((b) => b.date === dayDate);
            const isToday = day.toDateString() === realTime?.toDateString();

            return (
              <div
                key={index}
                className={`week-time-slot flex flex-col items-center justify-center font-semibold dashboard-text-primary bg-[var(--color-light-gray)] relative ${
                  isToday ? "ring-2 ring-[var(--color-primary-orange)] ring-inset" : ""
                }`}
              >
                <div className="text-sm">{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
                <div className={`text-lg ${isToday ? "text-[var(--color-primary-orange)]" : ""}`}>{day.getDate()}</div>

                <div className="text-xs dashboard-text-secondary mt-1">
                  {dayBookings.length > 0 && (
                    <span className="inline-block w-2 h-2 bg-[var(--color-success-green)] rounded-full mr-1"></span>
                  )}
                  {dayBookings.length}
                </div>
              </div>
            );
          })}

          {timeSlots.map((time, timeIndex) => (
            <React.Fragment key={`time-row-${timeIndex}`}>
              <div
                key={`time-${timeIndex}`}
                className="week-time-slot flex items-center justify-center text-sm dashboard-text-secondary bg-[var(--color-light-gray)]"
              >
                {time}
              </div>

              {weekDays.map((day, dayIndex) => {
                const dayDate = day.toISOString().split("T")[0];
                const dayAvailability = weeklyAvailability.find((d) => d.date === dayDate);

                const currentHour = Number.parseInt(time.split(":")[0]);
                const timeSlot = dayAvailability?.timeSlots.find((slot) => {
                  const startHour = Number.parseInt(slot.start.split(":")[0]);
                  const endHour = Number.parseInt(slot.end.split(":")[0]);

                  if (endHour < startHour) {
                    return currentHour >= startHour || currentHour < endHour;
                  }
                  return currentHour >= startHour && currentHour < endHour;
                });

                const booking = bookings.find((b) => {
                  if (b.date !== dayDate) return false;
                  const bookingStartHour = Number.parseInt(b.time.split(":")[0]);
                  return currentHour === bookingStartHour;
                });

                const isSlotStart = timeSlot && Number.parseInt(timeSlot.start.split(":")[0]) === currentHour;

                return (
                  <div
                    key={`${dayIndex}-${timeIndex}`}
                    className={`week-time-slot p-1 transition-all duration-200 relative ${
                      booking
                        ? "bg-[var(--color-booked-green)] text-white"
                        : timeSlot?.isAvailable
                          ? "bg-[var(--color-available-green)]"
                          : "bg-white border border-[var(--color-medium-gray)]"
                    }`}
                  >
                    {booking && (
                      <div className="text-xs">
                        <div className="font-semibold truncate">{booking.providerName}</div>
                        <div className="truncate">${booking.providerRate}</div>
                      </div>
                    )}
                    {timeSlot && !booking && isSlotStart && (
                      <div className="text-xs text-center">
                        <div className="font-medium">Available</div>
                        <div className="text-xs opacity-75">{formatDuration(timeSlot.start, timeSlot.end)}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthDays = getMonthDays(currentDate);
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    if (isLoadingAvailability || isLoadingBookings) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 dashboard-text-primary" />
            <p className="dashboard-text-secondary">Loading calendar...</p>
          </div>
        </div>
      );
    }

    return (
      <div>
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

        <div className="calendar-grid">
          {monthDays.map((day, index) => {
            if (!day) {
              return <div key={index} className="calendar-cell bg-[var(--color-light-gray)]" />;
            }

            const dayBookings = bookings.filter((b) => b.date === day.toISOString().split("T")[0]);
            const dayAvailability = weeklyAvailability.find((d) => d.date === day.toISOString().split("T")[0]);
            const isToday = day.toDateString() === realTime?.toDateString();

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
                    <div className="text-xs truncate">{booking.providerName}</div>
                    <div className="text-xs opacity-75">${booking.providerRate}</div>
                  </div>
                ))}

                {dayAvailability?.timeSlots
                  .filter((slot) => slot.isAvailable)
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
            <Link href="/provider-dashboard/schedule/edit" className="no-underline">
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
                onClick={() => setViewMode("week")}
                className={viewMode === "week" ? "dashboard-button-primary text-white" : "dashboard-text-primary"}
              >
                <List className="w-4 h-4 mr-2" />
                Week
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("month")}
                className={viewMode === "month" ? "dashboard-button-primary text-white" : "dashboard-text-primary"}
              >
                <Grid className="w-4 h-4 mr-2" />
                Month
              </Button>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-1">
                <div className="font-semibold">Errors occurred:</div>
                {errors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

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

        {/* No Availability Message for New Providers */}
        {!isLoadingAvailability && !isLoadingBookings && 
         weeklyAvailability.every(day => day.timeSlots.length === 0) && 
         bookings.length === 0 && (
          <Card className="dashboard-card mb-6">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="text-6xl">📅</div>
                <div>
                  <h3 className="text-xl font-bold dashboard-text-primary mb-2">No availability set yet</h3>
                  <p className="dashboard-text-secondary mb-4">
                    You haven&apos;t configured your availability schedule. Set up your working hours to start receiving bookings.
                  </p>
                </div>
                <Link href="/provider-dashboard/schedule/edit" className="no-underline">
                  <Button className="dashboard-button-primary text-white">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Set Up Your Availability
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

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
                <div className="w-4 h-4 rounded border-2 border-[var(--color-primary-orange)]"></div>
                <span className="text-sm dashboard-text-primary">Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
