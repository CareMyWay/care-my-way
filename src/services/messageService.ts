import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";

const client = generateClient<Schema>();

export interface MessageData {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isModerated?: boolean;
  moderationFlags?: string[];
}

export interface SendMessageRequest {
  bookingId: string;
  recipientId: string;
  recipientName: string;
  content: string;
}

export class MessageService {
  /**
   * Validate that the current user has access to message for this booking
   */
  static async validateBookingAccess(bookingId: string, userId: string): Promise<boolean> {
    try {
      // First check if booking exists and is approved
      const { data: bookings } = await client.models.Booking.list({
        filter: { 
          id: { eq: bookingId },
          bookingStatus: { eq: "Approved" }
        }
      });

      if (bookings.length === 0) {
        return false;
      }

      // Check if user is either client or provider for this booking
      const booking = bookings[0];
      return booking.clientId === userId || booking.providerId === userId;
    } catch (error) {
      console.error("Booking validation error:", error);
      return false;
    }
  }

  /**
   * Send a message through the moderation pipeline
   */
  static async sendMessage(request: SendMessageRequest): Promise<MessageData> {
    try {
      // Get current user info
      const { getCurrentUser } = await import("aws-amplify/auth");
      const user = await getCurrentUser();
      
      // Validate booking access before sending message
      const hasAccess = await this.validateBookingAccess(request.bookingId, user.userId);
      if (!hasAccess) {
        throw new Error("You can only send messages for approved bookings you are part of");
      }

      // Client-side validation
      if (!request.content || request.content.trim().length === 0) {
        throw new Error("Message content cannot be empty");
      }

      if (request.content.length > 2000) {
        throw new Error("Message exceeds maximum length (2000 characters)");
      }

      // Check for URLs (client-side quick check)
      const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
      if (urlPattern.test(request.content)) {
        throw new Error("Links and URLs are not allowed in messages");
      }

      // Use standard createMessage mutation - moderation happens server-side via Lambda
      const result = await client.models.Message.create({
        bookingId: [request.bookingId],
        senderId: [user.userId],
        senderName: [user.username || "Unknown User"],
        recipientId: [request.recipientId],
        recipientName: [request.recipientName],
        content: [request.content],
        timestamp: [new Date().toISOString()],
        isRead: ["false"],
      });
      
      if (!result.data) {
        throw new Error("Failed to send message");
      }

      const messageData = result.data;

      return {
        id: Array.isArray(messageData.id) ? messageData.id[0] : messageData.id,
        bookingId: Array.isArray(messageData.bookingId) ? messageData.bookingId[0] : messageData.bookingId,
        senderId: Array.isArray(messageData.senderId) ? messageData.senderId[0] : messageData.senderId,
        senderName: Array.isArray(messageData.senderName) ? messageData.senderName[0] : messageData.senderName,
        recipientId: Array.isArray(messageData.recipientId) ? messageData.recipientId[0] : messageData.recipientId,
        recipientName: Array.isArray(messageData.recipientName) ? messageData.recipientName[0] : messageData.recipientName,
        content: Array.isArray(messageData.content) ? messageData.content[0] : messageData.content,
        timestamp: Array.isArray(messageData.timestamp) ? messageData.timestamp[0] : messageData.timestamp,
        isRead: Array.isArray(messageData.isRead) ? messageData.isRead[0] === "true" : messageData.isRead || false,
      };
    } catch (error: unknown) {
      console.error("Send message error:", error);
      
      // Parse GraphQL errors for user-friendly messages
      if (error && typeof error === "object" && "errors" in error) {
        const graphQLError = (error as { errors: Array<{ message?: string }> }).errors?.[0];
        if (graphQLError?.message) {
          throw new Error(graphQLError.message);
        }
      }
      
      throw error instanceof Error ? error : new Error("Failed to send message");
    }
  }

