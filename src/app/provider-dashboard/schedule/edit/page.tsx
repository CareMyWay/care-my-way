"use client";

import type React from "react";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Calendar,
  Clock,
  Save,
  ArrowLeft,
  AlertTriangle,
  X,
  RotateCcw,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from "aws-amplify/auth";
import type { Schema } from "../../../../../amplify/data/resource";
const client = generateClient<Schema>();

interface TimeSlot {
  time: string;
  available: boolean;
  isBlocked?: boolean; // For maintenance, breaks, etc.
}

interface DaySchedule {
  day: string;
  date: string; 
  enabled: boolean;
  slots: TimeSlot[];
}

interface SelectionState {
  isSelecting: boolean;
  startSlot: string | null;
  endSlot: string | null;
  dayIndex: number | null;
  mode: "available" | "unavailable";
}

export default function EditAvailabilityPage() {
  const [realTime, setRealTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  // TODO: This should come from authentication context
  const currentProviderId = "current-provider-id";
  const currentProfileOwner = "current-user-id";
  
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    // Start with next week (1 week ahead)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // Get start of week (Monday)
    const startOfWeek = new Date(nextWeek);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    return startOfWeek;
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [selection, setSelection] = useState<SelectionState>({
    isSelecting: false,
    startSlot: null,
    endSlot: null,
    dayIndex: null,
    mode: "available",
  });

  // Generate time slots (30-minute intervals from 6 AM to 11 PM)
  const timeSlots = useMemo((): string[] => {
    const slots = [];
    for (let hour = 6; hour < 23; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  }, []);

  const daysOfWeek = useMemo(() => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], []);

  // Get the current week's dates
  const getCurrentWeekDates = useCallback(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentWeekStart]);

  const weekDates = useMemo(() => getCurrentWeekDates(), [getCurrentWeekDates]);

  // Load availability data from backend
  const loadAvailabilityData = useCallback(async () => {
    setLoading(true);
    try {
      // Check authentication first
      try {
        await getCurrentUser();
      } catch (authError) {
        console.warn("User not authenticated, using mock data");
        setErrors(["Authentication required. Please log in to access your schedule."]);
        setLoading(false);
        return;
      }

      const startOfWeek = weekDates[0];
      const endOfWeek = weekDates[6];
      
      // Load availability data for this provider and current week
      const result = await client.models.Availability.list({
        filter: {
          providerId: { eq: currentProviderId }
        },
        limit: 500 // Add limit to prevent large data loads
      });

      // Filter on client side for better performance with small datasets
      const backendData = (result.data || []).filter(item => {
        if (item.date) {
          const itemDate = new Date(item.date);
          return itemDate >= startOfWeek && itemDate <= endOfWeek;
        }
        return false;
      });

      // Update weekly schedule with backend data
      setWeeklySchedule(prev => {
        return prev.map((daySchedule) => {
          const dayData = backendData.filter(item => 
            item.date === daySchedule.date
          );

          return {
            ...daySchedule,
            enabled: dayData.length > 0 || daySchedule.enabled,
            slots: daySchedule.slots.map(slot => {
              const matchingSlot = dayData.find(data => data.time === slot.time);
              return {
                ...slot,
                available: matchingSlot?.isAvailable === true || false,
                isBlocked: false // Can be enhanced later for blocked times
              };
            })
          };
        });
      });
    } catch (error) {
      console.error("Error loading availability data:", error);
      setErrors(prev => [...prev, "Failed to load existing availability data."]);
    } finally {
      setLoading(false);
    }
  }, [currentProviderId, weekDates]);

  // Initialize weekly schedule with current week's dates (memoized for performance)
  const initialWeeklySchedule = useMemo(() => {
    return daysOfWeek.map((day, index) => ({
      day,
      date: weekDates[index].toISOString().split("T")[0],
      enabled: true,
      slots: timeSlots.map((time) => ({
        time,
        available: time >= "09:00" && time <= "17:00",
        isBlocked: false,
      })),
    }));
  }, [daysOfWeek, weekDates, timeSlots]);

  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>(() => initialWeeklySchedule);

  const clearSelection = useCallback(() => {
    setSelection({
      isSelecting: false,
      startSlot: null,
      endSlot: null,
      dayIndex: null,
      mode: "available",
    });
  }, []);

  // Update schedule when week changes
  useEffect(() => {
    const newWeekDates = getCurrentWeekDates();
    setWeeklySchedule((prev) =>
      prev.map((day, index) => ({
        ...day,
        date: newWeekDates[index].toISOString().split("T")[0],
      })),
    );
    setHasChanges(false);
    setErrors([]);
    setWarnings([]);
    clearSelection();
  }, [currentWeekStart, getCurrentWeekDates, clearSelection]);

  // Real-time clock update (reduced frequency)
  useEffect(() => {
    const timer = setInterval(() => {
      setRealTime(new Date());
    }, 30000); // Update every 30 seconds instead of every second

    return () => clearInterval(timer);
  }, []);

  // Load data when component mounts or week changes
  useEffect(() => {
    loadAvailabilityData();
  }, [loadAvailabilityData]);

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

  const formatTimeSlot = (time: string) => {
    const [hour, minute] = time.split(":");
    const hourNum = Number.parseInt(hour);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const getWeekInfo = useCallback(() => {
    const startDate = currentWeekStart;
    const endDate = new Date(currentWeekStart);
    endDate.setDate(startDate.getDate() + 6);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStartCopy = new Date(startDate);
    weekStartCopy.setHours(0, 0, 0, 0);

    const diffTime = weekStartCopy.getTime() - today.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));

    let weekLabel = "";
    if (diffWeeks === 1) {
      weekLabel = "Next Week";
    } else if (diffWeeks === 2) {
      weekLabel = "2 Weeks Ahead";
    } else {
      weekLabel = `${diffWeeks} Weeks Ahead`;
    }

    return {
      startDate,
      endDate,
      weekLabel,
      weeksAhead: diffWeeks,
    };
  }, [currentWeekStart]);

  const getAvailableHoursForDay = useCallback((daySchedule: DaySchedule) => {
    if (!daySchedule.enabled) return 0;
    return daySchedule.slots.filter((slot) => slot.available).length * 0.5;
  }, []);

  const getTotalAvailableHours = useCallback(() => {
    return weeklySchedule.reduce((total, day) => total + getAvailableHoursForDay(day), 0);
  }, [weeklySchedule, getAvailableHoursForDay]);

  const canEditCurrentWeek = useCallback(() => {
    const { weeksAhead } = getWeekInfo();
    return weeksAhead >= 1; // Can only edit 1 week ahead or more
  }, [getWeekInfo]);

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + (direction === "next" ? 7 : -7));

    // Don't allow going to current week or past weeks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minAllowedWeek = new Date(today);
    minAllowedWeek.setDate(today.getDate() + 7); // Next week minimum

    if (newWeekStart >= minAllowedWeek) {
      setCurrentWeekStart(newWeekStart);
    }
  };

  const validateSchedule = useCallback(() => {
    const newErrors: string[] = [];
    const newWarnings: string[] = [];

    if (!canEditCurrentWeek()) {
      newErrors.push("Cannot edit availability for the current week. Please select next week or later.");
      setErrors(newErrors);
      setWarnings(newWarnings);
      return false;
    }

    weeklySchedule.forEach((day) => {
      if (!day.enabled) return;

      const availableSlots = day.slots.filter((slot) => slot.available);
      const totalHours = availableSlots.length * 0.5;

      // Check for minimum availability
      if (totalHours < 1) {
        newWarnings.push(`${day.day}: Less than 1 hour of availability`);
      }

      // Check for gaps in availability (potential issues)
      let consecutiveUnavailable = 0;
      let hasLongGap = false;

      day.slots.forEach((slot) => {
        if (!slot.available) {
          consecutiveUnavailable++;
        } else {
          if (consecutiveUnavailable >= 6) {
            // 3+ hour gap
            hasLongGap = true;
          }
          consecutiveUnavailable = 0;
        }
      });

      if (hasLongGap) {
        newWarnings.push(`${day.day}: Long gaps in availability may confuse clients`);
      }

      // Check for very early or very late hours
      const earlySlots = day.slots.filter((slot) => slot.available && slot.time < "07:00");
      const lateSlots = day.slots.filter((slot) => slot.available && slot.time >= "22:00");

      if (earlySlots.length > 0) {
        newWarnings.push(`${day.day}: Very early hours (before 7 AM) selected`);
      }
      if (lateSlots.length > 0) {
        newWarnings.push(`${day.day}: Very late hours (after 10 PM) selected`);
      }
    });

    // Check total weekly availability
    const totalWeeklyHours = getTotalAvailableHours();
    if (totalWeeklyHours < 10) {
      newWarnings.push("Total weekly availability is less than 10 hours");
    }
    if (totalWeeklyHours > 60) {
      newWarnings.push("Total weekly availability exceeds 60 hours - consider work-life balance");
    }

    // Check if no days are enabled
    const enabledDays = weeklySchedule.filter((day) => day.enabled);
    if (enabledDays.length === 0) {
      newErrors.push("At least one day must be enabled");
    }

    setErrors(newErrors);
    setWarnings(newWarnings);
    return newErrors.length === 0;
  }, [canEditCurrentWeek, weeklySchedule, getTotalAvailableHours]);

  const toggleDayEnabled = (dayIndex: number) => {
    if (!canEditCurrentWeek()) return;

    setWeeklySchedule((prev) => {
      const updated = [...prev];
      updated[dayIndex].enabled = !updated[dayIndex].enabled;
      return updated;
    });
    setHasChanges(true);
  };

  const handleSlotClick = (dayIndex: number, slotIndex: number, event: React.MouseEvent) => {
    if (!canEditCurrentWeek()) return;

    const slot = weeklySchedule[dayIndex].slots[slotIndex];

    // Can't modify blocked slots
    if (slot.isBlocked) {
      return;
    }

    // Can't modify if day is disabled
    if (!weeklySchedule[dayIndex].enabled) {
      return;
    }

    const isShiftPressed = event.shiftKey;
    const isCtrlPressed = event.ctrlKey || event.metaKey;

    if (isShiftPressed && selection.startSlot && selection.dayIndex === dayIndex) {
      // Range selection
      handleRangeSelection(dayIndex, slotIndex);
    } else if (isCtrlPressed) {
      // Multi-select mode
      toggleSingleSlot(dayIndex, slotIndex);
    } else {
      // Single click or start new selection
      if (selection.isSelecting && selection.dayIndex === dayIndex) {
        // Complete range selection
        handleRangeSelection(dayIndex, slotIndex);
      } else {
        // Start new selection or toggle single
        startSelection(dayIndex, slotIndex);
      }
    }
  };

  const startSelection = (dayIndex: number, slotIndex: number) => {
    const slot = weeklySchedule[dayIndex].slots[slotIndex];
    const newMode = slot.available ? "unavailable" : "available";

    setSelection({
      isSelecting: true,
      startSlot: slot.time,
      endSlot: null,
      dayIndex,
      mode: newMode,
    });

    // Also toggle the clicked slot
    toggleSingleSlot(dayIndex, slotIndex);
  };

  const handleRangeSelection = (dayIndex: number, endSlotIndex: number) => {
    if (!selection.startSlot || selection.dayIndex !== dayIndex) return;

    const startSlotIndex = timeSlots.findIndex((time) => time === selection.startSlot);
    const minIndex = Math.min(startSlotIndex, endSlotIndex);
    const maxIndex = Math.max(startSlotIndex, endSlotIndex);

    setWeeklySchedule((prev) => {
      const updated = [...prev];
      for (let i = minIndex; i <= maxIndex; i++) {
        const slot = updated[dayIndex].slots[i];
        if (!slot.isBlocked) {
          slot.available = selection.mode === "available";
        }
      }
      return updated;
    });

    // Clear selection
    setSelection({
      isSelecting: false,
      startSlot: null,
      endSlot: null,
      dayIndex: null,
      mode: "available",
    });

    setHasChanges(true);
  };

  const toggleSingleSlot = (dayIndex: number, slotIndex: number) => {
    setWeeklySchedule((prev) => {
      const updated = [...prev];
      const slot = updated[dayIndex].slots[slotIndex];
      if (!slot.isBlocked) {
        slot.available = !slot.available;
      }
      return updated;
    });
    setHasChanges(true);
  };

  const setDayHours = (dayIndex: number, startTime: string, endTime: string) => {
    if (!canEditCurrentWeek()) return;

    setWeeklySchedule((prev) => {
      const updated = [...prev];
      updated[dayIndex].slots = updated[dayIndex].slots.map((slot) => ({
        ...slot,
        available: !slot.isBlocked && slot.time >= startTime && slot.time <= endTime,
      }));
      return updated;
    });
    setHasChanges(true);
    clearSelection();
  };

  const copyDayToAll = (sourceDayIndex: number) => {
    if (!canEditCurrentWeek()) return;

    const sourceDay = weeklySchedule[sourceDayIndex];
    setWeeklySchedule((prev) => {
      return prev.map((day, index) => ({
        ...day,
        enabled: index === sourceDayIndex ? day.enabled : sourceDay.enabled,
        slots:
          index === sourceDayIndex
            ? day.slots
            : day.slots.map((slot, slotIndex) => ({
                ...slot,
                available: slot.isBlocked ? slot.available : sourceDay.slots[slotIndex].available,
              })),
      }));
    });
    setHasChanges(true);
    clearSelection();
  };

  const clearDay = (dayIndex: number) => {
    if (!canEditCurrentWeek()) return;

    setWeeklySchedule((prev) => {
      const updated = [...prev];
      updated[dayIndex].slots = updated[dayIndex].slots.map((slot) => ({
        ...slot,
        available: slot.isBlocked ? slot.available : false,
      }));
      return updated;
    });
    setHasChanges(true);
    clearSelection();
  };

  const applyPreset = (preset: "business" | "extended" | "evening" | "weekend") => {
    if (!canEditCurrentWeek()) return;

    setWeeklySchedule((prev) => {
      return prev.map((day) => {
        let enabled = true;
        let availableSlots: string[] = [];

        switch (preset) {
          case "business":
            enabled = !["Saturday", "Sunday"].includes(day.day);
            availableSlots = timeSlots.filter((time) => time >= "09:00" && time <= "17:00");
            break;
          case "extended":
            enabled = !["Sunday"].includes(day.day);
            availableSlots = timeSlots.filter((time) => time >= "08:00" && time <= "20:00");
            break;
          case "evening":
            enabled = true;
            availableSlots = timeSlots.filter((time) => time >= "17:00" && time <= "22:00");
            break;
          case "weekend":
            enabled = ["Saturday", "Sunday"].includes(day.day);
            availableSlots = timeSlots.filter((time) => time >= "10:00" && time <= "18:00");
            break;
        }

        return {
          ...day,
          enabled,
          slots: day.slots.map((slot) => ({
            ...slot,
            available: slot.isBlocked ? slot.available : availableSlots.includes(slot.time),
          })),
        };
      });
    });
    setHasChanges(true);
    clearSelection();
  };

  const saveSchedule = async () => {
    if (!validateSchedule()) {
      return;
    }

    setIsSaving(true);

    try {
      // First, delete existing availability records for this provider and this week
      const existingRecords = await client.models.Availability.list({
        filter: {
          providerId: { eq: currentProviderId }
        }
      });

      // Filter for this week's records and delete them
      const thisWeekRecords = (existingRecords.data || []).filter(record => {
        if (record.date) {
          const recordDate = new Date(record.date);
          const startOfWeek = weekDates[0];
          const endOfWeek = weekDates[6];
          return recordDate >= startOfWeek && recordDate <= endOfWeek;
        }
        return false;
      });

      for (const record of thisWeekRecords) {
        await client.models.Availability.delete({ id: record.id });
      }

      // Create new records based on current schedule
      const createPromises: Promise<unknown>[] = [];

      weeklySchedule.forEach((daySchedule) => {
        if (daySchedule.enabled) {
          daySchedule.slots.forEach((slot) => {
            if (slot.available && !slot.isBlocked) {
              createPromises.push(
                client.models.Availability.create({
                  providerId: [currentProviderId],
                  profileOwner: [currentProfileOwner],
                  date: [daySchedule.date],
                  time: [slot.time],
                  duration: ["1.0"], // 1 hour duration
                  isAvailable: ["true"],
                  isRecurring: ["false"], // This is for specific dates, not recurring
                  dayOfWeek: [daySchedule.day.toLowerCase()],
                  notes: [""]
                })
              );
            }
          });
        }
      });

      // Execute all creates
      await Promise.all(createPromises);

      setHasChanges(false);
      setLastSaved(new Date());
      setErrors([]);
      
      // Reload data to ensure consistency
      await loadAvailabilityData();
    } catch (error) {
      console.error("Error saving schedule:", error);
      setErrors(["Failed to save schedule. Please try again."]);
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefault = () => {
    if (!canEditCurrentWeek()) return;

    setWeeklySchedule((prev) =>
      prev.map((day) => ({
        ...day,
        enabled: true,
        slots: timeSlots.map((time) => ({
          time,
          available: time >= "09:00" && time <= "17:00",
          isBlocked: false,
        })),
      })),
    );
    setHasChanges(true);
    clearSelection();
  };

  const getSlotClassName = useCallback((slot: TimeSlot, dayIndex: number) => {
    const baseClasses = "p-2 text-xs rounded transition-all duration-200 border cursor-pointer select-none";
    const canEdit = canEditCurrentWeek();

    if (slot.isBlocked) {
      return `${baseClasses} bg-red-100 border-red-300 text-red-600 cursor-not-allowed`;
    }

    if (!weeklySchedule[dayIndex].enabled || !canEdit) {
      return `${baseClasses} bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed`;
    }

    if (slot.available) {
      return `${baseClasses} bg-[var(--color-available-green)] border-[var(--color-success-green)] text-[var(--color-success-green)] hover:bg-[var(--color-success-green)] hover:text-white`;
    }

    return `${baseClasses} bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:border-gray-300`;
  }, [canEditCurrentWeek, weeklySchedule]);

  const getSlotTitle = useCallback((slot: TimeSlot, dayIndex: number) => {
    if (!canEditCurrentWeek()) {
      return `${formatTimeSlot(slot.time)} - Cannot edit current week`;
    }

    if (slot.isBlocked) {
      return `${formatTimeSlot(slot.time)} - Blocked (unavailable)`;
    }

    if (!weeklySchedule[dayIndex].enabled) {
      return `${formatTimeSlot(slot.time)} - Day disabled`;
    }

    const action = slot.available ? "disable" : "enable";
    const shortcuts = "Shift+Click for range, Ctrl+Click for multi-select";
    return `${formatTimeSlot(slot.time)} - Click to ${action}\n${shortcuts}`;
  }, [canEditCurrentWeek, weeklySchedule]);

  // Validate on schedule changes (debounced for performance)
  useEffect(() => {
    if (hasChanges) {
      const timeoutId = setTimeout(() => {
        validateSchedule();
      }, 300); // Debounce validation by 300ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [weeklySchedule, hasChanges, validateSchedule]);

  const { startDate, endDate, weekLabel, weeksAhead } = getWeekInfo();

  return (
    <div className="min-h-screen dashboard-bg-primary p-6">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your availability schedule...</p>
          </div>
        </div>
      ) : (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/provider-dashboard/schedule">
              <Button variant="outline" className="dashboard-button-secondary flex items-center gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Back to Schedule
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold dashboard-text-primary">Edit Weekly Availability</h1>
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
          </div>

          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            {lastSaved && (
              <div className="text-sm dashboard-text-secondary">Last saved: {lastSaved.toLocaleTimeString()}</div>
            )}
            <Button
              onClick={saveSchedule}
              disabled={!hasChanges || isSaving || errors.length > 0 || !canEditCurrentWeek()}
              className="dashboard-button-primary text-white"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <Card className="dashboard-card mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigateWeek("prev")}
                className="dashboard-button-secondary"
                disabled={weeksAhead <= 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Week
              </Button>

              <div className="text-center">
                <h2 className="text-2xl font-semibold dashboard-text-primary">
                  {startDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {endDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h2>
                <p className="text-sm dashboard-text-secondary font-medium">{weekLabel}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {weekDates.map((date, index) => (
                    <div key={index} className="text-xs dashboard-text-secondary">
                      {daysOfWeek[index].slice(0, 3)} {date.getDate()}
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" onClick={() => navigateWeek("next")} className="dashboard-button-secondary">
                Next Week
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Week Restriction Alert */}
        {!canEditCurrentWeek() && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="font-semibold">Cannot edit current week availability</div>
              <div>
                You can only modify availability for next week and beyond. Please navigate to next week to make changes.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-1">
                <div className="font-semibold">Please fix these errors:</div>
                {errors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Warning Messages */}
        {warnings.length > 0 && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <Info className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="space-y-1">
                <div className="font-semibold">Recommendations:</div>
                {warnings.map((warning, index) => (
                  <div key={index}>• {warning}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Unsaved Changes Alert */}
        {hasChanges && canEditCurrentWeek() && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              You have unsaved changes. Don&#39;t forget to save your availability updates.
            </AlertDescription>
          </Alert>
        )}

        {/* Selection Info */}
        {selection.isSelecting && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 flex items-center justify-between">
              <span>Range selection mode: Click another slot to complete selection, or press Escape to cancel</span>
              <Button size="sm" variant="ghost" onClick={clearSelection} className="text-blue-600 hover:text-blue-800">
                Cancel
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Stats */}
        <Card className="dashboard-card mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-2xl font-bold dashboard-text-primary">{getTotalAvailableHours()}h</div>
                  <div className="text-sm dashboard-text-secondary">Total weekly hours</div>
                </div>
                <div>
                  <div className="text-2xl font-bold dashboard-text-primary">
                    {weeklySchedule.filter((day) => day.enabled).length}
                  </div>
                  <div className="text-sm dashboard-text-secondary">Active days</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={resetToDefault}
                  variant="outline"
                  className="dashboard-button-secondary bg-transparent"
                  disabled={!canEditCurrentWeek()}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Default
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="dashboard-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg dashboard-text-primary">How to Select Time Slots</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-gray-100 border rounded flex items-center justify-center text-xs">Click</div>
                <span>Toggle single time slot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-gray-100 border rounded flex items-center justify-center text-xs">Shift</div>
                <span>Select range of time slots</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-gray-100 border rounded flex items-center justify-center text-xs">Ctrl</div>
                <span>Multi-select individual slots</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Presets */}
        <Card className="dashboard-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg dashboard-text-primary">Quick Presets</CardTitle>
            <p className="text-sm dashboard-text-secondary">Apply common availability patterns</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                onClick={() => applyPreset("business")}
                className="dashboard-button-secondary h-16 flex flex-col"
                disabled={!canEditCurrentWeek()}
              >
                <span className="font-semibold">Business Hours</span>
                <span className="text-xs opacity-75">Mon-Fri, 9AM-5PM</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => applyPreset("extended")}
                className="dashboard-button-secondary h-16 flex flex-col"
                disabled={!canEditCurrentWeek()}
              >
                <span className="font-semibold">Extended Hours</span>
                <span className="text-xs opacity-75">Mon-Sat, 8AM-8PM</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => applyPreset("evening")}
                className="dashboard-button-secondary h-16 flex flex-col"
                disabled={!canEditCurrentWeek()}
              >
                <span className="font-semibold">Evening Hours</span>
                <span className="text-xs opacity-75">All days, 5PM-10PM</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => applyPreset("weekend")}
                className="dashboard-button-secondary h-16 flex flex-col"
                disabled={!canEditCurrentWeek()}
              >
                <span className="font-semibold">Weekends Only</span>
                <span className="text-xs opacity-75">Sat-Sun, 10AM-6PM</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Schedule Grid */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="dashboard-text-primary">Weekly Schedule</CardTitle>
            <p className="text-sm dashboard-text-secondary">
              {canEditCurrentWeek()
                ? "Click time slots to toggle availability. Green = available, Gray = unavailable."
                : "Navigate to next week or later to edit availability."}
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {weeklySchedule.map((daySchedule, dayIndex) => (
                <div key={`${daySchedule.day}-${daySchedule.date}`} className="space-y-3">
                  {/* Day Header */}
                  <div className="flex items-center justify-between p-4 bg-[var(--color-light-gray)] rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`day-${dayIndex}`}
                          checked={daySchedule.enabled}
                          onCheckedChange={() => toggleDayEnabled(dayIndex)}
                          disabled={!canEditCurrentWeek()}
                        />
                        <Label
                          htmlFor={`day-${dayIndex}`}
                          className={`text-lg font-semibold cursor-pointer ${
                            daySchedule.enabled && canEditCurrentWeek() ? "dashboard-text-primary" : "text-gray-400"
                          }`}
                        >
                          {daySchedule.day}
                        </Label>
                        <span className="text-sm dashboard-text-secondary">
                          ({weekDates[dayIndex].toLocaleDateString("en-US", { month: "short", day: "numeric" })})
                        </span>
                      </div>
                      {daySchedule.enabled && (
                        <div className="text-sm dashboard-text-secondary">
                          {getAvailableHoursForDay(daySchedule)}h available
                        </div>
                      )}
                    </div>

                    {daySchedule.enabled && canEditCurrentWeek() && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDayHours(dayIndex, "09:00", "17:00")}
                          className="text-xs dashboard-button-secondary"
                        >
                          9-5
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDayHours(dayIndex, "08:00", "18:00")}
                          className="text-xs dashboard-button-secondary"
                        >
                          8-6
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyDayToAll(dayIndex)}
                          className="text-xs dashboard-button-secondary"
                        >
                          Copy to All
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => clearDay(dayIndex)}
                          className="text-xs dashboard-button-secondary"
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Time Slots Grid */}
                  {daySchedule.enabled && (
                    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 p-4 bg-white rounded-lg border border-[var(--color-medium-gray)]">
                      {daySchedule.slots.map((slot, slotIndex) => (
                        <button
                          key={slot.time}
                          onClick={(e) => handleSlotClick(dayIndex, slotIndex, e)}
                          className={getSlotClassName(slot, dayIndex)}
                          title={getSlotTitle(slot, dayIndex)}
                          disabled={slot.isBlocked || !canEditCurrentWeek()}
                        >
                          <div className="font-medium">{formatTimeSlot(slot.time)}</div>
                          {slot.isBlocked && <div className="text-xs opacity-75 mt-1">Blocked</div>}
                        </button>
                      ))}
                    </div>
                  )}

                  {!daySchedule.enabled && (
                    <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-lg">
                      <X className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Day is disabled</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="dashboard-card mt-6">
          <CardHeader>
            <CardTitle className="dashboard-text-primary">Legend & Tips</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold dashboard-text-primary">Time Slot Colors</h4>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[var(--color-available-green)] border border-[var(--color-success-green)]"></div>
                  <span className="text-sm dashboard-text-primary">Available - Click to disable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-50 border border-gray-200"></div>
                  <span className="text-sm dashboard-text-primary">Unavailable - Click to enable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
                  <span className="text-sm dashboard-text-primary">Blocked - Cannot modify</span>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold dashboard-text-primary">Selection Tips</h4>
                <ul className="text-sm dashboard-text-secondary space-y-1">
                  <li>• Can only edit next week and beyond</li>
                  <li>• Click individual slots to toggle availability</li>
                  <li>• Hold Shift and click to select a range</li>
                  <li>• Hold Ctrl/Cmd and click for multi-select</li>
                  <li>• Use quick buttons for common hour ranges</li>
                  <li>• Save regularly to avoid losing changes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  );
}
