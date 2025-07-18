import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { format, addDays } from "date-fns";

const client = generateClient<Schema>();

export interface AvailabilitySlot {
  id?: string;
  providerId: string;
  date: string; // YYYY-MM-DD (same as Booking)
  time: string; // HH:MM (same as Booking)
  duration: number; // Duration in hours
  isAvailable: boolean;
  isRecurring: boolean;
  dayOfWeek?: string;
  notes?: string;
}

export interface BookingSlot {
  id?: string;
  providerName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  clientId?: string;
  providerRate: string;
}

/**
 * Convert time string (HH:MM) to minutes for easy comparison
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes back to time string (HH:MM)
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

/**
 * Check if a time slot conflicts with existing bookings
 */
export function hasTimeConflict(
  newTime: string,
  newDuration: number,
  existingBookings: BookingSlot[]
): boolean {
  const newStart = timeToMinutes(newTime);
  const newEnd = newStart + (newDuration * 60); // Convert hours to minutes

  return existingBookings.some(booking => {
    const bookingStart = timeToMinutes(booking.time);
    const bookingEnd = bookingStart + 60; // Assume 1 hour booking duration
    
    // Check if time ranges overlap
    return newStart < bookingEnd && bookingStart < newEnd;
  });
}

/**
 * Generate time slots for a given day (e.g., 9:00, 10:00, 11:00, etc.)
 */
export function generateTimeSlots(
  startTime: string = "09:00",
  endTime: string = "17:00",
  intervalHours: number = 1
): string[] {
  const slots: string[] = [];
  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);
  const intervalMin = intervalHours * 60;

  for (let minutes = startMin; minutes < endMin; minutes += intervalMin) {
    slots.push(minutesToTime(minutes));
  }

  return slots;
}

/**
 * Get provider's availability for a specific date
 */
export async function getProviderAvailability(
  providerId: string,
  date: string
): Promise<AvailabilitySlot[]> {
  try {
    const { data: availability } = await client.models.Availability.list();
    
    // Filter by providerId and date on the client side for now
    const filtered = availability.filter(slot => 
      slot.providerId === providerId && slot.date === date
    );

    return filtered.map(slot => ({
      id: slot.id,
      providerId: slot.providerId,
      date: slot.date,
      time: slot.time,
      duration: slot.duration || 1.0,
      isAvailable: slot.isAvailable || false,
      isRecurring: slot.isRecurring || false,
      dayOfWeek: slot.dayOfWeek || undefined,
      notes: slot.notes || undefined
    }));
  } catch (error) {
    console.error("Error fetching provider availability:", error);
    return [];
  }
}

/**
 * Get provider's bookings for a specific date
 */
export async function getProviderBookings(
  providerName: string,
  date: string
): Promise<BookingSlot[]> {
  try {
    const { data: bookings } = await client.models.Booking.list();
    
    // Filter by providerName and date on the client side for now
    const filtered = bookings.filter(booking => 
      booking.providerName === providerName && booking.date === date
    );

    return filtered.map(booking => ({
      id: booking.id,
      providerName: booking.providerName,
      date: booking.date,
      time: booking.time,
      clientId: booking.clientId || undefined,
      providerRate: booking.providerRate
    }));
  } catch (error) {
    console.error("Error fetching provider bookings:", error);
    return [];
  }
}

/**
 * Check if a time slot is available for booking
 */
export async function isTimeSlotAvailable(
  providerId: string,
  providerName: string,
  date: string,
  time: string,
  duration: number = 1
): Promise<boolean> {
  const availability = await getProviderAvailability(providerId, date);
  const bookings = await getProviderBookings(providerName, date);

  // Check if there's any availability slot for this time
  const hasAvailability = availability.some(slot => 
    slot.isAvailable && slot.time === time
  );

  if (!hasAvailability) return false;

  // Check if there are any conflicting bookings
  const hasConflict = hasTimeConflict(time, duration, bookings);

  return !hasConflict;
}

/**
 * Create or update availability slot
 */
export async function setProviderAvailability(
  slot: AvailabilitySlot,
  profileOwner: string
): Promise<boolean> {
  try {
    if (slot.id) {
      // Update existing slot
      await client.models.Availability.update({
        id: slot.id,
        isAvailable: slot.isAvailable,
        time: slot.time,
        duration: slot.duration,
        notes: slot.notes
      });
    } else {
      // Create new slot
      await client.models.Availability.create({
        providerId: slot.providerId,
        profileOwner: profileOwner,
        date: slot.date,
        time: slot.time,
        duration: slot.duration,
        isAvailable: slot.isAvailable,
        isRecurring: slot.isRecurring,
        dayOfWeek: slot.dayOfWeek,
        notes: slot.notes
      });
    }
    return true;
  } catch (error) {
    console.error("Error setting provider availability:", error);
    return false;
  }
}
