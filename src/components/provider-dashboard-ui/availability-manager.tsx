"use client";

import { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

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

/* eslint-disable no-unused-vars */
interface AvailabilityManagerProps {
  providerId: string
  profileOwner: string
  currentWeekStart: Date
  onScheduleLoaded: (schedule: DaySchedule[]) => void
  onSaveComplete: (success: boolean, message?: string) => void
  skipAutoLoad?: boolean // Add this to prevent auto-loading when user is making changes
}

export interface AvailabilityManagerRef {
  saveAvailability: (weeklySchedule: DaySchedule[]) => Promise<void>
  loadAvailability: () => Promise<void> // Expose reload function
}
/* eslint-enable no-unused-vars */

export const AvailabilityManager = forwardRef<AvailabilityManagerRef, AvailabilityManagerProps>(({
  providerId,
  profileOwner,
  currentWeekStart,
  onScheduleLoaded,
  onSaveComplete,
  skipAutoLoad = false,
}, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const generateTimeSlots = (): string[] => {
    const slots = [];
    // Generate hourly slots from 6 AM to 10 PM (1-hour duration each)
    for (let hour = 6; hour <= 22; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return slots;
  };

  // Load availability from database
  const loadAvailability = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Constants moved inside to avoid dependency issues
      const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const timeSlots = generateTimeSlots();

      // Get week date range
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        weekDates.push(date.toISOString().split("T")[0]);
      }

      // Query availability for the week  
      const { data: availabilityData, errors } = await client.models.Availability.list({
        filter: {
          providerId: { eq: providerId },
          date: { between: [weekDates[0], weekDates[6]] }
        },
      });

      if (errors && errors.length > 0) {
        throw new Error(`Database error: ${errors[0].message}`);
      }

      // Create schedule structure
      const schedule: DaySchedule[] = daysOfWeek.map((day, index) => {
        const dayDate = weekDates[index];
        const dayAvailability = availabilityData?.filter((av) => av.date === dayDate) || [];

        const slots: TimeSlot[] = timeSlots.map((time) => {
          const dbSlot = dayAvailability.find((av) => av.time === time);
          return {
            time,
            available: dbSlot ? (dbSlot.isAvailable ?? false) : false,
            isBlocked: false,
            availabilityId: dbSlot?.id,
          };
        });

        return {
          day,
          date: dayDate,
          // Only enable days if there's actual availability data for that day
          enabled: dayAvailability.length > 0,
          slots,
        };
      });

      onScheduleLoaded(schedule);
    } catch (err) {
      console.error("Error loading availability:", err);
      setError(err instanceof Error ? err.message : "Failed to load availability data");
      
      // Even on error, provide empty schedule structure so UI can work
      const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const timeSlots = generateTimeSlots();
      
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        weekDates.push(date.toISOString().split("T")[0]);
      }
      
      const emptySchedule: DaySchedule[] = daysOfWeek.map((day, index) => ({
        day,
        date: weekDates[index],
        enabled: false,
        slots: timeSlots.map((time) => ({
          time,
          available: false,
          isBlocked: false,
        })),
      }));
      
      onScheduleLoaded(emptySchedule);
    } finally {
      setIsLoading(false);
    }
  }, [currentWeekStart, onScheduleLoaded, providerId]);

  // Save availability to database and sync with ProviderProfile
  const saveAvailability = async (weeklySchedule: DaySchedule[]) => {
    try {
      setError(null);
      setSuccess(null);

      const savePromises: Promise<unknown>[] = [];
      const deletePromises: Promise<unknown>[] = [];
      const availabilityStrings: string[] = [];

      // Process each day
      for (const day of weeklySchedule) {
        for (const slot of day.slots) {
          if (slot.isBlocked) continue;

          const availabilityData = {
            providerId,
            profileOwner,
            date: day.date,
            time: slot.time,
            duration: 1.0, // 1-hour slots (changed from 30-minute slots)
            isAvailable: day.enabled && slot.available,
            isRecurring: false,
            notes: "",
          };

          // Build availability string for ProviderProfile field (yyyy-mm-dd:HH format)
          if (day.enabled && slot.available) {
            const timeHour = slot.time.split(":")[0];
            availabilityStrings.push(`${day.date}:${timeHour}`);
          }

          if (slot.availabilityId) {
            if (day.enabled) {
              // Update existing
              savePromises.push(
                client.models.Availability.update({
                  id: slot.availabilityId,
                  ...availabilityData,
                } as unknown as Parameters<typeof client.models.Availability.update>[0]),
              );
            } else {
              // Delete if day is disabled
              deletePromises.push(client.models.Availability.delete({ id: slot.availabilityId }));
            }
          } else if (day.enabled && slot.available) {
            // Create new only if available
            savePromises.push(
              client.models.Availability.create({
                id: `${providerId}-${day.date}-${slot.time}`,
                ...availabilityData,
              } as unknown as Parameters<typeof client.models.Availability.create>[0]),
            );
          }
        }
      }

      // Execute all operations
      const results = await Promise.allSettled([...savePromises, ...deletePromises]);

      // Check for failures
      const failures = results.filter((result) => result.status === "rejected");
      if (failures.length > 0) {
        throw new Error(`${failures.length} operations failed`);
      }

      // Update ProviderProfile availability field with new availability strings
      try {
        // Query ProviderProfile by userId since it's not the primary key
        const { data: profiles } = await client.models.ProviderProfile.list({
          filter: { userId: { eq: providerId } },
        });
        
        if (profiles && profiles.length > 0) {
          const existingProfile = profiles[0];
          // Get existing availability and merge with new data
          const existingAvailability = existingProfile.availability || [];
          // Remove old entries for this week and add new ones
          const weekDates = [];
          for (let i = 0; i < 7; i++) {
            const date = new Date(currentWeekStart);
            date.setDate(currentWeekStart.getDate() + i);
            weekDates.push(date.toISOString().split("T")[0]);
          }
          
          const filteredExisting = existingAvailability.filter(av => {
            const avDate = av.split(":")[0];
            return !weekDates.includes(avDate);
          });
          
          const updatedAvailability = [...filteredExisting, ...availabilityStrings];
          
          await client.models.ProviderProfile.update({
            id: existingProfile.id, // Use the id field as primary key
            availability: updatedAvailability,
          } as unknown as Parameters<typeof client.models.ProviderProfile.update>[0]);
        }
      } catch (profileError) {
        console.warn("Failed to update ProviderProfile availability field:", profileError);
        // Don't fail the entire operation if profile update fails
      }

      setSuccess("Availability saved successfully!");
      onSaveComplete(true, "Changes saved to database");

      // Reload data to sync with database
      await loadAvailability();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving availability:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to save availability";
      setError(errorMessage);
      onSaveComplete(false, errorMessage);
    }
  };

  // Load data when week changes
  useEffect(() => {
    if (providerId && currentWeekStart && !skipAutoLoad) {
      loadAvailability();
    }
  }, [providerId, currentWeekStart, loadAvailability, skipAutoLoad]);

  // Expose saveAvailability function to parent component
  useImperativeHandle(ref, () => ({
    saveAvailability,
    loadAvailability: loadAvailability,
  }));

  return (
    <div className="space-y-4">
      {/* Status Messages */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Alert className="border-blue-200 bg-blue-50">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <AlertDescription className="text-blue-800">Loading availability data...</AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  );
});

