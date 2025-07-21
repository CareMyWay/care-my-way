"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, Save, ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";

const client = generateClient<Schema>();

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  day: string;
  enabled: boolean;
  timeSlots: TimeSlot[];
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Time options (hourly from 6 AM to 11 PM)
const TIME_OPTIONS = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, "0")}:00`;
});

export default function EditSchedulePage() {
  const [currentDate] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [schedule, setSchedule] = useState<DaySchedule[]>(() =>
    DAYS_OF_WEEK.map(day => ({
      day,
      enabled: false,
      timeSlots: []
    }))
  );

  // Load existing schedule
  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const { data: profiles } = await client.models.ProviderProfile.list();
      if (profiles && profiles.length > 0) {
        const profile = profiles[0];
        const availability = profile.availability || [];
        
        // Parse existing availability
        const scheduleMap: { [key: string]: TimeSlot[] } = {};
        
        availability.forEach(slot => {
          const [date, hourStr] = slot.split(":");
          const dayOfWeek = new Date(date).getDay();
          const dayName = DAYS_OF_WEEK[dayOfWeek === 0 ? 6 : dayOfWeek - 1]; // Convert Sunday=0 to Mon=0
          
          if (!scheduleMap[dayName]) {
            scheduleMap[dayName] = [];
          }
          
          const hour = parseInt(hourStr);
          const start = `${hour.toString().padStart(2, "0")}:00`;
          const end = `${(hour + 1).toString().padStart(2, "0")}:00`;
          
          scheduleMap[dayName].push({ start, end });
        });

        // Group consecutive hours into time ranges
        const newSchedule = DAYS_OF_WEEK.map(day => {
          const slots = scheduleMap[day] || [];
          if (slots.length === 0) {
            return { day, enabled: false, timeSlots: [] };
          }

          // Sort slots by start time
          slots.sort((a, b) => a.start.localeCompare(b.start));
          
          // Group consecutive hours
          const groupedSlots: TimeSlot[] = [];
          let currentGroup = slots[0];
          
          for (let i = 1; i < slots.length; i++) {
            const currentHour = parseInt(slots[i].start.split(":")[0]);
            const groupEndHour = parseInt(currentGroup.end.split(":")[0]);
            
            if (currentHour === groupEndHour) {
              // Consecutive hour, extend the group
              currentGroup.end = slots[i].end;
            } else {
              // Non-consecutive, start new group
              groupedSlots.push(currentGroup);
              currentGroup = slots[i];
            }
          }
          groupedSlots.push(currentGroup);

          return {
            day,
            enabled: true,
            timeSlots: groupedSlots
          };
        });

        setSchedule(newSchedule);
      }
    } catch (error) {
      console.error("Error loading schedule:", error);
    }
  };

  const toggleDay = (dayIndex: number) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { 
            ...day, 
            enabled: !day.enabled,
            timeSlots: !day.enabled ? [{ start: "09:00", end: "17:00" }] : []
          }
        : day
    ));
  };

  const addTimeSlot = (dayIndex: number) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { 
            ...day, 
            timeSlots: [...day.timeSlots, { start: "09:00", end: "17:00" }]
          }
        : day
    ));
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { 
            ...day, 
            timeSlots: day.timeSlots.filter((_, i) => i !== slotIndex)
          }
        : day
    ));
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: "start" | "end", value: string) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? {
            ...day,
            timeSlots: day.timeSlots.map((slot, i) => 
              i === slotIndex ? { ...slot, [field]: value } : slot
            )
          }
        : day
    ));
  };

  const saveSchedule = async () => {
    setIsSaving(true);
    try {
      // Convert schedule to availability format
      const availability: string[] = [];
      const today = new Date();
      
      // If applying to future, save for next 52 weeks
      const weeksToSave = applyToFuture ? 52 : 1;
      
      for (let week = 0; week < weeksToSave; week++) {
        schedule.forEach((day, dayIndex) => {
          if (!day.enabled) return;
          
          day.timeSlots.forEach(slot => {
            const startHour = parseInt(slot.start.split(":")[0]);
            const endHour = parseInt(slot.end.split(":")[0]);
            
            for (let hour = startHour; hour < endHour; hour++) {
              // Calculate the actual date for this day and week
              const weekStart = new Date(today);
              weekStart.setDate(today.getDate() + (week * 7) + (7 - today.getDay()) + 1); // Next Monday
              
              const scheduleDate = new Date(weekStart);
              scheduleDate.setDate(weekStart.getDate() + dayIndex);
              
              const dateStr = scheduleDate.toISOString().split("T")[0];
              availability.push(`${dateStr}:${hour.toString().padStart(2, "0")}`);
            }
          });
        });
      }

      // Update provider profile
      const { data: profiles } = await client.models.ProviderProfile.list();
      if (profiles && profiles.length > 0) {
        await client.models.ProviderProfile.update({
          id: profiles[0].id,
          availability
        } as unknown as Parameters<typeof client.models.ProviderProfile.update>[0]);
      }

      // Redirect back to schedule
      window.location.href = "/provider-dashboard/schedule";
    } catch (error) {
      console.error("Error saving schedule:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
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
                  <span>{currentDate.toLocaleDateString("en-US", { 
                    weekday: "long",
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{currentDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                  })}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="apply-future"
                checked={applyToFuture}
                onCheckedChange={checked => setApplyToFuture(checked === true)}
              />
              <Label htmlFor="apply-future" className="text-sm">
                Apply to all future weeks
              </Label>
            </div>
            
            <Button 
              onClick={saveSchedule}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
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
        </div>

        {/* Timezone Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">Timezone</Label>
              <Select defaultValue="America/Chicago">
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Chicago">America/Chicago (GMT-5)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (GMT-4)</SelectItem>
                  <SelectItem value="America/Los_Angeles">America/Los_Angeles (GMT-7)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Days Schedule */}
            <div className="space-y-4">
              {schedule.map((day, dayIndex) => (
                <div key={day.day} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={day.enabled}
                        onCheckedChange={() => toggleDay(dayIndex)}
                      />
                      <span className="font-medium">{day.day}</span>
                    </div>
                    {day.enabled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeSlot(dayIndex)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add hours
                      </Button>
                    )}
                  </div>

                  {day.enabled && (
                    <div className="space-y-2 ml-6">
                      {day.timeSlots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center gap-2">
                          <Select
                            value={slot.start}
                            onValueChange={(value) => updateTimeSlot(dayIndex, slotIndex, "start", value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <span className="text-gray-500">-</span>
                          
                          <Select
                            value={slot.end}
                            onValueChange={(value) => updateTimeSlot(dayIndex, slotIndex, "end", value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
