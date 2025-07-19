"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generateClient } from "aws-amplify/data";
import { Clock } from "lucide-react";
import type { Schema } from "amplify/data/resource";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@aws-amplify/auth";
import { DialogDescription } from "@radix-ui/react-dialog";
import Calendar from "./ui/calendar";
import { formatDateKey } from "@/utils/calendar-date-format";

const client = generateClient<Schema>();

const mockAvailability = {
  "2025-07-10": ["9:00 AM", "2:00 PM", "4:00 PM"],
  "2025-07-11": ["10:00 AM", "1:00 PM"],
  "2025-07-12": ["9:00 AM", "11:00 AM", "3:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"],
  "2025-07-15": ["8:00 AM", "2:00 PM"],
  "2025-07-18": ["10:00 AM", "4:00 PM"],
  "2025-07-20": ["9:00 AM", "1:00 PM", "5:00 PM"],
  "2025-07-22": ["9:00 AM", "2:00 PM"],
  "2025-07-24": ["10:00 AM", "3:00 PM"],
  "2025-07-26": ["8:00 AM", "1:00 PM", "4:00 PM"],
  "2025-07-28": ["9:00 AM", "2:00 PM"],
  "2025-07-30": ["10:00 AM", "1:00 PM"],
  "2025-07-31": ["9:00 AM", "3:00 PM", "5:00 PM"],
};

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
}: BookingModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

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

  const availableDates = useMemo(() => {
    return new Set(
      Object.entries(mockAvailability)
        .filter(([, slots]) => slots.length > 0)
        .map(([date]) => date)
    );
  }, [mockAvailability]);

  const isDateAvailable = (year: number, month: number, day: number) => {
    const key = formatDateKey(year, month, day);
    return mockAvailability[key]?.length > 0;
  };

  const getAvailableSlots = (dateKey: string) => mockAvailability[dateKey] || [];

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
    if (selectedDate && selectedTime) {
      try {
        const user = await getCurrentUser();
        const clientId = user.userId;
<<<<<<< HEAD
        const totalCost = providerRateFloat * Number.parseFloat(selectedDuration);
=======
        const totalCost = 20 * Number.parseFloat(selectedDuration!);
>>>>>>> 0099742 (Completed booking status update)

        const bookingId = uuidv4();
        const result = await client.models.Booking.create({
          id: bookingId,
          providerName,
          providerRate,
          date: selectedDate,
          time: selectedTime,
          clientId,
          clientName: [user.username],
          duration: Number.parseFloat(selectedDuration),
          totalCost: totalCost,
        });

        {/* Stripe Checkout Data */}
<<<<<<< HEAD
        console.log("Booking data:", {
          providerRate, providerLocation});
=======
>>>>>>> 0099742 (Completed booking status update)
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
<<<<<<< HEAD
          providerId,
          providerPhoto,
          providerName,
          providerRate,
          providerTitle,
          providerLocation,
          date: selectedDate,
          time: `${selectedTime} - ${getEndTime(selectedTime, Number.parseFloat(selectedDuration))}`,
          duration: selectedDuration,
=======
>>>>>>> 0099742 (Completed booking status update)
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
          <DialogDescription>Please select a date, time, and duration for your appointment.</DialogDescription>
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
              {selectedDate ? "Available Times" : "Select a date to see available times"}
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
                      {time}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedTime && (
              <div className="mb-6">
                <h4 className="mt-6 font-semibold mb-3">Select Duration</h4>
                <div className="grid grid-cols-2 gap-2">
                  {durationOptions.map((duration) => (
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
                  <p><strong>Start Time:</strong> {selectedTime}</p>
                  <p>
                    <strong>End Time:</strong>{" "}
                    {getEndTime(selectedTime, Number.parseFloat(selectedDuration))}
                  </p>
                  <p><strong>Rate:</strong> {providerRate}</p>
                  <p><strong>Total Cost:</strong> ${((providerRateFloat) * Number.parseFloat(selectedDuration)).toFixed(2)}</p>
                  <p><strong>Provider:</strong> {providerName}</p>
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
