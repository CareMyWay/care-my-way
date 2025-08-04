"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateClient } from "aws-amplify/data";
import { Clock } from "lucide-react";
import type { Schema } from "amplify/data/resource";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@aws-amplify/auth";
import { DialogDescription } from "@radix-ui/react-dialog";
import Calendar from "./calendar";
import { formatDateKey } from "@/utils/calendar-date-format";
import { NotificationService } from "@/services/notificationService";
import { addDays, format } from "date-fns";
import { formatTimeToAMPM } from "@/utils/booking-time-format";
import timeStringToDate, { isOverlap, filterNonOverlappingDurations } from "@/utils/booking-overlap-helper";

const client = generateClient<Schema>();

function getEndTime(start: string, duration: number): string {
  const [time, meridian] = start.trim().split(" ");
  const [hourStr, minuteStr] = time.split(":");
  let hours = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);

  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error("Invalid start time format.");
  }

  if (meridian === "PM" && hours !== 12) hours += 12;
  if (meridian === "AM" && hours === 12) hours = 0;

  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);

  const durationMs = Math.round(duration * 60 * 60 * 1000);
  const endDate = new Date(startDate.getTime() + durationMs);

  let endHours = endDate.getHours();
  const endMinutes = endDate.getMinutes();
  const endMeridian = endHours >= 12 ? "PM" : "AM";

  endHours = endHours % 12 || 12; // convert 0/13/14/... to 12/1/2/...
  const formattedMinutes = endMinutes.toString().padStart(2, "0");

  return `${endHours}:${formattedMinutes} ${endMeridian}`;
}

interface BookingModalProps {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (_: boolean) => void;
  providerName: string;
  providerTitle: string;
  providerRate: string;
  providerId?: string;
  providerPhoto?: string;
  providerRateFloat?: number;
  providerLocation?: string;
  providerServices?: string[];
}

