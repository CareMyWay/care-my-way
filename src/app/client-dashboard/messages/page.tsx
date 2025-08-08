"use client";

import { useState, useEffect } from "react";
import { Search, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav";
import { ChatInterface } from "@/components/messaging/ChatInterface";
import { getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";

const client = generateClient<Schema>();

interface Conversation {
  id: string;
  bookingId: string;
  providerId: string;
  providerName: string;
  providerTitle: string;
  providerAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline?: boolean;
  bookingDate: string;
  bookingTime: string;
  providerRate: string;
}

export default function ClientMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUserId(user.userId);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  // Load conversations based on approved bookings
  useEffect(() => {
    const loadConversations = async () => {
      setIsLoading(true);
      try {
        if (!currentUserId) return;

        // Fetch approved bookings for this client
        const { data: bookings } = await client.models.Booking.list({
          filter: {
            clientId: { eq: currentUserId },
            bookingStatus: { eq: "Approved" }
          }
        });

        console.log("Found approved bookings:", bookings);

        // Create conversations from bookings
        const conversationPromises = bookings.map(async (booking) => {
          // Get provider profile for additional details
          const { data: providerProfiles } = await client.models.ProviderProfile.list({
            filter: { userId: { eq: booking.providerId } },
            limit: 1
          });

          const providerProfile = providerProfiles[0];

          // Get the last message for this booking
          const { data: messages } = await client.models.Message.list({
            filter: { bookingId: { eq: booking.id } },
            limit: 1
          });

          // Count unread messages for this booking
          const { data: unreadMessages } = await client.models.Message.list({
            filter: {
              bookingId: { eq: booking.id },
              recipientId: { eq: currentUserId },
              // Note: isRead filtering may need to be handled client-side due to schema constraints
            }
          });

          // Filter unread messages client-side
          const actualUnreadMessages = unreadMessages.filter(msg => !msg.isRead);

          const lastMessage = messages[0];
          
          return {
            id: booking.id,
            bookingId: booking.id,
            providerId: booking.providerId,
            providerName: booking.providerName || "Unknown Provider",
            providerTitle: providerProfile?.profileTitle || "Healthcare Provider",
            providerAvatar: providerProfile?.profilePhoto,
            lastMessage: lastMessage?.content || "No messages yet",
            timestamp: lastMessage?.timestamp || booking.createdAt || new Date().toISOString(),
            unreadCount: actualUnreadMessages.length,
            isOnline: false, // Could be enhanced with real-time presence
            bookingDate: booking.date,
            bookingTime: booking.time,
            providerRate: booking.providerRate,
          } as Conversation;
        });

        const conversationsData = await Promise.all(conversationPromises);
        
        // Sort by most recent activity
        conversationsData.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setConversations(conversationsData);
        
        // Auto-select first conversation if available
        if (conversationsData.length > 0) {
          setSelectedConversation(conversationsData[0]);
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
        // Fallback to empty array on error
        setConversations([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentUserId) {
      loadConversations();
    }
  }, [currentUserId]);

  const filteredConversations = conversations.filter(conv =>
    conv.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.providerTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.bookingDate.includes(searchTerm) ||
    conv.bookingTime.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", { 
        hour: "numeric", 
        minute: "2-digit",
        hour12: true 
      });
    } else {
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric" 
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <TopNav title="Messages" notificationCount={totalUnreadCount} showClientTabs={true} />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading conversations...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav title="Messages" notificationCount={totalUnreadCount} showClientTabs={true} />
      
      <div className="flex h-[calc(100vh-120px)] gap-4">
        {/* Conversations List */}
        <div className="w-1/3 min-w-[350px]">
          <Card className="h-full border-gray-400 dashboard-bg-primary rounded-md !shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold dashboard-text-primary">
                  Your Providers
                </h2>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-teal-600" />
                  <span className="text-sm dashboard-text-secondary">
                    {conversations.length} conversations
                  </span>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 dashboard-input focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-140px)] overflow-y-auto">
              <div className="space-y-1">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    {conversations.length === 0 ? (
                      <div>
                        <p className="font-medium mb-2">No conversations yet</p>
                        <p className="text-sm mb-4">You&apos;ll see conversations here with providers once your bookings are approved</p>
                        <div className="flex flex-col gap-2">
                          <a 
                            href="/marketplace" 
                            className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                          >
                            Browse Providers →
                          </a>
                          <a 
                            href="/client-dashboard/to-dos" 
                            className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                          >
                            Check Booking Status →
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p>No conversations match your search</p>
                    )}
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                        selectedConversation?.id === conversation.id 
                          ? "bg-teal-50 border-l-4 border-l-teal-500" 
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={conversation.providerAvatar || "/placeholder.svg"}
                              alt={conversation.providerName}
                            />
                            <AvatarFallback className="bg-teal-100 text-teal-800">
                              {conversation.providerName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <h4 className="font-medium dashboard-text-primary truncate">
                                {conversation.providerName}
                              </h4>
                              <p className="text-xs text-teal-600 truncate">
                                {conversation.providerTitle}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {conversation.bookingDate} at {conversation.bookingTime}
                              </p>
                            </div>
                            <span className="text-xs dashboard-text-secondary flex-shrink-0">
                              {formatTime(conversation.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm dashboard-text-secondary truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {conversation.unreadCount > 0 && (
                            <div className="bg-orange-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="flex-1">
          {selectedConversation ? (
            <Card className="h-full border-gray-400 dashboard-bg-primary rounded-md !shadow-none">
              <CardContent className="p-0 h-full">
                <ChatInterface
                  bookingId={selectedConversation.bookingId}
                  recipientId={selectedConversation.providerId}
                  recipientName={selectedConversation.providerName}
                  className="h-full border-0 rounded-none"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full border-gray-400 dashboard-bg-primary rounded-md !shadow-none">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Select a provider</h3>
                  <p>Choose a provider from the list to start messaging</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
