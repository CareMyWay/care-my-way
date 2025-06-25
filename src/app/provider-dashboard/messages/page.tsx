"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/provider-dashboard-ui/card";
import { Button } from "@/components/provider-dashboard-ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/provider-dashboard-ui/avatar";
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav";

interface Message {
  id: string
  patientName: string
  patientAvatar?: string
  lastMessage: string
  timestamp: string
  unread: boolean
}

export default function MessagesPage() {
  const [messages] = useState<Message[]>([
    {
      id: "1",
      patientName: "Emma Wilson",
      patientAvatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thank you for the session today. I feel much better!",
      timestamp: "1 hour ago",
      unread: false,
    },
    {
      id: "2",
      patientName: "Sarah Johnson",
      lastMessage: "Can we reschedule tomorrow's appointment?",
      timestamp: "3 hours ago",
      unread: true,
    },
    {
      id: "3",
      patientName: "Michael Chen",
      lastMessage: "Looking forward to our first session next week.",
      timestamp: "1 day ago",
      unread: true,
    },
  ]);

  return (
    <>
      <TopNav title="Messages" notificationCount={2} />

      <Card className="border-gray-400 dashboard-bg-primary rounded-md dashboard-card !shadow-none">
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 dashboard-input focus:outline-none"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                  index === 0 ? "bg-teal-50 border-l-4 border-l-teal-500" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={message.patientAvatar || "/placeholder.svg"} alt={message.patientName} />
                    <AvatarFallback className="bg-teal-100 text-teal-800">
                      {message.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium dashboard-text-primary">{message.patientName}</h4>
                      <span className="text-xs dashboard-text-secondary">{message.timestamp}</span>
                    </div>
                    <p className="text-sm dashboard-text-secondary">{message.lastMessage}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {message.unread && <div className="w-3 h-3 bg-orange-500 rounded-full"></div>}
                    <Button size="sm" variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