export default function BookingModal({
  isOpen,
  onOpenChange,
  providerName,
  providerRate,
  providerRateFloat,
  providerId,
  providerPhoto,
  providerTitle,
  providerLocation,
  providerServices = [],
}: BookingModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, string[]>>({});
  const [existingBookings, setExistingBookings] = useState<{ date: string; time: string; duration: number }[]>([]);

  const getServiceName = (): string => {
    if (providerServices && providerServices.length > 0) {
      return providerServices[0]; // Use the first service
    }
    return "Care Services";
  };

  const durationOptions = [
    { value: "0.5", label: "30 minutes" },
    { value: "1", label: "1 hour" },
    { value: "1.5", label: "1.5 hours" },
    { value: "2", label: "2 hours" },
    { value: "2.5", label: "2.5 hours" },
    { value: "3", label: "3 hours" },
    { value: "4", label: "4 hours" },
    { value: "6", label: "6 hours" },
    { value: "8", label: "8 hours" },
  ];

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          console.error("No user found");
          return;
        }

        // Fetch the provider profile
        const { data: profiles } = await client.models.ProviderProfile.list({
          filter: { id: { eq: providerId} },
        });

        const profile = profiles?.[0];
        if (!profile) throw new Error("No provider profile found");

        // Fetch provider availability
        const { data: weeklyAvailability } = await client.models.ProviderAvailability.list({
          filter: { providerId: { eq: profile.userId } },
        });
        const availability = weeklyAvailability?.[0];
        if (!availability) {
          setAvailabilityMap({});
          return;
        }

        let weeklyTemplate: Record<string, string[]> = {};

        // Parse weeklyTemplate from DynamoDB
        if (typeof availability.weeklyTemplate === "string") {
          weeklyTemplate = JSON.parse(availability.weeklyTemplate);
        } else if (typeof availability.weeklyTemplate === "object" && availability.weeklyTemplate !== null) {
          // If it already parsed or is an object, just assign it directly
          weeklyTemplate = availability.weeklyTemplate as Record<string, string[]>;
        } else {
          weeklyTemplate = {};
        }

        const today = new Date();
        const result: Record<string, string[]> = {};
        for (let i = 0; i < 30; i++) {
        const date = addDays(today, i);
        const dayName = date.toLocaleString("en-US", { weekday: "short" });
        const dateKey = format(date, "yyyy-MM-dd");

        const dayEntry = weeklyTemplate[dayName];
        if (dayEntry && Array.isArray(dayEntry)) {
          result[dateKey] = dayEntry;
          }
        }

        const todayStr = format(today, "yyyy-MM-dd");
        const endDateStr = format(addDays(today, 30), "yyyy-MM-dd");

        const { data: existingBookingsData } = await client.models.Booking.list({
          filter: {
            providerId: { eq: providerId },
            date: { between: [todayStr, endDateStr] },
          },
        });

        const filteredAvailability = { ...result };

        existingBookingsData.forEach((booking) => {
          const bookingDate = booking.date;
          const bookingStartTime = booking.time;
          const bookingDuration = booking.duration;

          if (!filteredAvailability[bookingDate]) return;

          const bookingStart = timeStringToDate(bookingDate, bookingStartTime);
          const bookingEnd = new Date(bookingStart.getTime() + bookingDuration * 60 * 60 * 1000);

          filteredAvailability[bookingDate] = filteredAvailability[bookingDate].filter((slotTime) => {
            const slotDuration = 0.5; 
            // Keep only slots that do NOT overlap booking
            return !isOverlap(slotTime, slotDuration, bookingStart, bookingEnd, bookingDate);
          });

          if (filteredAvailability[bookingDate].length === 0) {
            delete filteredAvailability[bookingDate];
  }
        });

        setAvailabilityMap(filteredAvailability);
        setExistingBookings(existingBookingsData);
      } catch (error) {
        console.error("Error loading availability:", error);
      }
    };

    loadAvailability();
  }, [providerId]);

  const availableDates = useMemo(() => {
    return new Set(
      Object.entries(availabilityMap)
        .filter(([, slots]) => slots.length > 0)
        .map(([date]) => date)
    );
  }, [availabilityMap]);

  const isDateAvailable = (year: number, month: number, day: number) => {
    const key = formatDateKey(year, month, day);
    return availabilityMap[key]?.length > 0;
  };

  const getAvailableSlots = (dateKey: string) => availabilityMap[dateKey] || [];

  const filteredDurationOptions =
  selectedDate && selectedTime
    ? filterNonOverlappingDurations(
        selectedDate,
        selectedTime,
        durationOptions,
        existingBookings
      )
    : durationOptions;

  const handleDateSelect = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const key = formatDateKey(year, month, day);
    if (isDateAvailable(year, month, day)) {
      setSelectedDate(key);
      setSelectedTime(null);
      setSelectedDuration(null);
    }
  };

  const handleMonthChange = (dir: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const updated = new Date(prev);
      updated.setMonth(prev.getMonth() + (dir === "next" ? 1 : -1));
      return updated;
    });
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleBooking = async () => {
    console.log("BOOKING PROCESS STARTED");
    if (selectedDate && selectedTime) {
      try {
        console.log("Step 1: Getting current user...");
        const user = await getCurrentUser();
        const clientId = user.userId;
        
        console.log("Step 2: Validating providerId...");
        // Safeguard: Ensure providerId exists and looks like a Cognito userId
        if (!providerId || providerId.trim() === "") {
          throw new Error("Provider ID is missing or invalid");
        }

        console.log("Step 3: Checking providerId format...");
        // Cognito userIds typically look like: "12345678-1234-1234-1234-123456789abc"
        // If it doesn't look like a UUID, it might be a database record ID instead
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidPattern.test(providerId)) {
          console.warn("WARNING: providerId doesn't look like a Cognito userId:", providerId);
        }

        console.log("Step 4: Getting client full name...");
        // Get client's full name from their profile
        let clientFullName = user.username ;
        try {
          const { data: clientProfiles } = await client.models.ClientProfile.list({
            filter: { userId: { eq: clientId } },
          });
          
          if (clientProfiles && clientProfiles.length > 0) {
            const clientProfile = clientProfiles[0];
            const firstName = clientProfile.firstName || "";
            const lastName = clientProfile.lastName || "";
            if (firstName || lastName) {
              clientFullName = `${firstName} ${lastName}`.trim();
            }
          }
        } catch (profileError) {
          console.warn("Could not fetch client profile, using username:", profileError);
        }

        const totalCost =
          providerRateFloat * Number.parseFloat(selectedDuration);

        const bookingId = uuidv4();
        console.log("🏥 ABOUT TO CREATE BOOKING with ID:", bookingId);
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (client.models.Booking.create as any)({
          id: bookingId,
          providerId: providerId,
          providerName: providerName,
          providerRate: providerRate,
          date: selectedDate,
          time: selectedTime,
          clientId: clientId,
          clientName: clientFullName,
          duration: Number.parseFloat(selectedDuration),
          totalCost: totalCost,
        });

        console.log("BOOKING CREATED SUCCESSFULLY:", result);

        // Debug logging to verify providerId is Cognito userId
        console.log("=== BOOKING MODAL DEBUG ===");
        console.log("DEBUG - providerId:", providerId, "type:", typeof providerId, "length:", providerId?.length);
        console.log("DEBUG - clientId:", clientId, "type:", typeof clientId, "length:", clientId?.length);
        console.log("DEBUG - clientFullName:", clientFullName, "type:", typeof clientFullName);
        console.log("DEBUG - user object:", user);
        console.log("=== END BOOKING MODAL DEBUG ===");

        console.log("Creating booking with:", {
          bookingId,
          providerId,
          clientId,
          userName: user.username
        });

        // Create notification for provider about the new booking request
        console.log("ABOUT TO CREATE NOTIFICATION for provider:", providerId);
        try {
          await NotificationService.createBookingRequestNotification(
            bookingId,
            providerId,
            clientId,
            clientFullName,
            {
              date: selectedDate,
              time: selectedTime,
              service: getServiceName(),
              duration: Number.parseFloat(selectedDuration),
            }
          );
          console.log(" NOTIFICATION CREATED SUCCESSFULLY");
        } catch (notificationError) {
          console.error(" NOTIFICATION CREATION FAILED:", notificationError);
          // Don't let notification failure break booking
        }

        {
          /* Stripe Checkout Data */
        }
        console.log("Booking data:", {
          providerRate,
          providerLocation,
        });
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `Care Aide with ${providerName} on ${selectedDate}, ${selectedTime} - ${getEndTime(selectedTime, Number.parseFloat(selectedDuration))}`,
            amount: totalCost,
            quantity: 1,
            bookingId,
            providerId,
            providerPhoto,
            providerName,
            providerRate,
            providerTitle,
            providerLocation,
            date: selectedDate,
            time: `${selectedTime} - ${getEndTime(selectedTime, Number.parseFloat(selectedDuration))}`,
            duration: selectedDuration,
          }),
        });

        const data = await res.json();
        if (data?.url) {
          window.location.href = data.url;
        } else {
          alert("Checkout failed");
        }

        console.log("Booking result:", JSON.stringify(result, null, 2));
        onOpenChange(false);
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedDuration(null);
      } catch (err) {
        console.error("Booking error:", err);
        alert(`Failed to book: ${(err as Error).message}`);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:max-w-[600px] lg:max-w-[600px] xl:max-w-[800px] max-h-[90vh] overflow-hidden mx-auto rounded-none">
        <DialogHeader>
          <DialogTitle>Book with {providerName}</DialogTitle>
          <DialogDescription>
            Please select a date, time, and duration for your appointment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] md:gap-6">
          {/* Calendar Section */}
          <div className="border-r pr-4">
            <Calendar
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onMonthChange={handleMonthChange}
              onDateSelect={handleDateSelect}
              availableDates={availableDates}
            />
          </div>

          {/* Time Slots Section */}
          <div className="overflow-y-auto max-h-[70vh] pr-1">
            <h3 className="font-semibold mb-4">
              {selectedDate
                ? "Available Times"
                : "Select a date to see available times"}
            </h3>

            {selectedDate && (
              <div className="space-y-2">
                {getAvailableSlots(selectedDate).map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`w-full p-3 text-left rounded-md border transition-colors cursor-pointer
                      ${
                        selectedTime === time
                          ? "bg-primary-orange text-white border-primary-orange"
                          : "bg-white hover:bg-orange-50 border-gray-200 hover:border-orange-200"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatTimeToAMPM(time)}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedTime && (
              <div className="mb-6">
                <h4 className="mt-6 font-semibold mb-3">Select Duration</h4>
                <div className="grid grid-cols-2 gap-2">
                  {filteredDurationOptions.map((duration) => (
                    <button
                      key={duration.value}
                      onClick={() => setSelectedDuration(duration.value)}
                      className={`
                        p-2 text-sm rounded-md border transition-colors cursor-pointer
                        ${
                          selectedDuration === duration.value
                            ? "bg-primary-orange text-white border-primary-orange"
                            : "bg-white hover:bg-orange-50 border-gray-200 hover:border-orange-200"
                        }
                      `}
                    >
                      {duration.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && selectedTime && selectedDuration && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h4 className="font-medium mb-2">Booking Summary</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Date:</strong> {selectedDate}</p>
                  <p><strong>Start Time:</strong> {formatTimeToAMPM(selectedTime)}</p>
                  <p>
                    <strong>End Time:</strong>{" "}
                    {getEndTime(
                      selectedTime,
                      Number.parseFloat(selectedDuration)
                    )}
                  </p>
                  <p>
                    <strong>Rate:</strong> {providerRate}
                  </p>
                  <p>
                    <strong>Total Cost:</strong> $
                    {(
                      providerRateFloat * Number.parseFloat(selectedDuration)
                    ).toFixed(2)}
                  </p>
                  <p>
                    <strong>Provider:</strong> {providerName}
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime || !selectedDuration}
              className="w-full mt-4 bg-primary-orange cursor-pointer hover:bg-primary-orange disabled:bg-gray-500 disabled:cursor-not-allowed rounded-full"
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
