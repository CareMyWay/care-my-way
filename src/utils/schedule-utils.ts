// Simple availability utilities for schedule page
import { startOfWeek, addDays, format, differenceInDays } from "date-fns";

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

export interface AvailabilityEvent {
  id: string;
  title: string;
  start: string; // ISO string
  end: string; // ISO string
  backgroundColor?: string;
  borderColor?: string;
  classNames?: string[];
  extendedProps: {
    isAvailable: boolean;
    isBooked: boolean;
    isEditable: boolean;
    providerId: string;
    notes?: string;
  };
}

/**
 * Check if a given week is editable (at least 3 days before the week starts)
 */
export function isEditableWeek(date: Date): boolean {
  const today = new Date();
  const weekStart = startOfWeek(date, { weekStartsOn: 0 }); // Sunday
  const diffInDays = differenceInDays(weekStart, today);
  return diffInDays >= 3;
}

/**
 * Get the start of the week for a given date
 */
export function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 0 }); // Sunday
}

/**
 * Get all dates in a week
 */
export function getWeekDates(weekStart: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(addDays(weekStart, i));
  }
  return dates;
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
 * Convert time slots to FullCalendar events
 */
export function convertToCalendarEvents(
  weekStart: Date,
  availabilityData: { [date: string]: TimeSlot[] },
  providerId: string
): AvailabilityEvent[] {
  const events: AvailabilityEvent[] = [];
  const weekDates = getWeekDates(weekStart);
  const isEditable = isEditableWeek(weekStart);

  weekDates.forEach(date => {
    const dateStr = format(date, "yyyy-MM-dd");
    const daySlots = availabilityData[dateStr] || generateDayTimeSlots();

    daySlots.forEach(slot => {
      const startDateTime = `${dateStr}T${slot.time}:00`;
      const endHour = parseInt(slot.time.split(":")[0]) + slot.duration;
      const endTime = `${endHour.toString().padStart(2, "0")}:00`;
      const endDateTime = `${dateStr}T${endTime}:00`;

      let backgroundColor = "#e5e7eb"; // gray
      let borderColor = "#9ca3af";
      let title = "Unavailable";

      if (slot.isBooked) {
        backgroundColor = "#fca5a5"; // red
        borderColor = "#dc2626";
        title = "Booked";
      } else if (slot.isAvailable) {
        backgroundColor = "#86efac"; // green
        borderColor = "#16a34a";
        title = "Available";
      }

      events.push({
        id: `${dateStr}-${slot.time}`,
        title,
        start: startDateTime,
        end: endDateTime,
        backgroundColor,
        borderColor,
        classNames: isEditable && !slot.isBooked ? ["editable-slot"] : ["readonly-slot"],
        extendedProps: {
          isAvailable: slot.isAvailable,
          isBooked: slot.isBooked,
          isEditable: isEditable && !slot.isBooked,
          providerId,
          notes: ""
        }
      });
    });
  });

  return events;
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
  const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(startOfWeekDate, i);
    week.push(format(date, "yyyy-MM-dd"));
  }
  
  return week;
}
