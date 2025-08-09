// Helper functions for booking overlap checks

export default function timeStringToDate(dateStr: string, timeStr: string): Date {
    // Parses date string "yyyy-MM-dd" and time string "h:mm AM/PM" to a Date object
    const [time, meridian] = timeStr.trim().split(" ");
    const [hourStr, minuteStr] = time.split(":");
    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    if (meridian === "PM" && hours !== 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;

    const date = new Date(dateStr);
    date.setHours(hours, minutes, 0, 0);
    return date;
    }

    export function isOverlap(slotTime: string, slotDuration: number, bookingStart: Date, bookingEnd: Date, slotDate: string): boolean {
    const slotStart = timeStringToDate(slotDate, slotTime);
    const slotEnd = new Date(slotStart.getTime() + slotDuration * 60 * 60 * 1000);

    // Overlap if slotStart < bookingEnd and slotEnd > bookingStart
    return slotStart < bookingEnd && slotEnd > bookingStart;
}


export function filterNonOverlappingDurations(
    selectedDate: string,
    selectedStartTime: string,
    durationOptions: { value: string; label: string }[],
    existingBookings: { date: string; time: string; duration: number }[]
    ) {
    const selectedStart = timeStringToDate(selectedDate, selectedStartTime);

    return durationOptions.filter(({ value }) => {
        const duration = parseFloat(value);
        const proposedEnd = new Date(selectedStart.getTime() + duration * 60 * 60 * 1000);

        // Check overlap with any booking on the same date
        for (const booking of existingBookings) {
        if (booking.date !== selectedDate) continue;

        const bookingStart = timeStringToDate(booking.date, booking.time);
        const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60 * 60 * 1000);

        // Overlap condition:
        if (selectedStart < bookingEnd && proposedEnd > bookingStart) {
            return false; // overlaps, exclude this duration
        }
        }

        return true; // no overlap, include this duration
    });
}