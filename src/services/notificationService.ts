"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";
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
  expiresAt?: Date;
}

export class NotificationService {
  // Create a new notification
  static async createNotification(params: CreateNotificationParams) {
    try {
      console.log("=== NOTIFICATION CREATION START ===");
      console.log("Creating notification with params:", params);
      console.log("DEBUG - recipientId:", params.recipientId, "type:", typeof params.recipientId);
      console.log("DEBUG - senderId:", params.senderId, "type:", typeof params.senderId);
      console.log("DEBUG - senderName:", params.senderName, "type:", typeof params.senderName);
      console.log("DEBUG - bookingId:", params.bookingId, "type:", typeof params.bookingId);
      
      // Check for undefined required fields
      const requiredFields = ["recipientId", "recipientType", "senderId", "senderName", "type", "title", "message"];
      const missingFields = requiredFields.filter(field => !params[field as keyof CreateNotificationParams]);
      if (missingFields.length > 0) {
        console.error("❌ MISSING REQUIRED FIELDS:", missingFields);
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }
      
      const notificationId = uuidv4();
      console.log("Generated notification ID:", notificationId);
      
      // Additional validation for enum-like fields
      if (!["provider", "client"].includes(params.recipientType)) {
        console.error("❌ Invalid recipientType:", params.recipientType);
        throw new Error(`Invalid recipientType: ${params.recipientType}. Must be 'provider' or 'client'`);
      }
      
      if (!["booking_request", "booking_accepted", "booking_declined"].includes(params.type)) {
        console.error("❌ Invalid notification type:", params.type);
        throw new Error(`Invalid notification type: ${params.type}`);
      }
      
      const createData = {
        id: notificationId,
        recipientId: params.recipientId,
        recipientType: params.recipientType,
        senderId: params.senderId,
        senderName: params.senderName,
        type: params.type,
        title: params.title,
        message: params.message,
        ...(params.bookingId && { bookingId: params.bookingId }),
        ...(params.expiresAt && { expiresAt: params.expiresAt.toISOString() }),
      };
      
      console.log("Attempting to create notification with data:", createData);
      
      // Use type assertion to work with current generated types
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (client.models.Notification.create as any)(createData);

      console.log("✅ Notification created successfully:", result);
      
      // Check if there are errors in the result
      if (result.errors && result.errors.length > 0) {
        console.error("🚨 NOTIFICATION CREATION RETURNED ERRORS:", result.errors);
        throw new Error(`Notification creation failed: ${JSON.stringify(result.errors)}`);
      }
      
      if (!result.data) {
        console.error("🚨 NOTIFICATION CREATION RETURNED NULL DATA");
        throw new Error("Notification creation returned null data");
      }
      
      console.log("=== NOTIFICATION CREATION END ===");
      return result;
    } catch (error) {
      console.error("❌ NOTIFICATION CREATION FAILED:", error);
      console.error("Error details:", {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      });
      console.log("=== NOTIFICATION CREATION ERROR END ===");
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
    console.log("Creating booking request notification:", {
      bookingId,
      providerId,
      clientId,
      clientName,
      bookingDetails
    });

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    const result = await this.createNotification({
      recipientId: providerId,
      recipientType: "provider",
      senderId: clientId,
      senderName: clientName,
      type: "booking_request",
      title: "New Booking Request",
      message: `${clientName} has requested a booking for ${bookingDetails.service} on ${bookingDetails.date} at ${bookingDetails.time} for ${bookingDetails.duration} hours.`,
      bookingId,
      expiresAt,
    });

    console.log("Notification creation result:", result);
    return result;
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
