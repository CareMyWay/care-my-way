"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageService, type MessageData } from "@/services/messageService";
import { getCurrentUser } from "aws-amplify/auth";

interface ChatInterfaceProps {
  bookingId: string;
  recipientId: string;
  recipientName: string;
  className?: string;
}

interface CurrentUser {
  userId: string;
  username: string;
}

export function ChatInterface({ 
  bookingId, 
  recipientId, 
  recipientName, 
  className = "" 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser({
          userId: user.userId,
          username: user.username || "Unknown User",
        });
      } catch (err) {
        console.error("Error loading user:", err);
        setError("Failed to load user information");
      }
    };
    loadUser();
  }, []);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messageList = await MessageService.getMessagesForBooking(bookingId);
        setMessages(messageList);
      } catch (err) {
        console.error("Error loading messages:", err);
        setError("Failed to load messages");
      }
    };

    if (bookingId) {
      loadMessages();
    }
  }, [bookingId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set up real-time subscription (conceptual - actual implementation may vary)
  useEffect(() => {
    if (!bookingId) return;

    interface MessageSubscription {
      unsubscribe: () => void;
    }


    const subscription: MessageSubscription = MessageService.subscribeToMessages(
      bookingId,
      () => {
        // Reload all messages when a new message arrives
        MessageService.getMessagesForBooking(bookingId)
          .then((messageList) => setMessages(messageList))
          .catch((err) => {
            console.error("Error loading messages:", err);
            setError("Failed to load messages");
          });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [bookingId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    setIsLoading(true);
    setError(null);

    try {
      const sentMessage = await MessageService.sendMessage({
        bookingId,
        recipientId,
        recipientName,
        content: newMessage.trim(),
      });

      setMessages(prev => [...prev, sentMessage]);
      setNewMessage("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      console.error("Send message error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentUser) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-96 bg-white border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <h3 className="font-semibold text-gray-800">
          Chat with {recipientName}
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === currentUser.userId;
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwnMessage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {isOwnMessage ? "You" : message.senderName}
                </div>
                <div className="text-sm">{message.content}</div>
                <div className="text-xs mt-1 opacity-75">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
                {message.moderationFlags && message.moderationFlags.length > 0 && (
                  <div className="text-xs mt-1 italic opacity-60">
                    (Content filtered)
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <div className="text-sm text-red-600">{error}</div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (No links or attachments allowed)"
            className="flex-1 px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            disabled={isLoading}
            maxLength={2000}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {newMessage.length}/2000 characters
        </div>
      </div>
    </div>
  );
}
