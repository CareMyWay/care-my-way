// Simple availability utilities for schedule page
export interface TimeSlot {
  time: string; // HH:MM format
  isAvailable: boolean;
  isBooked: boolean;
  duration: number; // hours
}

export interface DaySchedule {
  date: string; // YYYY-MM-DD
  timeSlots: TimeSlot[];
  appointments: Array<{
    id: string;
    time: string;
    patientName: string;
    service: string;
  }>;
}

/**
 * Generate time slots for a day (9 AM to 5 PM)
 */
export function generateDayTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  
  // Generate hourly slots from 9 AM to 5 PM
  for (let hour = 9; hour < 17; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    slots.push({
      time,
      isAvailable: true, // Default to available
      isBooked: false,
      duration: 1.0
    });
  }
  
  return slots;
}

/**
 * Check if a time slot is currently available
 */
export function isSlotAvailable(slot: TimeSlot): boolean {
  return slot.isAvailable && !slot.isBooked;
}

/**
 * Format time for display (convert 24h to 12h format)
 */
export function formatDisplayTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

/**
 * Get current week dates
 */
export function getCurrentWeekDates(currentDate: Date): string[] {
  const week = [];
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    week.push(date.toISOString().split("T")[0]);
  }
  
  return week;
}
