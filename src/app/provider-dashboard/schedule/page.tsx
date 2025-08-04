"use client";

import React, { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Edit3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";
import { getCurrentUser } from "@aws-amplify/auth";

const provider = generateClient<Schema>();

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

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekData, setWeekData] = useState<DayAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAvailability, setHasAvailability] = useState<boolean | null>(null);

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);

    // Get Monday of the current week
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const formatTimeSlot = (time: string): string => {
    const [hour, minute] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  const loadAvailability = React.useCallback(async () => {
    try {
      const user = await getCurrentUser();
      setIsLoading(true);
      const weekDays = getWeekDays(currentWeek);
      const dayNameMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      const { data: profiles } = await provider.models.ProviderProfile.list({
        filter: { userId: { eq: user?.userId } },
      });

      if (profiles && profiles.length > 0) {
        const profile = profiles[0];
        const availability = await provider.models.ProviderAvailability.list({
          filter: { providerId: { eq: profile.userId } },
        });

        if (!availability.data.length){
          setHasAvailability(false);
          setWeekData([]);
          setIsLoading(false);
          return;
        }

        const availabilityRecord = availability.data[0];

        if (!availabilityRecord.weeklyTemplate) {
          setHasAvailability(false);
          setWeekData([]);
          setIsLoading(false);
          return;
        }

        // Parsing weekly template
        const weeklyTemplate: Record<string, string[]> =
          typeof availabilityRecord.weeklyTemplate === "string"
            ? JSON.parse(availabilityRecord.weeklyTemplate)
            : availabilityRecord.weeklyTemplate;

        setHasAvailability(true);

        // Map weekDays to DayAvailability by matching day short name keys in weeklyTemplate
        const dayAvailability: DayAvailability[] = weekDays.map((day) => {
          const dayName = dayNameMap[day.getDay()]; // e.g. "Wed"
          const times = weeklyTemplate[dayName] || [];

          // Create TimeSlots for each time string
          const timeSlots: TimeSlot[] = times.map((time, index) => {
            const [hour, minute = "00"] = time.split(":");
            const startTime = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
            const nextHour = (parseInt(hour) + 1).toString().padStart(2, "0");
            const endTime = `${nextHour}:00`;

            return {
              id: `slot-${day.toISOString().split("T")[0]}-${startTime}-${index}`,
              start: startTime,
              end: endTime,
              isAvailable: true,
            };
          });
        
          return {
            date: day.toISOString().split("T")[0],
            isEnabled: timeSlots.length > 0,
            timeSlots,
          };
        });

        setWeekData(dayAvailability);
          } else {
            setHasAvailability(false);
            setWeekData([]);
          }
        } catch (error) {
          console.error("Error loading availability:", error);
          setHasAvailability(false);
          setWeekData([]);
        } finally {
          setIsLoading(false);
        }
      }, [currentWeek]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek((prev) => {
      const newWeek = new Date(prev);
      newWeek.setDate(prev.getDate() + (direction === "next" ? 7 : -7));
      return newWeek;
    });
  };

  const getTotalHoursForWeek = () => {
    return weekData.reduce((total, day) => total + day.timeSlots.length, 0);
  };

  const weekDays = getWeekDays(currentWeek);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading schedule...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Schedule</h1>
        </div>
        <Link href="/provider-dashboard/schedule/edit">
          <Button className="flex items-center space-x-2 bg-orange-500 text-white hover:bg-orange-600">
            <Edit3 className="h-4 w-4" />
            <span>Edit Availability</span>
          </Button>
        </Link>
      </div>

      {hasAvailability === false && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Availability Set</h3>
              <p className="text-gray-600 mb-4">
                You haven&#39;t set up your availability yet. Click the button below to get started.
              </p>
              <Link href="/provider-dashboard/schedule/edit">
                <Button className="flex items-center space-x-2 bg-orange-500 text-white hover:bg-orange-600 mx-auto">Set Up Availability</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {hasAvailability && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => navigateWeek("prev")} className="flex items-center space-x-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous Week</span>
                </Button>

                <div className="text-center">
                  <CardTitle className="text-xl">
                    Week of{" "}
                    {weekDays[0].toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </CardTitle>
                  <div className="flex items-center justify-center space-x-4 mt-2">
                    <Badge variant="secondary">{getTotalHoursForWeek()} hours available</Badge>
                  </div>
                </div>

                <Button variant="outline" onClick={() => navigateWeek("next")} className="flex items-center space-x-2">
                  <span>Next Week</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
            {weekData.map((day, index) => (
              <Card key={`day-${day.date}-${index}`} className="h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="text-center">
                    <div className="text-sm font-medium">
                      {weekDays[index].toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-lg font-bold">
                      {weekDays[index].toLocaleDateString("en-US", { day: "numeric" })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {weekDays[index].toLocaleDateString("en-US", { month: "short" })}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {day.isEnabled ? (
                    <div className="space-y-1">
                      <div className="text-center mb-2">
                        <Badge variant="default" className="text-xs">
                          {day.timeSlots.length} hours
                        </Badge>
                      </div>
                      <div className="space-y-1 max-h-64 overflow-y-auto">
                        {day.timeSlots.map((slot, slotIndex) => (
                          <div
                            key={`${slot.id}-${slotIndex}`}
                            className="p-1.5 bg-green-50 border border-green-200 rounded text-center"
                          >
                            <span className="text-xs">{formatTimeSlot(slot.start)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-400 text-sm">Unavailable</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Weekly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{getTotalHoursForWeek()}</div>
                  <div className="text-sm text-gray-500">Hours Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-500">Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {weekData.filter((day) => day.isEnabled).length}
                  </div>
                  <div className="text-sm text-gray-500">Active Days</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
