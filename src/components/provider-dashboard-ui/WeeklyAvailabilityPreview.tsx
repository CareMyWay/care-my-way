"use client";

import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface WeeklyAvailabilityPreviewProps {
  currentDate: Date;
}

export function WeeklyAvailabilityPreview({ currentDate }: WeeklyAvailabilityPreviewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  // Mock availability data - in real app, this would come from your backend
  const mockAvailability = {
    "monday": { available: 8, total: 16 },
    "tuesday": { available: 6, total: 16 },
    "wednesday": { available: 10, total: 16 },
    "thursday": { available: 4, total: 16 },
    "friday": { available: 12, total: 16 },
    "saturday": { available: 0, total: 16 },
    "sunday": { available: 0, total: 16 },
  };

  const getDayAvailability = (date: Date) => {
    const dayName = format(date, "EEEE").toLowerCase();
    return mockAvailability[dayName as keyof typeof mockAvailability] || { available: 0, total: 16 };
  };

  return (
    <div className="space-y-4">
      {/* Week Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Week of {format(weekStart, "MMM d, yyyy")}
        </h3>
        <p className="text-sm text-gray-600">
          Your availability overview for this week
        </p>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const isToday = isSameDay(day, today);
          const isPast = day < today && !isToday;
          const availability = getDayAvailability(day);
          const percentAvailable = (availability.available / availability.total) * 100;

          return (
            <div
              key={index}
              className={`p-3 rounded-lg border text-center transition-colors ${
                isToday
                  ? "bg-blue-50 border-blue-200"
                  : isPast
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              {/* Day Name */}
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                {format(day, "EEE")}
              </div>
              
              {/* Day Number */}
              <div className={`text-lg font-semibold mb-2 ${
                isToday ? "text-blue-600" : isPast ? "text-gray-400" : "text-gray-900"
              }`}>
                {format(day, "d")}
              </div>

              {/* Availability Indicator */}
              <div className="space-y-1">
                {availability.available > 0 ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                    <div className="text-xs text-green-600 font-medium">
                      {availability.available} slots
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-gray-400 mx-auto" />
                    <div className="text-xs text-gray-500">
                      Unavailable
                    </div>
                  </>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      percentAvailable > 0 ? "bg-green-500" : "bg-gray-400"
                    }`}
                    style={{ width: `${percentAvailable}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Total Available Slots:</span>
          </div>
          <span className="font-semibold text-gray-900">
            {Object.values(mockAvailability).reduce((sum, day) => sum + day.available, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
