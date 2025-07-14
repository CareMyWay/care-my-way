"use client";

<<<<<<< HEAD
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
=======
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "amplify/data/resource";
import { v4 as uuidv4 } from "uuid";
>>>>>>> 2b77d97 (Fixed booking model file structure and implemented stripe hosted checkout page)

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

<<<<<<< HEAD
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



=======
>>>>>>> 2b77d97 (Fixed booking model file structure and implemented stripe hosted checkout page)
interface BookingModalProps {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (_: boolean) => void;
  providerName: string;
  providerTitle: string;
  providerRate: string;
}

export default function BookingModal({
  isOpen,
  onOpenChange,
  providerName,
  providerRate,
}: BookingModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

<<<<<<< HEAD
=======
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ];

>>>>>>> 2b77d97 (Fixed booking model file structure and implemented stripe hosted checkout page)
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

<<<<<<< HEAD
  const availableDates = useMemo(() => {
    return new Set(
      Object.entries(mockAvailability)
        .filter(([, slots]) => slots.length > 0)
        .map(([date]) => date)
    );
  }, [mockAvailability]);
=======
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);

    return days;
  };

  const formatDateKey = (year: number, month: number, day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
>>>>>>> 2b77d97 (Fixed booking model file structure and implemented stripe hosted checkout page)

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
<<<<<<< HEAD
        const user = await getCurrentUser();
        const clientId = user.userId;
        const totalCost = 20 * Number.parseFloat(selectedDuration!);

        const bookingId = uuidv4();
        const result = await client.models.Booking.create({
          id: bookingId,
=======
        // Temporarily commented out Auth user fetching:
        // const user = await Auth.currentAuthenticatedUser();
        // const clientId = user.attributes.sub;

        // Use dummy clientId
        const clientId = "anonymous-client";

        // TODO: Create duration in dynamoDB and status
        const result = await client.models.Booking.create({
          id: uuidv4(),
>>>>>>> 2b77d97 (Fixed booking model file structure and implemented stripe hosted checkout page)
          providerName,
          providerRate,
          date: selectedDate,
          time: selectedTime,
          clientId,
<<<<<<< HEAD
          clientName: [user.username],
          duration: Number.parseFloat(selectedDuration),
          totalCost: totalCost,
        });

        {/* Stripe Checkout Data */}
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
        }),
        });

        const data = await res.json();
        if (data?.url) {
          window.location.href = data.url;
        } else {
          alert("Checkout failed");
        }

        console.log("Booking result:", JSON.stringify(result, null, 2));
=======
        });

        console.log("Booking created:", result);
        const duration = durationOptions.find((d) => d.value === selectedDuration)?.label;
        alert(`Booking confirmed for ${selectedDate} at ${selectedTime} for ${duration}.`);
>>>>>>> 2b77d97 (Fixed booking model file structure and implemented stripe hosted checkout page)
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

<<<<<<< HEAD
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:max-w-[600px] lg:max-w-[600px] xl:max-w-[800px] max-h-[90vh] overflow-hidden mx-auto rounded-none">
        <DialogHeader>
          <DialogTitle>Book with {providerName}</DialogTitle>
          <DialogDescription>Please select a date, time, and duration for your appointment.</DialogDescription>
=======
  const days = getDaysInMonth(currentMonth);
  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();

  const today = new Date();
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 6, 1);
  const maxMonth = maxDate.getMonth();
  const maxYear = maxDate.getFullYear();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:max-w-[600px] lg:max-w-[600px] xl:max-w-[800px] max-h-[90vh] overflow-hidden mx-auto">
        <DialogHeader>
          <DialogTitle>Book with {providerName}</DialogTitle>
>>>>>>> 2b77d97 (Fixed booking model file structure and implemented stripe hosted checkout page)
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] md:gap-6">
          {/* Calendar Section */}
<<<<<<< HEAD
          <div className="border-r pr-4">
            <Calendar
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onMonthChange={handleMonthChange}
              onDateSelect={handleDateSelect}
              availableDates={availableDates}
            />
=======
          <div className="w-full md:w-[300px] lg:w-[400px] ml-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {monthNames[currentMonthIndex]} {currentYear}
              </h3>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMonthChange("prev")}
                  disabled={
                    currentMonthIndex === today.getMonth() &&
                    currentYear === today.getFullYear()
                  }
                  className="cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4"/>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMonthChange("next")}
                  disabled={currentMonthIndex === maxMonth && currentYear === maxYear}
                  className="cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="text-center text-sm font-medium text-muted-foreground p-2"
                >
                  {d}
                </div>
              ))}
              {days.map((day, index) => {
                if (day === null) return <div key={`empty-${index}`} className="p-2" />;
                const dateKey = formatDateKey(currentYear, currentMonthIndex, day);
                const isAvailable = isDateAvailable(currentYear, currentMonthIndex, day);
                const isSelected = selectedDate === dateKey;

                return (
                  <button
                    key={dateKey}
                    onClick={() => handleDateSelect(day)}
                    disabled={!isAvailable}
                    className={`p-2 text-sm rounded-md transition-colors
                      ${isAvailable ? "hover:bg-orange-100 cursor-pointer" : "text-muted-foreground cursor-not-allowed"}
                      ${isSelected ? "bg-primary-orange text-white" : ""}
                      ${isAvailable && !isSelected ? "bg-green-50 text-green-700 border border-green-200" : ""}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
>>>>>>> 2b77d97 (Fixed booking model file structure and implemented stripe hosted checkout page)
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
<<<<<<< HEAD
                  <p><strong>Start Time:</strong> {selectedTime}</p>
                  <p>
                    <strong>End Time:</strong>{" "}
                    {getEndTime(selectedTime, Number.parseFloat(selectedDuration))}
                  </p>
=======
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Duration:</strong> {durationOptions.find((d) => d.value === selectedDuration)?.label}</p>
>>>>>>> 2b77d97 (Fixed booking model file structure and implemented stripe hosted checkout page)
                  <p><strong>Rate:</strong> {providerRate}</p>
                  <p><strong>Total Cost:</strong> ${(20 * Number.parseFloat(selectedDuration)).toFixed(2)}</p>
                  <p><strong>Provider:</strong> {providerName}</p>
                </div>
              </div>
            )}

            <Button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime || !selectedDuration}
<<<<<<< HEAD
              className="w-full mt-4 bg-primary-orange cursor-pointer hover:bg-primary-orange disabled:bg-gray-500 disabled:cursor-not-allowed rounded-full"
=======
              className="w-full mt-4 bg-primary-orange cursor-pointer hover:bg-primary-orange disabled:bg-gray-500 disabled:cursor-not-allowed"
>>>>>>> 2b77d97 (Fixed booking model file structure and implemented stripe hosted checkout page)
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
