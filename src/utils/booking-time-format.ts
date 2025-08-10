// Function to convert 24-hour time format from availability data to 12-hour AM/PM format to be used in booking modal

export function formatTimeToAMPM(time24: string): string {
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr.padStart(2, "0");

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert 0 to 12, 13 to 1, etc.

    return `${hour}:${minute} ${ampm}`;
}