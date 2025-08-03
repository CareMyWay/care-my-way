"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "amplify/data/resource";
import { v4 as uuidv4 } from "uuid";

const client = generateClient<Schema>();

export interface CreateNotificationParams {
  recipientId: string;
  recipientType: "provider" | "client";
  senderId: string;
  senderName: string;
  type: "booking_request" | "booking_accepted" | "booking_declined";
  title: string;
  message: string;
  bookingId?: string;
  metadata?: Record<string, unknown>;
  expiresAt?: Date;
}

export class NotificationService {
  // Create a new notification
  static async createNotification(params: CreateNotificationParams) {
    try {
      const notificationId = uuidv4();
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (client.models.Notification.create as any)({
        id: notificationId,
        recipientId: [params.recipientId],
        recipientType: [params.recipientType],
        senderId: [params.senderId],
        senderName: [params.senderName],
        type: [params.type],
        title: [params.title],
        message: [params.message],
        bookingId: [params.bookingId || ""],
        metadata: [params.metadata ? JSON.stringify(params.metadata) : ""],
        expiresAt: [params.expiresAt?.toISOString() || ""],
      });

      return result;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  // Create booking request notification for provider
  static async createBookingRequestNotification(
    bookingId: string,
    providerId: string,
    clientId: string,
    clientName: string,
    bookingDetails: {
      date: string;
      time: string;
      service: string;
      duration: number;
      location?: string;
    }
  ) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    return this.createNotification({
      recipientId: providerId,
      recipientType: "provider",
      senderId: clientId,
      senderName: clientName,
      type: "booking_request",
      title: "New Booking Request",
      message: `${clientName} has requested a booking for ${bookingDetails.service} on ${bookingDetails.date} at ${bookingDetails.time} for ${bookingDetails.duration} hours.`,
      bookingId,
      expiresAt,
      metadata: {
        bookingDetails,
        mustRespondBy: expiresAt.toISOString(),
      },
    });
  }

  // Create booking acceptance notification for client
  static async createBookingAcceptedNotification(
    bookingId: string,
    clientId: string,
    providerId: string,
    providerName: string,
    bookingDetails: {
      date: string;
      time: string;
      service: string;
    }
  ) {
    return this.createNotification({
      recipientId: clientId,
      recipientType: "client",
      senderId: providerId,
      senderName: providerName,
      type: "booking_accepted",
      title: "Booking Confirmed",
      message: `${providerName} has accepted your booking request for ${bookingDetails.service} on ${bookingDetails.date} at ${bookingDetails.time}.`,
      bookingId,
      metadata: { bookingDetails },
    });
  }

  // Create booking declined notification for client
  static async createBookingDeclinedNotification(
    bookingId: string,
    clientId: string,
    providerId: string,
    providerName: string,
    bookingDetails: {
      date: string;
      time: string;
      service: string;
    }
  ) {
    return this.createNotification({
      recipientId: clientId,
      recipientType: "client",
      senderId: providerId,
      senderName: providerName,
      type: "booking_declined",
      title: "Booking Declined",
      message: `${providerName} has declined your booking request for ${bookingDetails.service} on ${bookingDetails.date} at ${bookingDetails.time}. Please try booking with another provider.`,
      bookingId,
      metadata: { bookingDetails },
    });
  }

  // Get all notifications for a user (will filter on frontend)
  static async getNotificationsForUser(userId: string) {
    try {
      const result = await client.models.Notification.list({
        filter: { recipientId: { eq: userId } },
        limit: 100,
      });

      return result.data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  // Simple update without filters for now
  static async updateNotification(id: string, updates: Record<string, unknown>) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (client.models.Notification.update as any)({
        id,
        ...updates,
      });

      return result;
    } catch (error) {
      console.error("Error updating notification:", error);
      throw error;
    }
  }
}
