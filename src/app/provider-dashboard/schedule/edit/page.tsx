"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";
import "@/app/amplify-config";
import { getCurrentUser } from "aws-amplify/auth";

const provider = generateClient<Schema>();

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_OPTIONS = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, "0")}:00`;
});

export default function EditSchedulePage() {
  const [currentDate] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setIsLoading(true);
      const { data: profiles } = await provider.models.ProviderProfile.list();
      if (profiles && profiles.length > 0) {
        const profile = profiles[0];
        const availability = profile.availability || [];

        // Parse existing availability into the weekly template
        const map: Record<string, boolean> = {};

        // Group availability by day of week and hour
        const weeklyPattern: Record<string, Set<string>> = {};

        availability.forEach((slot) => {
          const [dateStr, hourStr] = slot.split(":");
          const date = new Date(`${dateStr  }T00:00:00`);
          const dayOfWeek = date.getDay();
          // Convert Sunday (0) to index 6, Monday (1) to index 0, etc.
          const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          const dayName = DAYS_OF_WEEK[dayIndex];

          if (!weeklyPattern[dayName]) {
            weeklyPattern[dayName] = new Set();
          }
          weeklyPattern[dayName].add(hourStr.padStart(2, "0"));
        });

        // Convert to availability map for the UI
        Object.entries(weeklyPattern).forEach(([day, hours]) => {
          hours.forEach((hour) => {
            map[`${day}-${hour}`] = true;
          });
        });

        setAvailabilityMap(map);
      }
    } catch (error) {
      console.error("Error loading schedule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSlot = (day: string, hour: string) => {
    const key = `${day}-${hour}`;
    setAvailabilityMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveSchedule = async () => {
  const user = await getCurrentUser();
  console.log("Saving schedule with availabilityMap:", availabilityMap);
  setIsSaving(true);
  try {
    // Build the weeklyTemplate from availabilityMap
    const weeklyTemplate: Record<string, string[]> = {};

    DAYS_OF_WEEK.forEach((day) => {
      TIME_OPTIONS.forEach((time) => {
        const hour = time.split(":")[0];
        const key = `${day}-${hour}`;
        if (availabilityMap[key]) {
          if (!weeklyTemplate[day]) {
            weeklyTemplate[day] = [];
          }
          weeklyTemplate[day].push(time);
        }
      });
    });

    // Sort each day's time slots
    for (const day in weeklyTemplate) {
      weeklyTemplate[day].sort();
    }

    // Fetch the current provider profile
    const { data: profiles } = await provider.models.ProviderProfile.list({
      filter: { userId: { eq: user?.userId } },
    });
    const profile = profiles?.[0];

    if (!profile) {
      throw new Error("No provider profile found.");
    }

    // Check if availability record already exists
    const existing = await provider.models.ProviderAvailability.list({
      filter: { providerId: { eq: profile.userId } }
    });

    if (existing.data.length > 0) {
      // Update existing availability
      await provider.models.ProviderAvailability.update({
        id: existing.data[0].id,
        weeklyTemplate: JSON.stringify(weeklyTemplate),
        lastUpdated: new Date().toISOString()
      } as { id:string } & Schema["ProviderAvailability"]["type"]);
    } else {
      // Create new availability
      await provider.models.ProviderAvailability.create({
        providerId: profile.userId,
        profileOwner: profile.userId,
        weeklyTemplate: JSON.stringify(weeklyTemplate),
        lastUpdated: new Date().toISOString()
      } as Schema["ProviderAvailability"]["type"]);
    }

    // Redirect after successful save
    window.location.href = "/provider-dashboard/schedule";
  } catch (error) {
    console.error("Error saving schedule:", error);
    alert("Error saving schedule. Please try again.");
  } finally {
    setIsSaving(false);
  }
};


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/provider-dashboard/schedule">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold">Edit Weekly Availability</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {currentDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {currentDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={saveSchedule} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>

        {/* Schedule Grid */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Schedule Grid</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Click to enable/disable time blocks. This template will be applied to future weeks.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border text-center text-sm">
                <thead>
                  <tr>
                    <th className="border px-2 py-1 text-left w-20">Time</th>
                    {DAYS_OF_WEEK.map((day) => (
                      <th key={day} className="border px-2 py-1">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_OPTIONS.map((time) => {
                    const hour = time.split(":")[0];
                    return (
                      <tr key={time}>
                        <td className="border px-2 py-1 text-left font-medium">{time}</td>
                        {DAYS_OF_WEEK.map((day) => {
                          const key = `${day}-${hour}`;
                          const selected = availabilityMap[key] || false;
                          return (
                            <td
                              key={key}
                              onClick={() => toggleSlot(day, hour)}
                              className={`border cursor-pointer px-2 py-1 h-10 transition-colors
                                ${selected ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-white hover:bg-orange-100"}
                              `}
                            >
                              {selected ? "✓" : ""}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {DAYS_OF_WEEK.map((day) => {
                const daySlots = Object.keys(availabilityMap).filter(
                  (key) => key.startsWith(`${day}-`) && availabilityMap[key],
                ).length;
                return (
                  <div key={day} className="text-center">
                    <div className="font-medium">{day}</div>
                    <div className="text-sm text-gray-600">{daySlots} hours</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <div className="text-lg font-semibold">
                Total: {Object.values(availabilityMap).filter(Boolean).length} hours per week
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
