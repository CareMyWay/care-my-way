"use client";

import { useState } from "react";
import { X, Calendar, Save, Plus } from "lucide-react";
import { Button } from "@/components/provider-dashboard-ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card";
import { Badge } from "@/components/provider-dashboard-ui/badge";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

interface TimeSlot {
  time: string;
  isAvailable: boolean;
  isBooked?: boolean;
}

interface AvailabilityEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSave: (date: string, timeSlots: TimeSlot[]) => void;
  providerId: string;
}

export function AvailabilityEditorModal({
  isOpen,
  onClose,
  onSave
}: AvailabilityEditorModalProps) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  
  // Sample time slots for demonstration
  const timeSlots = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
  ];

  // Mock availability data - in real app, this would come from your backend
  const [availability, setAvailability] = useState<Record<string, TimeSlot[]>>({});

  const getWeekDays = () => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
  };

  const getAvailabilityForDate = (date: Date): TimeSlot[] => {
    const dateStr = format(date, "yyyy-MM-dd");
    return availability[dateStr] || timeSlots.map(time => ({
      time,
      isAvailable: false,
      isBooked: false
    }));
  };

  const toggleTimeSlot = (date: Date, timeSlot: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const currentSlots = getAvailabilityForDate(date);
    
    const updatedSlots = currentSlots.map(slot =>
      slot.time === timeSlot ? { ...slot, isAvailable: !slot.isAvailable } : slot
    );
    
    setAvailability(prev => ({
      ...prev,
      [dateStr]: updatedSlots
    }));
  };

  const toggleAllDay = (date: Date, isAvailable: boolean) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const updatedSlots = timeSlots.map(time => ({
      time,
      isAvailable,
      isBooked: false
    }));
    
    setAvailability(prev => ({
      ...prev,
      [dateStr]: updatedSlots
    }));
  };

  const handleSave = () => {
    // Save all availability changes
    Object.entries(availability).forEach(([date, slots]) => {
      onSave(date, slots);
    });
    onClose();
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  if (!isOpen) return null;

  const weekDays = getWeekDays();
  const today = new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Edit Availability
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek("prev")}
            >
              ← Previous Week
            </Button>
            <h3 className="text-lg font-medium">
              {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek("next")}
            >
              Next Week →
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, dayIndex) => {
              const dayAvailability = getAvailabilityForDate(day);
              const isToday = isSameDay(day, today);
              const isPast = day < today && !isToday;
              const availableCount = dayAvailability.filter(slot => slot.isAvailable).length;

              return (
                <div key={dayIndex} className="space-y-3">
                  {/* Day Header */}
                  <div className={`text-center p-3 rounded-lg border ${
                    isToday 
                      ? "bg-blue-50 border-blue-200" 
                      : isPast 
                        ? "bg-gray-50 border-gray-200" 
                        : "bg-white border-gray-200"
                  }`}>
                    <div className="text-xs text-gray-600 uppercase tracking-wide">
                      {format(day, "EEE")}
                    </div>
                    <div className={`text-lg font-semibold ${
                      isToday ? "text-blue-600" : isPast ? "text-gray-400" : "text-gray-900"
                    }`}>
                      {format(day, "d")}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {availableCount} available
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAllDay(day, true)}
                      disabled={isPast}
                      className="w-full text-xs h-7 text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      All Day
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAllDay(day, false)}
                      disabled={isPast}
                      className="w-full text-xs h-7 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Clear All
                    </Button>
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {dayAvailability.map((slot, slotIndex) => (
                      <button
                        key={slotIndex}
                        onClick={() => !isPast && toggleTimeSlot(day, slot.time)}
                        disabled={isPast || slot.isBooked}
                        className={`w-full text-xs p-2 rounded text-left transition-colors ${
                          slot.isBooked
                            ? "bg-red-100 text-red-800 border border-red-200 cursor-not-allowed"
                            : slot.isAvailable
                              ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                              : isPast
                                ? "bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed"
                                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{slot.time}</span>
                          {slot.isBooked && (
                            <Badge variant="outline" className="text-xs py-0 px-1">
                              Booked
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Legend:</h4>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
                <span>Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                <span>Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
                <span>Today</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
