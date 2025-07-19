"use client";

import { useState, useEffect } from "react";
import { X, Clock, Save } from "lucide-react";
import { Button } from "@/components/provider-dashboard-ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/provider-dashboard-ui/card";
import { formatDisplayTime } from "@/utils/schedule-utils";

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSave: (isAvailable: boolean, notes?: string) => void;
  selectedSlot: {
    date: string;
    time: string;
    isAvailable: boolean;
  } | null;
}

export function AvailabilityModal({
  isOpen,
  onClose,
  onSave,
  selectedSlot
}: AvailabilityModalProps) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (selectedSlot) {
      setIsAvailable(selectedSlot.isAvailable);
      setNotes("");
    }
  }, [selectedSlot]);

  const handleSave = () => {
    onSave(isAvailable, notes);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !selectedSlot) return null;

  const formattedDate = new Date(selectedSlot.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
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
        <CardContent className="space-y-4">
          {/* Date and Time Display */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Date & Time</div>
            <div className="font-medium text-gray-900">
              {formattedDate}
            </div>
            <div className="text-lg font-semibold text-blue-600">
              {formatDisplayTime(selectedSlot.time)}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">
              Availability Status
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  checked={isAvailable}
                  onChange={() => setIsAvailable(true)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-200 border border-green-400 rounded"></div>
                  <span className="text-sm font-medium text-green-700">Available</span>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  checked={!isAvailable}
                  onChange={() => setIsAvailable(false)}
                  className="h-4 w-4 text-gray-600 focus:ring-gray-500"
                />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-200 border border-gray-400 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Blocked</span>
                </div>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this time slot..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
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
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
