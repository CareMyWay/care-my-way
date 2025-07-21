import { useState, useEffect, useRef, useCallback } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";
import type { AvailabilityManagerRef } from "@/components/provider-dashboard-ui/availability-manager";
import { syncAvailabilityToProfile } from "@/utils/availability-sync";

const client = generateClient<Schema>();

export interface TimeSlot {
  time: string;
  available: boolean;
  isBlocked?: boolean;
  availabilityId?: string;
}

export interface DaySchedule {
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

interface ProviderProfile {
  userId: string;
  userType: string;
  profileOwner: string;
}

export const useAvailabilityEditor = () => {
  // State
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
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [applyToFuture, setApplyToFuture] = useState(false);

  const [selection, setSelection] = useState<SelectionState>({
    isSelecting: false,
    startSlot: null,
    endSlot: null,
    dayIndex: null,
    mode: "available",
  });

  // Ref for AvailabilityManager
  const availabilityManagerRef = useRef<AvailabilityManagerRef>(null);

  // Utility functions
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
    return diffWeeks >= 1; // Restore original restriction
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

  const getAvailableHoursForDay = (daySchedule: DaySchedule) => {
    if (!daySchedule.enabled) return 0;
    return daySchedule.slots.filter((slot) => slot.available).length * 1.0;
  };

  const getTotalAvailableHours = () => {
    return weeklySchedule.reduce((total, day) => total + getAvailableHoursForDay(day), 0);
  };

  // Provider profile management
  const loadProviderProfile = useCallback(async () => {
    try {
      setIsLoadingUser(true);
      setErrors([]);

      const { data: profiles, errors: profileErrors } = await client.models.ProviderProfile.list({
        limit: 1,
      });

      if (profileErrors && profileErrors.length > 0) {
        throw new Error(`Failed to load user profile: ${profileErrors[0].message}`);
      }

      if (!profiles || profiles.length === 0) {
        throw new Error("No provider profile found. Please create a provider profile first.");
      }

      const profile = profiles[0];
      setProviderProfile({
        userId: profile.userId || "",
        userType: "Provider",
        profileOwner: profile.profileOwner || "",
      });
    } catch (err) {
      console.error("Error loading provider profile:", err);
      setErrors([err instanceof Error ? err.message : "Failed to load provider profile"]);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  // Week navigation
  const navigateWeek = (direction: "prev" | "next") => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + (direction === "next" ? 7 : -7));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minAllowedWeek = new Date(today);
    minAllowedWeek.setDate(today.getDate() + 7);

    if (newWeekStart >= minAllowedWeek) {
      setCurrentWeekStart(newWeekStart);
      setHasChanges(false);
      setIsLoadingSchedule(true);
    }
  };

  // Schedule management
  const handleScheduleLoaded = (schedule: DaySchedule[]) => {
    console.log("handleScheduleLoaded called with schedule:", schedule);
    console.log("hasChanges:", hasChanges);
    
    if (!hasChanges) {
      console.log("Updating schedule because no changes");
      setWeeklySchedule(schedule);
    } else {
      console.log("NOT updating schedule because hasChanges is true");
    }
    setIsLoadingSchedule(false);
  };

  const handleSaveComplete = (success: boolean, message?: string) => {
    setIsSaving(false);
    if (success) {
      setHasChanges(false);
      setLastSaved(new Date());
      setErrors([]);
      setTimeout(() => {
        if (availabilityManagerRef.current) {
          availabilityManagerRef.current.loadAvailability();
        }
      }, 100);
    } else if (message) {
      setErrors([message]);
    }
  };

  // Quick setup handlers
  const setupMonFri9to5 = () => {
    console.log("Quick setup: Mon-Fri 9-5 clicked");
    setWeeklySchedule(prev => {
      const updated = prev.map((day, index) => {
        if (index < 5) { // Monday-Friday
          return {
            ...day,
            enabled: true,
            slots: day.slots.map(slot => ({
              ...slot,
              available: slot.time >= "09:00" && slot.time <= "17:00"
            }))
          };
        }
        return day;
      });
      console.log("Updated schedule:", updated);
      return updated;
    });
    setHasChanges(true);
    console.log("Set hasChanges to true");
  };

  const setupAllDays8to6 = () => {
    console.log("Quick setup: All days 8-6 clicked");
    setWeeklySchedule(prev => {
      const updated = prev.map(day => ({
        ...day,
        enabled: true,
        slots: day.slots.map(slot => ({
          ...slot,
          available: slot.time >= "08:00" && slot.time <= "18:00"
        }))
      }));
      console.log("Updated schedule:", updated);
      return updated;
    });
    setHasChanges(true);
    console.log("Set hasChanges to true");
  };

  // Slot interaction handlers
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

  // Save functionality
  const createWeekScheduleFromTemplate = (weekStart: Date): DaySchedule[] => {
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    return dayNames.map((dayName, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      const dateStr = date.toISOString().split("T")[0];
      
      const templateDay = weeklySchedule.find(day => day.day === dayName);
      
      return {
        day: dayName,
        date: dateStr,
        enabled: templateDay?.enabled || false,
        slots: templateDay?.slots.map(slot => ({ ...slot })) || []
      };
    });
  };

  const saveWeeklyAvailability = async (weekSchedule: DaySchedule[]) => {
    if (!providerProfile) return;

    const savePromises: Promise<unknown>[] = [];
    const deletePromises: Promise<unknown>[] = [];

    for (const day of weekSchedule) {
      for (const slot of day.slots) {
        if (slot.isBlocked) continue;

        const availabilityData = {
          providerId: providerProfile.userId,
          profileOwner: providerProfile.profileOwner,
          date: day.date,
          time: slot.time,
          duration: 1.0,
          isAvailable: day.enabled && slot.available,
          isRecurring: applyToFuture,
        };

        if (slot.availabilityId) {
          savePromises.push(
            client.models.Availability.update({
              id: slot.availabilityId,
              ...availabilityData,
            } as unknown as Parameters<typeof client.models.Availability.update>[0])
          );
        } else if (day.enabled && slot.available) {
          savePromises.push(
            client.models.Availability.create(availabilityData as unknown as Parameters<typeof client.models.Availability.create>[0])
          );
        }
      }

      for (const slot of day.slots) {
        if (slot.availabilityId && (!day.enabled || !slot.available) && !slot.isBlocked) {
          deletePromises.push(
            client.models.Availability.delete({ id: slot.availabilityId } as unknown as Parameters<typeof client.models.Availability.delete>[0])
          );
        }
      }
    }

    // Save all availability changes
    await Promise.all([...savePromises, ...deletePromises]);

    // Sync availability to ProviderProfile.availability field (optimized for this week only)
    try {
      const weekDates = weekSchedule.map(day => day.date);
      await syncAvailabilityToProfile(providerProfile.userId, weekDates);
      console.log("Successfully synced availability to provider profile");
    } catch (error) {
      console.error("Error syncing availability to provider profile:", error);
      // Don't throw here as the main save was successful
    }
  };

  const saveRecurringAvailability = async () => {
    if (!providerProfile) return;

    const weeksToSave = 52;
    const startWeek = new Date(currentWeekStart);
    
    for (let weekOffset = 0; weekOffset < weeksToSave; weekOffset++) {
      const weekStart = new Date(startWeek);
      weekStart.setDate(startWeek.getDate() + (weekOffset * 7));
      
      const weekSchedule = createWeekScheduleFromTemplate(weekStart);
      await saveWeeklyAvailability(weekSchedule);
    }
  };

  const saveChanges = async () => {
    if (!providerProfile || !canEditCurrentWeek() || !hasChanges) return;

    try {
      setIsSaving(true);
      setErrors([]);

      if (applyToFuture) {
        await saveRecurringAvailability();
      } else {
        if (availabilityManagerRef.current) {
          await availabilityManagerRef.current.saveAvailability(weeklySchedule);
        }
      }

      setHasChanges(false);
      setLastSaved(new Date());
    } catch (err) {
      console.error("Error saving changes:", err);
      setErrors([err instanceof Error ? err.message : "Failed to save changes"]);
    } finally {
      setIsSaving(false);
    }
  };

  // Effects
  useEffect(() => {
    loadProviderProfile();
  }, [loadProviderProfile]);

  useEffect(() => {
    if (providerProfile && !hasChanges) {
      setIsLoadingSchedule(true);
    }
  }, [providerProfile, currentWeekStart, hasChanges]);

  // Return all state and handlers
  return {
    // State
    currentWeekStart,
    hasChanges,
    isSaving,
    lastSaved,
    errors,
    isLoadingUser,
    providerProfile,
    userProfile: providerProfile, // Backward compatibility alias
    weeklySchedule,
    isLoadingSchedule,
    applyToFuture,
    selection,
    availabilityManagerRef,

    // Setters
    setApplyToFuture,
    setErrors,

    // Utility functions
    formatTimeSlot,
    canEditCurrentWeek,
    canNavigatePrev,
    getAvailableHoursForDay,
    getTotalAvailableHours,

    // Handlers
    navigateWeek,
    handleScheduleLoaded,
    handleSaveComplete,
    setupMonFri9to5,
    setupAllDays8to6,
    handleSlotClick,
    toggleDayEnabled,
    setDayHours,
    copyDayToAll,
    clearDay,
    saveChanges,
  };
};
