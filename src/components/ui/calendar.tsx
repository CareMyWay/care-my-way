"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarLegend from "@/components/ui/calendar-legend";
import { formatDateKey } from "@/utils/calendar-date-format";

interface CalendarProps {
  currentMonth: Date;
  selectedDate: string | null;
  // eslint-disable-next-line no-unused-vars
  onMonthChange: (dir: "prev" | "next") => void;
  // eslint-disable-next-line no-unused-vars
  onDateSelect: (day: number) => void;
  availableDates: Set<string>;
}

export default function Calendar({
  currentMonth,
  selectedDate,
  onMonthChange,
  onDateSelect,
  availableDates,
}: CalendarProps) {
  
    const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ];

  const today = new Date();
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 6, 1);
  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();
  const maxMonth = maxDate.getMonth();
  const maxYear = maxDate.getFullYear();

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

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="w-full md:w-[300px] lg:w-[400px] ml-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">
          {monthNames[currentMonthIndex]} {currentYear}
        </h3>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMonthChange("prev")}
            disabled={
              currentMonthIndex === today.getMonth() &&
              currentYear === today.getFullYear()
            }
            className="cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMonthChange("next")}
            disabled={currentMonthIndex === maxMonth && currentYear === maxYear}
            className="cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center text-sm font-medium text-muted-foreground p-2"
          >
            {d}
          </div>
        ))}

        {/* Calendar Grid */}
        {days.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} className="p-2" />;

          const dateKey = formatDateKey(currentYear, currentMonthIndex, day);
          const isAvailable = availableDates.has(dateKey);
          const isSelected = selectedDate === dateKey;

          return (
            <button
              key={dateKey}
              onClick={() => onDateSelect(day)}
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

      {/* Legend */}
      <CalendarLegend />
    </div>
  );
}
