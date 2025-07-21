"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Calendar, Clock, Save, ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AvailabilityManager } from "@/components/provider-dashboard-ui/availability-manager";
import { WeekNavigation } from "@/components/provider-dashboard-ui/week-navigation";
import { ScheduleGrid } from "@/components/provider-dashboard-ui/schedule-grid";
import { useAvailabilityEditor } from "@/hooks/useAvailabilityEditor";

export default function EditAvailabilityPage() {
  const [realTime, setRealTime] = useState(new Date());

  // Use the custom hook for all availability logic
  const {
    // State
    currentWeekStart,
    hasChanges,
    isSaving,
    lastSaved,
    errors,
    isLoadingUser,
    providerProfile,
    weeklySchedule,
    isLoadingSchedule,
    applyToFuture,
    availabilityManagerRef,

    // Setters
    setApplyToFuture,

    // Utility functions
    formatTimeSlot,
    canEditCurrentWeek,
    canNavigatePrev,
    getAvailableHoursForDay,
    getTotalAvailableHours,

    // Handlers
    navigateWeek,
    handleScheduleLoaded,
    handleSaveComplete,
    setupMonFri9to5,
    setupAllDays8to6,
    handleSlotClick,
    toggleDayEnabled,
    setDayHours,
    copyDayToAll,
    clearDay,
    saveChanges,
  } = useAvailabilityEditor();

  useEffect(() => {
    const timer = setInterval(() => setRealTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Show loading state while loading user
  if (isLoadingUser) {
    return (
      <div className="min-h-screen dashboard-bg-primary p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 dashboard-text-primary" />
              <p className="dashboard-text-primary">Loading user profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no provider profile
  if (!providerProfile) {
    return (
      <div className="min-h-screen dashboard-bg-primary p-6">
        <div className="max-w-7xl mx-auto">
          <Alert className="border-red-200 bg-red-50 mt-8">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-2">
                <div className="font-semibold">Unable to load provider profile</div>
                {errors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
                <div className="mt-4">
                  <Link href="/provider-dashboard/profile">
                    <Button className="dashboard-button-primary text-white">Complete Provider Profile</Button>
                  </Link>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/provider-dashboard/schedule" className="no-underline">
              <Button variant="outline" className="dashboard-button-secondary flex items-center gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Back to Schedule
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold dashboard-text-primary">Edit Weekly Availability</h1>
              <div className="flex items-center gap-4 text-sm dashboard-text-secondary">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(realTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">{formatTime(realTime)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            {lastSaved && (
              <div className="text-sm dashboard-text-secondary">Last saved: {lastSaved.toLocaleTimeString()}</div>
            )}
            
            {/* Recurring Availability Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="apply-to-future"
                checked={applyToFuture}
                onCheckedChange={(checked) => setApplyToFuture(checked as boolean)}
              />
              <Label
                htmlFor="apply-to-future"
                className="text-sm dashboard-text-primary cursor-pointer"
              >
                Apply to all future weeks
              </Label>
            </div>
            
            <Button
              onClick={saveChanges}
              disabled={!hasChanges || isSaving || !canEditCurrentWeek()}
              className="dashboard-button-primary text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {applyToFuture ? "Saving to all weeks..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {applyToFuture ? "Save for All Future Weeks" : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Availability Manager */}
        <AvailabilityManager
          ref={availabilityManagerRef}
          providerId={providerProfile.userId}
          profileOwner={providerProfile.profileOwner}
          currentWeekStart={currentWeekStart}
          onScheduleLoaded={handleScheduleLoaded}
          onSaveComplete={handleSaveComplete}
          skipAutoLoad={hasChanges} // Skip auto-loading when user has unsaved changes
        />

        {/* Week Navigation */}
        <WeekNavigation
          currentWeekStart={currentWeekStart}
          onNavigate={navigateWeek}
          canNavigatePrev={canNavigatePrev()}
        />

        {/* Error Messages */}
        {errors.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-1">
                <div className="font-semibold">Please fix these errors:</div>
                {errors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* How to Use Instructions */}
        {canEditCurrentWeek() && weeklySchedule.length > 0 && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 mt-0.5">💡</div>
              <div className="text-blue-800">
                <div className="font-semibold mb-2">How to set your availability:</div>
                <div className="space-y-1 text-sm">
                  <div>• <strong>Click</strong> individual time slots to toggle availability</div>
                  <div>• <strong>Shift + Click</strong> to select a range of time slots</div>
                  <div>• <strong>Ctrl/Cmd + Click</strong> to select multiple individual slots</div>
                  <div>• Use preset buttons (9-5, 8-6) for quick setup</div>
                  <div>• Toggle the <strong>&ldquo;Apply to all future weeks&rdquo;</strong> checkbox to make this your permanent schedule</div>
                  <div>• Green slots = Available, Gray slots = Unavailable</div>
                </div>
              </div>
            </div>
          </Alert>
        )}

        {/* Current Week Restriction Alert */}
        {!canEditCurrentWeek() && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="font-semibold">Cannot edit current week availability</div>
              <div>
                You can only modify availability for next week and beyond. Please navigate to next week to make changes.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading Schedule */}
        {isLoadingSchedule && (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 dashboard-text-primary" />
              <p className="dashboard-text-secondary">Loading schedule...</p>
            </div>
          </div>
        )}

        {/* New Provider Welcome */}
        {!isLoadingSchedule && weeklySchedule.length > 0 && getTotalAvailableHours() === 0 && (
          <Card className="dashboard-card mb-6">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="text-6xl">👋</div>
                <div>
                  <h3 className="text-xl font-bold dashboard-text-primary mb-2">Welcome! Let&apos;s set up your availability</h3>
                  <p className="dashboard-text-secondary mb-4">
                    You haven&apos;t set any availability yet. Start by enabling the days you want to work and selecting your available time slots.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    onClick={setupMonFri9to5}
                    className="dashboard-button-primary text-white"
                  >
                    Quick Setup: Mon-Fri 9AM-5PM
                  </Button>
                  <Button
                    onClick={setupAllDays8to6}
                    variant="outline"
                    className="dashboard-button-secondary"
                  >
                    Quick Setup: All Days 8AM-6PM
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {weeklySchedule.length > 0 && (
          <Card className="dashboard-card mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-2xl font-bold dashboard-text-primary">{getTotalAvailableHours()}h</div>
                    <div className="text-sm dashboard-text-secondary">Total weekly hours</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold dashboard-text-primary">
                      {weeklySchedule.filter((day) => day.enabled).length}
                    </div>
                    <div className="text-sm dashboard-text-secondary">Active days</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule Grid */}
        {weeklySchedule.length > 0 && (
          <ScheduleGrid
            weeklySchedule={weeklySchedule}
            canEdit={canEditCurrentWeek()}
            onToggleDay={toggleDayEnabled}
            onSlotClick={handleSlotClick}
            onSetDayHours={setDayHours}
            onCopyDayToAll={copyDayToAll}
            onClearDay={clearDay}
            formatTimeSlot={formatTimeSlot}
            getAvailableHoursForDay={getAvailableHoursForDay}
          />
        )}
      </div>
    </div>
  );
}
