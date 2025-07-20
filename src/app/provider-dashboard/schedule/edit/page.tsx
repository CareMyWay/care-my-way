"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Calendar, Clock, Save, ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { AvailabilityManager, saveAvailabilityData } from "@/components/provider-dashboard-ui/availability-manager";
import { WeekNavigation } from "@/components/provider-dashboard-ui/week-navigation";
import { ScheduleGrid } from "@/components/provider-dashboard-ui/schedule-grid";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";

const client = generateClient<Schema>();

interface TimeSlot {
  time: string
  available: boolean
  isBlocked?: boolean
  availabilityId?: string
}

interface DaySchedule {
  day: string
  date: string
  enabled: boolean
  slots: TimeSlot[]
}

interface SelectionState {
  isSelecting: boolean
  startSlot: string | null
  endSlot: string | null
  dayIndex: number | null
  mode: "available" | "unavailable"
}

interface UserProfile {
  userId: string
  userType: string
  profileOwner: string
}

export default function EditAvailabilityPage() {
  const [realTime, setRealTime] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const startOfWeek = new Date(nextWeek);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);

  const [selection, setSelection] = useState<SelectionState>({
    isSelecting: false,
    startSlot: null,
    endSlot: null,
    dayIndex: null,
    mode: "available",
  });

  // Load user profile from backend
  const loadUserProfile = async () => {
    try {
      setIsLoadingUser(true);
      setErrors([]);

      // Get current user - you'll need to implement this based on your auth setup
      // For now, we'll try to get the first provider profile
      const { data: profiles, errors: profileErrors } = await client.models.UserProfile.list({
        filter: {
          userType: { eq: "Provider" },
        },
        limit: 1,
      });

      if (profileErrors && profileErrors.length > 0) {
        throw new Error(`Failed to load user profile: ${profileErrors[0].message}`);
      }

      if (!profiles || profiles.length === 0) {
        throw new Error("No provider profile found. Please create a provider profile first.");
      }

      const profile = profiles[0];
      setUserProfile({
        userId: profile.userId || "",
        userType: profile.userType || "Provider",
        profileOwner: profile.profileOwner || "",
      });
    } catch (err) {
      console.error("Error loading user profile:", err);
      setErrors([err instanceof Error ? err.message : "Failed to load user profile"]);
    } finally {
      setIsLoadingUser(false);
    }
  };

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setRealTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const canEditCurrentWeek = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStartCopy = new Date(currentWeekStart);
    weekStartCopy.setHours(0, 0, 0, 0);
    const diffTime = weekStartCopy.getTime() - today.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks >= 1;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + (direction === "next" ? 7 : -7));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minAllowedWeek = new Date(today);
    minAllowedWeek.setDate(today.getDate() + 7);

    if (newWeekStart >= minAllowedWeek) {
      setCurrentWeekStart(newWeekStart);
      setHasChanges(false); // Reset changes when navigating
    }
  };

  const handleScheduleLoaded = (schedule: DaySchedule[]) => {
    setWeeklySchedule(schedule);
    setIsLoadingSchedule(false);
    setHasChanges(false);
  };

  const handleSaveComplete = (success: boolean, message?: string) => {
    setIsSaving(false);
    if (success) {
      setHasChanges(false);
      setLastSaved(new Date());
      setErrors([]);
    } else if (message) {
      setErrors([message]);
    }
  };

  const saveChanges = async () => {
    if (!userProfile || !canEditCurrentWeek() || !hasChanges) return;

    try {
      setIsSaving(true);
      setErrors([]);

      await saveAvailabilityData(weeklySchedule, userProfile.userId, userProfile.profileOwner);

      setHasChanges(false);
      setLastSaved(new Date());
    } catch (err) {
      console.error("Error saving changes:", err);
      setErrors([err instanceof Error ? err.message : "Failed to save changes"]);
    } finally {
      setIsSaving(false);
    }
  };

  const getAvailableHoursForDay = (daySchedule: DaySchedule) => {
    if (!daySchedule.enabled) return 0;
    return daySchedule.slots.filter((slot) => slot.available).length * 0.5;
  };

  const getTotalAvailableHours = () => {
    return weeklySchedule.reduce((total, day) => total + getAvailableHoursForDay(day), 0);
  };

  // Selection and editing functions
  const handleSlotClick = (dayIndex: number, slotIndex: number, event: React.MouseEvent) => {
    if (!canEditCurrentWeek()) return;
    const slot = weeklySchedule[dayIndex].slots[slotIndex];
    if (slot.isBlocked || !weeklySchedule[dayIndex].enabled) return;

    const isShiftPressed = event.shiftKey;
    const isCtrlPressed = event.ctrlKey || event.metaKey;

    if (isShiftPressed && selection.startSlot && selection.dayIndex === dayIndex) {
      handleRangeSelection(dayIndex, slotIndex);
    } else if (isCtrlPressed) {
      toggleSingleSlot(dayIndex, slotIndex);
    } else {
      if (selection.isSelecting && selection.dayIndex === dayIndex) {
        handleRangeSelection(dayIndex, slotIndex);
      } else {
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
    toggleSingleSlot(dayIndex, slotIndex);
  };

  const handleRangeSelection = (dayIndex: number, endSlotIndex: number) => {
    if (!selection.startSlot || selection.dayIndex !== dayIndex) return;

    const timeSlots = weeklySchedule[dayIndex].slots.map((slot) => slot.time);
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

  const toggleDayEnabled = (dayIndex: number) => {
    if (!canEditCurrentWeek()) return;
    setWeeklySchedule((prev) => {
      const updated = [...prev];
      updated[dayIndex].enabled = !updated[dayIndex].enabled;
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
  };

  const canNavigatePrev = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStartCopy = new Date(currentWeekStart);
    weekStartCopy.setHours(0, 0, 0, 0);
    const diffTime = weekStartCopy.getTime() - today.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks > 1;
  };

  // Show loading state while loading user
  if (isLoadingUser) {
    return (
      <div className="min-h-screen dashboard-bg-primary p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 dashboard-text-primary" />
              <p className="dashboard-text-primary">Loading user profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no user profile
  if (!userProfile) {
    return (
      <div className="min-h-screen dashboard-bg-primary p-6">
        <div className="max-w-7xl mx-auto">
          <Alert className="border-red-200 bg-red-50 mt-8">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-2">
                <div className="font-semibold">Unable to load user profile</div>
                {errors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
                <div className="mt-4">
                  <Link href="/profile/setup">
                    <Button className="dashboard-button-primary text-white">Create Provider Profile</Button>
                  </Link>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/provider-dashboard/schedule" className="no-underline">
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
              onClick={saveChanges}
              disabled={!hasChanges || isSaving || !canEditCurrentWeek()}
              className="dashboard-button-primary text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
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

        {/* Availability Manager */}
        <AvailabilityManager
          providerId={userProfile.userId}
          profileOwner={userProfile.profileOwner}
          currentWeekStart={currentWeekStart}
          onScheduleLoaded={handleScheduleLoaded}
          onSaveComplete={handleSaveComplete}
        />

        {/* Week Navigation */}
        <WeekNavigation
          currentWeekStart={currentWeekStart}
          onNavigate={navigateWeek}
          canNavigatePrev={canNavigatePrev()}
        />

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

        {/* Loading Schedule */}
        {isLoadingSchedule && (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 dashboard-text-primary" />
              <p className="dashboard-text-secondary">Loading schedule...</p>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {weeklySchedule.length > 0 && (
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule Grid */}
        {weeklySchedule.length > 0 && (
          <ScheduleGrid
            weeklySchedule={weeklySchedule}
            canEdit={canEditCurrentWeek()}
            onToggleDay={toggleDayEnabled}
            onSlotClick={handleSlotClick}
            onSetDayHours={setDayHours}
            onCopyDayToAll={copyDayToAll}
            onClearDay={clearDay}
            formatTimeSlot={formatTimeSlot}
            getAvailableHoursForDay={getAvailableHoursForDay}
          />
        )}
      </div>
    </div>
  );
}
