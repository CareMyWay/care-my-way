"use client";

import { useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventContentArg } from "@fullcalendar/core";
import { format, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/provider-dashboard-ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card";
import { Badge } from "@/components/provider-dashboard-ui/badge";
import {
  isEditableWeek,
  getWeekStart,
  convertToCalendarEvents,
  generateDayTimeSlots,
  type TimeSlot
} from "@/utils/schedule-utils";
import { AvailabilityModal } from "@/components/provider-dashboard-ui/AvailabilityModal";

interface WeeklyAvailabilityCalendarProps {
  providerId: string;
  initialWeek?: Date;
  // eslint-disable-next-line no-unused-vars
  onSaveAvailability?: (date: string, timeSlots: TimeSlot[]) => Promise<boolean>;
}

export function WeeklyAvailabilityCalendar({
  providerId,
  initialWeek = new Date(),
  onSaveAvailability
}: WeeklyAvailabilityCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(() => getWeekStart(initialWeek));
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
    isAvailable: boolean;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock availability data - replace with real API calls
  const [availabilityData, setAvailabilityData] = useState<{ [date: string]: TimeSlot[] }>({
    "2025-07-21": generateDayTimeSlots(), // Future Monday
    "2025-07-22": generateDayTimeSlots(), // Future Tuesday
    // Add more mock data as needed
  });

  const isEditable = isEditableWeek(currentWeek);
  const calendarEvents = convertToCalendarEvents(currentWeek, availabilityData, providerId);

  const handlePrevWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const handleToday = () => {
    setCurrentWeek(getWeekStart(new Date()));
  };

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    if (!isEditable) {
      alert("This week cannot be edited. You can only edit weeks that are at least 3 days in the future.");
      return;
    }

    const selectedDate = format(new Date(selectInfo.start), "yyyy-MM-dd");
    const selectedTime = format(new Date(selectInfo.start), "HH:mm");
    
    // Find existing slot or create new one
    const daySlots = availabilityData[selectedDate] || generateDayTimeSlots();
    const existingSlot = daySlots.find(slot => slot.time === selectedTime);
    
    if (existingSlot && existingSlot.isBooked) {
      alert("This time slot is already booked and cannot be modified.");
      return;
    }

    setSelectedSlot({
      date: selectedDate,
      time: selectedTime,
      isAvailable: existingSlot?.isAvailable || false
    });
    setIsModalOpen(true);
  }, [isEditable, availabilityData]);

  const handleSaveSlot = async (isAvailable: boolean) => {
    if (!selectedSlot) return;

    const { date, time } = selectedSlot;
    
    // Update local state
    setAvailabilityData(prev => {
      const daySlots = prev[date] || generateDayTimeSlots();
      const updatedSlots = daySlots.map(slot => 
        slot.time === time 
          ? { ...slot, isAvailable }
          : slot
      );
      
      return { ...prev, [date]: updatedSlots };
    });

    // Save to backend if function provided
    if (onSaveAvailability) {
      const daySlots = availabilityData[date] || generateDayTimeSlots();
      const updatedSlots = daySlots.map(slot => 
        slot.time === time 
          ? { ...slot, isAvailable }
          : slot
      );
      
      await onSaveAvailability(date, updatedSlots);
    }

    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const { isAvailable, isBooked } = eventInfo.event.extendedProps;
    
    return (
      <div className="fc-event-main-frame">
        <div className="fc-event-title-container">
          <div className="fc-event-title fc-sticky text-xs font-medium">
            {isBooked ? "Booked" : isAvailable ? "Available" : "Blocked"}
          </div>
        </div>
      </div>
    );
  };

  const getWeekStatusBadge = () => {
    if (isEditable) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Editable</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">View Only</Badge>;
  };

  return (
    <Card className="border-none dashboard-bg-primary rounded-2xl dashboard-card !shadow-none">
      <CardHeader>
        <CardTitle className="dashboard-text-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Availability
          </div>
          {getWeekStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevWeek}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextWeek}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="text-xs"
            >
              Today
            </Button>
          </div>
          <h3 className="text-lg font-semibold dashboard-text-primary">
            Week of {format(currentWeek, "MMM d, yyyy")}
          </h3>
        </div>

        {/* Edit Instructions */}
        {!isEditable && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-amber-800">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                This week is view-only. You can only edit availability for weeks that are at least 3 days in the future.
              </span>
            </div>
          </div>
        )}

        {isEditable && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-800">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                Click and drag on the calendar to add or edit your availability for this week.
              </span>
            </div>
          </div>
        )}

        {/* FullCalendar */}
        <div className="fc-custom-theme">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={false}
            events={calendarEvents}
            selectable={isEditable}
            selectMirror={true}
            select={handleDateSelect}
            eventContent={renderEventContent}
            slotMinTime="09:00:00"
            slotMaxTime="17:00:00"
            height="600px"
            dayHeaderFormat={{ weekday: "short", month: "numeric", day: "numeric" }}
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              hour12: true
            }}
            allDaySlot={false}
            nowIndicator={true}
            weekends={true}
            initialDate={currentWeek}
            validRange={{
              start: format(currentWeek, "yyyy-MM-dd"),
              end: format(addWeeks(currentWeek, 1), "yyyy-MM-dd")
            }}
            eventClassNames={(arg) => {
              const { isBooked, isEditable: slotEditable } = arg.event.extendedProps;
              const baseClasses = ["rounded", "border-2"];
              
              if (isBooked) {
                return [...baseClasses, "bg-red-200", "border-red-400", "text-red-800"];
              }
              
              if (!slotEditable) {
                return [...baseClasses, "bg-gray-200", "border-gray-400", "text-gray-600", "opacity-60"];
              }
              
              return [...baseClasses, "hover:shadow-md", "cursor-pointer"];
            }}
            selectConstraint={{
              start: "09:00",
              end: "17:00"
            }}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 border-2 border-green-400 rounded"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 border-2 border-gray-400 rounded"></div>
            <span className="text-sm text-gray-600">Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border-2 border-red-400 rounded"></div>
            <span className="text-sm text-gray-600">Booked</span>
          </div>
        </div>

        {/* Availability Modal */}
        <AvailabilityModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSlot(null);
          }}
          onSave={handleSaveSlot}
          selectedSlot={selectedSlot}
        />
      </CardContent>
    </Card>
  );
}
