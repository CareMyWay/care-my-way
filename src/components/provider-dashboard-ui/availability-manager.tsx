"use client"

import { useState, useEffect } from "react"
import { generateClient } from "aws-amplify/data"
import type { Schema } from "@/amplify/data/resource"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react"

const client = generateClient<Schema>()

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

interface AvailabilityManagerProps {
  providerId: string
  profileOwner: string
  currentWeekStart: Date
  onScheduleLoaded: (schedule: DaySchedule[]) => void
  onSaveComplete: (success: boolean, message?: string) => void
}

export function AvailabilityManager({
  providerId,
  profileOwner,
  currentWeekStart,
  onScheduleLoaded,
  onSaveComplete,
}: AvailabilityManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const generateTimeSlots = (): string[] => {
    const slots = []
    for (let hour = 6; hour < 23; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`)
      slots.push(`${hour.toString().padStart(2, "0")}:30`)
    }
    return slots
  }

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const timeSlots = generateTimeSlots()

  // Load availability from database
  const loadAvailability = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get week date range
      const weekDates = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart)
        date.setDate(currentWeekStart.getDate() + i)
        weekDates.push(date.toISOString().split("T")[0])
      }

      // Query availability for the week
      const { data: availabilityData, errors } = await client.models.Availability.list({
        filter: {
          and: [{ providerId: { eq: providerId } }, { date: { between: [weekDates[0], weekDates[6]] } }],
        },
      })

      if (errors && errors.length > 0) {
        throw new Error(`Database error: ${errors[0].message}`)
      }

      // Create schedule structure
      const schedule: DaySchedule[] = daysOfWeek.map((day, index) => {
        const dayDate = weekDates[index]
        const dayAvailability = availabilityData?.filter((av) => av.date === dayDate) || []

        const slots: TimeSlot[] = timeSlots.map((time) => {
          const dbSlot = dayAvailability.find((av) => av.time === time)
          return {
            time,
            available: dbSlot ? (dbSlot.isAvailable ?? false) : false,
            isBlocked: false,
            availabilityId: dbSlot?.id,
          }
        })

        return {
          day,
          date: dayDate,
          enabled: dayAvailability.length > 0 || index < 5, // Enable weekdays by default if no data
          slots,
        }
      })

      onScheduleLoaded(schedule)
    } catch (err) {
      console.error("Error loading availability:", err)
      setError(err instanceof Error ? err.message : "Failed to load availability data")
    } finally {
      setIsLoading(false)
    }
  }

  // Save availability to database
  const saveAvailability = async (weeklySchedule: DaySchedule[]) => {
    try {
      setError(null)
      setSuccess(null)

      const savePromises: Promise<any>[] = []
      const deletePromises: Promise<any>[] = []

      // Process each day
      for (const day of weeklySchedule) {
        for (const slot of day.slots) {
          if (slot.isBlocked) continue

          const availabilityData = {
            providerId,
            profileOwner,
            date: day.date,
            time: slot.time,
            duration: 0.5, // 30-minute slots
            isAvailable: day.enabled && slot.available,
            isRecurring: false,
            notes: "",
          }

          if (slot.availabilityId) {
            if (day.enabled) {
              // Update existing
              savePromises.push(
                client.models.Availability.update({
                  id: slot.availabilityId,
                  ...availabilityData,
                }),
              )
            } else {
              // Delete if day is disabled
              deletePromises.push(client.models.Availability.delete({ id: slot.availabilityId }))
            }
          } else if (day.enabled && slot.available) {
            // Create new only if available
            savePromises.push(
              client.models.Availability.create({
                id: `${providerId}-${day.date}-${slot.time}`,
                ...availabilityData,
              }),
            )
          }
        }
      }

      // Execute all operations
      const results = await Promise.allSettled([...savePromises, ...deletePromises])

      // Check for failures
      const failures = results.filter((result) => result.status === "rejected")
      if (failures.length > 0) {
        throw new Error(`${failures.length} operations failed`)
      }

      setSuccess("Availability saved successfully!")
      onSaveComplete(true, "Changes saved to database")

      // Reload data to sync with database
      await loadAvailability()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("Error saving availability:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to save availability"
      setError(errorMessage)
      onSaveComplete(false, errorMessage)
    }
  }

  // Load data when week changes
  useEffect(() => {
    if (providerId && currentWeekStart) {
      loadAvailability()
    }
  }, [providerId, currentWeekStart])

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
  )
}

// Export the save function for use in parent component
export const saveAvailabilityData = async (weeklySchedule: DaySchedule[], providerId: string, profileOwner: string) => {
  const savePromises: Promise<any>[] = []
  const deletePromises: Promise<any>[] = []

  for (const day of weeklySchedule) {
    for (const slot of day.slots) {
      if (slot.isBlocked) continue

      const availabilityData = {
        providerId,
        profileOwner,
        date: day.date,
        time: slot.time,
        duration: 0.5,
        isAvailable: day.enabled && slot.available,
        isRecurring: false,
        notes: "",
      }

      if (slot.availabilityId) {
        if (day.enabled) {
          savePromises.push(
            client.models.Availability.update({
              id: slot.availabilityId,
              ...availabilityData,
            }),
          )
        } else {
          deletePromises.push(client.models.Availability.delete({ id: slot.availabilityId }))
        }
      } else if (day.enabled && slot.available) {
        savePromises.push(
          client.models.Availability.create({
            id: `${providerId}-${day.date}-${slot.time}`,
            ...availabilityData,
          }),
        )
      }
    }
  }

  await Promise.all([...savePromises, ...deletePromises])
}

export { client }
