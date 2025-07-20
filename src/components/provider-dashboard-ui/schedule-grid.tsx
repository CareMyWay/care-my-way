"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface TimeSlot {
  time: string
  available: boolean
  isBlocked?: boolean
  availabilityId?: string
}

interface DaySchedule {
  day: string
  date: string
  enabled: boolean
  slots: TimeSlot[]
}

interface ScheduleGridProps {
  weeklySchedule: DaySchedule[]
  canEdit: boolean
  onToggleDay: (dayIndex: number) => void
  onSlotClick: (dayIndex: number, slotIndex: number, event: React.MouseEvent) => void
  onSetDayHours: (dayIndex: number, startTime: string, endTime: string) => void
  onCopyDayToAll: (sourceDayIndex: number) => void
  onClearDay: (dayIndex: number) => void
  formatTimeSlot: (time: string) => string
  getAvailableHoursForDay: (daySchedule: DaySchedule) => number
}

export function ScheduleGrid({
  weeklySchedule,
  canEdit,
  onToggleDay,
  onSlotClick,
  onSetDayHours,
  onCopyDayToAll,
  onClearDay,
  formatTimeSlot,
  getAvailableHoursForDay,
}: ScheduleGridProps) {
  const getSlotClassName = (slot: TimeSlot, dayIndex: number) => {
    const baseClasses = "p-2 text-xs rounded transition-all duration-200 border cursor-pointer select-none"

    if (slot.isBlocked) {
      return `${baseClasses} bg-red-100 border-red-300 text-red-600 cursor-not-allowed`
    }

    if (!weeklySchedule[dayIndex].enabled || !canEdit) {
      return `${baseClasses} bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed`
    }

    if (slot.available) {
      return `${baseClasses} bg-[var(--color-available-green)] border-[var(--color-success-green)] text-[var(--color-success-green)] hover:bg-[var(--color-success-green)] hover:text-white`
    }

    return `${baseClasses} bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:border-gray-300`
  }

  const getSlotTitle = (slot: TimeSlot, dayIndex: number) => {
    if (!canEdit) {
      return `${formatTimeSlot(slot.time)} - Cannot edit current week`
    }

    if (slot.isBlocked) {
      return `${formatTimeSlot(slot.time)} - Blocked (unavailable)`
    }

    if (!weeklySchedule[dayIndex].enabled) {
      return `${formatTimeSlot(slot.time)} - Day disabled`
    }

    const action = slot.available ? "disable" : "enable"
    const shortcuts = "Shift+Click for range, Ctrl+Click for multi-select"
    return `${formatTimeSlot(slot.time)} - Click to ${action}\n${shortcuts}`
  }

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="dashboard-text-primary">Weekly Schedule</CardTitle>
        <p className="text-sm dashboard-text-secondary">
          {canEdit
            ? "Click time slots to toggle availability. Green = available, Gray = unavailable."
            : "Navigate to next week or later to edit availability."}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {weeklySchedule.map((daySchedule, dayIndex) => (
            <div key={`${daySchedule.day}-${daySchedule.date}`} className="space-y-3">
              {/* Day Header */}
              <div className="flex items-center justify-between p-4 bg-[var(--color-light-gray)] rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`day-${dayIndex}`}
                      checked={daySchedule.enabled}
                      onCheckedChange={() => onToggleDay(dayIndex)}
                      disabled={!canEdit}
                    />
                    <Label
                      htmlFor={`day-${dayIndex}`}
                      className={`text-lg font-semibold cursor-pointer ${
                        daySchedule.enabled && canEdit ? "dashboard-text-primary" : "text-gray-400"
                      }`}
                    >
                      {daySchedule.day}
                    </Label>
                    <span className="text-sm dashboard-text-secondary">
                      ({new Date(daySchedule.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })})
                    </span>
                  </div>
                  {daySchedule.enabled && (
                    <div className="text-sm dashboard-text-secondary">
                      {getAvailableHoursForDay(daySchedule)}h available
                    </div>
                  )}
                </div>

                {daySchedule.enabled && canEdit && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSetDayHours(dayIndex, "09:00", "17:00")}
                      className="text-xs dashboard-button-secondary"
                    >
                      9-5
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSetDayHours(dayIndex, "08:00", "18:00")}
                      className="text-xs dashboard-button-secondary"
                    >
                      8-6
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCopyDayToAll(dayIndex)}
                      className="text-xs dashboard-button-secondary"
                    >
                      Copy to All
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onClearDay(dayIndex)}
                      className="text-xs dashboard-button-secondary"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>

              {/* Time Slots Grid */}
              {daySchedule.enabled && (
                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 p-4 bg-white rounded-lg border border-[var(--color-medium-gray)]">
                  {daySchedule.slots.map((slot, slotIndex) => (
                    <button
                      key={slot.time}
                      onClick={(e) => onSlotClick(dayIndex, slotIndex, e)}
                      className={getSlotClassName(slot, dayIndex)}
                      title={getSlotTitle(slot, dayIndex)}
                      disabled={slot.isBlocked || !canEdit}
                    >
                      <div className="font-medium">{formatTimeSlot(slot.time)}</div>
                      {slot.isBlocked && <div className="text-xs opacity-75 mt-1">Blocked</div>}
                    </button>
                  ))}
                </div>
              )}

              {!daySchedule.enabled && (
                <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-lg">
                  <X className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Day is disabled</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