  /**
   * Get messages for a specific booking (with access validation)
   */
  static async getMessagesForBooking(bookingId: string): Promise<MessageData[]> {
    try {
      // Get current user info
      const { getCurrentUser } = await import("aws-amplify/auth");
      const user = await getCurrentUser();
      
      // Validate booking access
      const hasAccess = await this.validateBookingAccess(bookingId, user.userId);
      if (!hasAccess) {
        throw new Error("You can only view messages for approved bookings you are part of");
      }

      const result = await client.models.Message.list({
        filter: { bookingId: { eq: bookingId } },
      });

      if (!result.data) {
        return [];
      }

      // Sort messages by timestamp
      return result.data
        .map(msg => ({
          id: Array.isArray(msg.id) ? msg.id[0] : msg.id,
          bookingId: Array.isArray(msg.bookingId) ? msg.bookingId[0] : msg.bookingId,
          senderId: Array.isArray(msg.senderId) ? msg.senderId[0] : msg.senderId,
          senderName: Array.isArray(msg.senderName) ? msg.senderName[0] : msg.senderName,
          recipientId: Array.isArray(msg.recipientId) ? msg.recipientId[0] : msg.recipientId,
          recipientName: Array.isArray(msg.recipientName) ? msg.recipientName[0] : msg.recipientName,
          content: Array.isArray(msg.content) ? msg.content[0] : msg.content,
          timestamp: Array.isArray(msg.timestamp) ? msg.timestamp[0] : msg.timestamp,
          isRead: Array.isArray(msg.isRead) ? msg.isRead[0] === "true" : msg.isRead || false,
          isModerated: Array.isArray(msg.isModerated)
            ? msg.isModerated[0] === "true"
            : typeof msg.isModerated === "boolean"
              ? msg.isModerated
              : undefined,
          moderationFlags: Array.isArray(msg.moderationFlags) ? msg.moderationFlags : msg.moderationFlags,
        }))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (error) {
      console.error("Get messages error:", error);
      throw error;
    }
  }

  /**
   * Mark messages as read
   */
  static async markMessageAsRead(messageId: string): Promise<void> {
    try {
      // Skip the update for now due to schema complexity - 
      // In a real implementation, this would need to be handled at the server level
      console.log("Marking message as read:", messageId);
      // TODO: Implement server-side update for marking messages as read
    } catch (error) {
      console.error("Mark message as read error:", error);
      throw error;
    }
  }

  /**
   * Subscribe to new messages for a booking
   */
  static subscribeToMessages(
    bookingId: string, 
    onNewMessage: () => void
  ) {
    try {
      // Use the observe pattern for real-time updates
      const subscription = client.models.Message.observeQuery({
        filter: { bookingId: { eq: bookingId } },
      }).subscribe({
        next: (snapshot) => {
          // Process new messages
          const messages = snapshot.items
            .map(msg => ({
              id: Array.isArray(msg.id) ? msg.id[0] : msg.id,
              bookingId: Array.isArray(msg.bookingId) ? msg.bookingId[0] : msg.bookingId,
              senderId: Array.isArray(msg.senderId) ? msg.senderId[0] : msg.senderId,
              senderName: Array.isArray(msg.senderName) ? msg.senderName[0] : msg.senderName,
              recipientId: Array.isArray(msg.recipientId) ? msg.recipientId[0] : msg.recipientId,
              recipientName: Array.isArray(msg.recipientName) ? msg.recipientName[0] : msg.recipientName,
              content: Array.isArray(msg.content) ? msg.content[0] : msg.content,
              timestamp: Array.isArray(msg.timestamp) ? msg.timestamp[0] : msg.timestamp,
              isRead: Array.isArray(msg.isRead) ? msg.isRead[0] === "true" : msg.isRead || false,
              isModerated: Array.isArray(msg.isModerated)
                ? msg.isModerated[0] === "true"
                : typeof msg.isModerated === "boolean"
                  ? msg.isModerated
                  : undefined,
              moderationFlags: Array.isArray(msg.moderationFlags) ? msg.moderationFlags : msg.moderationFlags,
            }))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

          // Call the callback for each message
          messages.forEach(() => {
            onNewMessage();
          });
        },
        error: (error) => {
          console.error("Subscription error:", error);
        }
      });

      return {
        unsubscribe: () => {
          subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.error("Subscribe to messages error:", error);
      return {
        unsubscribe: () => {
          console.log("No subscription to unsubscribe");
        }
      };
    }
  }

  /**
   * Get unread message count for a user
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const result = await client.models.Message.list({
        filter: { recipientId: { eq: userId } },
      });

      if (!result.data) {
        return 0;
      }

      // Filter unread messages on the client side
      const unreadMessages = result.data.filter(msg => {
        const isRead = Array.isArray(msg.isRead) ? msg.isRead[0] === "true" : msg.isRead;
        return !isRead;
      });

      return unreadMessages.length;
    } catch (error) {
      console.error("Get unread count error:", error);
      return 0;
    }
  }
}
