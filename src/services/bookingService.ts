"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "amplify/data/resource";
import { NotificationService } from "./notificationService";

const client = generateClient<Schema>();

export class BookingService {
  // Accept a booking request
  static async acceptBooking(
    bookingId: string,
    providerId: string,
    providerName: string
  ) {
    try {
      // First get the booking details
      const booking = await client.models.Booking.get({ id: bookingId });
      
      if (!booking.data) {
        throw new Error("Booking not found");
      }

      // Update booking status
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client.models.Booking.update as any)({
        id: bookingId,
        bookingStatus: ["Accepted"],
        providerResponse: ["accepted"],
        responseAt: [new Date().toISOString()],
      });

      // Create notification for client
      await NotificationService.createBookingAcceptedNotification(
        bookingId,
        booking.data.clientId,
        providerId,
        providerName,
        {
          date: booking.data.date,
          time: booking.data.time,
          service: "Care Services", // You can make this dynamic based on provider profile
        }
      );

      return { success: true };
    } catch (error) {
      console.error("Error accepting booking:", error);
      throw error;
    }
  }

  // Decline a booking request
  static async declineBooking(
    bookingId: string,
    providerId: string,
    providerName: string
  ) {
    try {
      // First get the booking details
      const booking = await client.models.Booking.get({ id: bookingId });
      
      if (!booking.data) {
        throw new Error("Booking not found");
      }

      // Update booking status
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client.models.Booking.update as any)({
        id: bookingId,
        bookingStatus: ["Declined"],
        providerResponse: ["declined"],
        responseAt: [new Date().toISOString()],
      });

      // Create notification for client
      await NotificationService.createBookingDeclinedNotification(
        bookingId,
        booking.data.clientId,
        providerId,
        providerName,
        {
          date: booking.data.date,
          time: booking.data.time,
          service: "Care Services", // You can make this dynamic based on provider profile
        }
      );

      return { success: true };
    } catch (error) {
      console.error("Error declining booking:", error);
      throw error;
    }
  }

  // Get pending bookings for a provider
  static async getPendingBookingsForProvider(providerId: string) {
    try {
      const result = await client.models.Booking.list({
        filter: {
          providerId: { eq: providerId },
          bookingStatus: { eq: "Pending" },
        },
      });

      return result.data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error("Error fetching pending bookings:", error);
      return [];
    }
  }

  // Get bookings for a client
  static async getBookingsForClient(clientId: string) {
    try {
      const result = await client.models.Booking.list({
        filter: { clientId: { eq: clientId } },
      });

      return result.data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error("Error fetching client bookings:", error);
      return [];
    }
  }
}