AvailabilityManager.displayName = "AvailabilityManager";

// Export the save function for use in parent component
export const saveAvailabilityData = async (weeklySchedule: DaySchedule[], providerId: string, profileOwner: string) => {
  const savePromises: Promise<unknown>[] = [];
  const deletePromises: Promise<unknown>[] = [];
  const availabilityStrings: string[] = [];

  for (const day of weeklySchedule) {
    for (const slot of day.slots) {
      if (slot.isBlocked) continue;

      const availabilityData = {
        providerId,
        profileOwner,
        date: day.date,
        time: slot.time,
        duration: 1.0, // 1-hour slots (changed from 30-minute slots)
        isAvailable: day.enabled && slot.available,
        isRecurring: false,
        notes: "",
      };

      // Build availability string for ProviderProfile field (yyyy-mm-dd:HH format)
      if (day.enabled && slot.available) {
        const timeHour = slot.time.split(":")[0];
        availabilityStrings.push(`${day.date}:${timeHour}`);
      }

      if (slot.availabilityId) {
        if (day.enabled) {
          savePromises.push(
            client.models.Availability.update({
              id: slot.availabilityId,
              ...availabilityData,
            } as unknown as Parameters<typeof client.models.Availability.update>[0]),
          );
        } else {
          deletePromises.push(client.models.Availability.delete({ id: slot.availabilityId }));
        }
      } else if (day.enabled && slot.available) {
        savePromises.push(
          client.models.Availability.create({
            id: `${providerId}-${day.date}-${slot.time}`,
            ...availabilityData,
          } as unknown as Parameters<typeof client.models.Availability.create>[0]),
        );
      }
    }
  }

  await Promise.all([...savePromises, ...deletePromises]);

  // Update ProviderProfile availability field
  try {
    // Query ProviderProfile by userId
    const { data: profiles } = await client.models.ProviderProfile.list({
      filter: { userId: { eq: providerId } },
    });
    
    if (profiles && profiles.length > 0) {
      const existingProfile = profiles[0];
      await client.models.ProviderProfile.update({
        id: existingProfile.id,
        availability: availabilityStrings,
      } as unknown as Parameters<typeof client.models.ProviderProfile.update>[0]);
    }
  } catch (profileError) {
    console.warn("Failed to update ProviderProfile availability field:", profileError);
  }
};

export { client };
