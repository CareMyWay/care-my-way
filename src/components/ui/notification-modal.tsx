"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, User, Calendar } from "lucide-react";
import { NotificationService } from "@/services/notificationService";
import { BookingService } from "@/services/bookingService";
import { getCurrentUser } from "@aws-amplify/auth";

interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  bookingId?: string;
  senderId: string;
  senderName: string;
  isRead: boolean;
  isActioned: boolean;
  createdAt: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (isOpen: boolean) => void;
  onNotificationUpdate?: () => void;
}

export default function NotificationModal({
  isOpen,
  onOpenChange,
  onNotificationUpdate,
}: NotificationModalProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      console.log("🔔 FETCHING NOTIFICATIONS for user:", user.userId);
      
      const notificationData = await NotificationService.getNotificationsForUser(user.userId);
      console.log("🔔 RAW NOTIFICATION DATA:", notificationData);
      console.log("🔔 Number of notifications found:", notificationData.length);
      
      // Filter for unactioned booking requests and recent notifications
      const relevantNotifications = notificationData.filter(notification => 
        notification.type === "booking_request" && !notification.isActioned ||
        notification.type === "booking_accepted" ||
        notification.type === "booking_declined"
      );
      
      console.log("🔔 RELEVANT NOTIFICATIONS after filter:", relevantNotifications);
      console.log("🔔 Number of relevant notifications:", relevantNotifications.length);
      
      // Map to our interface type
      const mappedNotifications = relevantNotifications.map(notification => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        bookingId: notification.bookingId,
        senderId: notification.senderId,
        senderName: notification.senderName,
        isRead: notification.isRead,
        isActioned: notification.isActioned,
        createdAt: notification.createdAt,
        // Remove metadata reference since we removed it from schema
      }));
      
      console.log("🔔 MAPPED NOTIFICATIONS:", mappedNotifications);
      setNotifications(mappedNotifications);
      
      // Mark notifications as read
      const unreadNotifications = relevantNotifications.filter(n => !n.isRead);
      for (const notification of unreadNotifications) {
        await NotificationService.updateNotification(notification.id, { isRead: true });
      }
    } catch (error) {
      console.error("🔔 Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (notificationId: string, bookingId: string) => {
    if (!bookingId) return;
    
    try {
      setActionLoading(notificationId);
      const user = await getCurrentUser();
      
      await BookingService.acceptBooking(
        bookingId,
        user.userId,
        user.username || "Provider",
        notificationId
      );
      
      // Mark notification as actioned
      await NotificationService.updateNotification(notificationId, { 
        isActioned: true 
      });
      
      // Remove from list
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      onNotificationUpdate?.();
    } catch (error) {
      console.error("Error accepting booking:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineBooking = async (notificationId: string, bookingId: string) => {
    if (!bookingId) return;
    
    try {
      setActionLoading(notificationId);
      const user = await getCurrentUser();
      
      await BookingService.declineBooking(
        bookingId,
        user.userId,
        user.username || "Provider",
        notificationId
      );
      
      // Mark notification as actioned
      await NotificationService.updateNotification(notificationId, { 
        isActioned: true 
      });
      
      // Remove from list
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      onNotificationUpdate?.();
    } catch (error) {
      console.error("Error declining booking:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Notifications</span>
            {notifications.length > 0 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {notifications.length}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-4">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-lg">Loading notifications...</div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-sm">You&apos;re all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {notification.type === "booking_request" ? (
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                        ) : notification.type === "booking_accepted" ? (
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="h-5 w-5 text-red-600" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <User className="h-4 w-4" />
                          <span>From: {notification.senderName}</span>
                        </div>
                        
                        {notification.type === "booking_request" && notification.bookingId && !notification.isActioned && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleAcceptBooking(notification.id, notification.bookingId!)}
                              disabled={actionLoading === notification.id}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {actionLoading === notification.id ? "Accepting..." : "Accept"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeclineBooking(notification.id, notification.bookingId!)}
                              disabled={actionLoading === notification.id}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              {actionLoading === notification.id ? "Declining..." : "Decline"}
                            </Button>
                          </div>
                        )}
                        
                        {notification.type === "booking_request" && (
                          <div className="mt-2">
                            <Badge 
                              variant="outline" 
                              className="text-xs text-amber-600 border-amber-300"
                            >
                              ⏰ Please respond within 24 hours
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
