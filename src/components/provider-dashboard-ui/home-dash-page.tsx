"use client";

import { useState, useEffect } from "react";
import { Clock, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/./components/ui/card";
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav";
import GreenButton from "@/components/buttons/green-button";
import OrangeButton from "@/components/buttons/orange-button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { format, startOfWeek, addDays, isSameDay, isSameMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";
import { BookingService } from "@/services/bookingService";
import NotificationModal from "@/components/ui/notification-modal";
import { getProviderProfileById } from "@/actions/providerProfileActions";
import { NotificationService } from "@/services/notificationService";

const client = generateClient<Schema>();

interface BookingRequest {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  totalCost: number;
  service: string;
  createdAt: string;
}

interface TodoItem {
  id: string;
  type: "booking_request" | "profile_completion" | "notification";
  taskTitle: string;
  description: string;
  completed?: boolean;
  href?: string;
  bookingRequest?: BookingRequest;
  dueDate?: string;
  dueTime?: string;
  notificationId?: string;
}

interface CurrentUser {
  userId: string;
  username?: string;
}

export default function HomeDashPage() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [providerServices, setProviderServices] = useState<string[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [profileCompleted, setProfileCompleted] = useState(false);

  // Helper function to check if a string looks like a client ID (UUID format)
  const isClientId = (str: string): boolean => {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(str);
  };

  // Helper function to get client name from their profile
  const getClientName = async (clientId: string, storedName: string): Promise<string> => {
    console.log(`Getting client name for clientId: ${clientId}, storedName: ${storedName}`);
    
    // If stored name looks like a proper name (not a UUID), use it
    if (!isClientId(storedName) && storedName && storedName !== "Unknown Client" && storedName.trim().length > 0) {
      console.log("Using stored name:", storedName);
      return storedName;
    }

    // Otherwise, fetch the client's profile to get their full name
    console.log("Fetching client profile for userId:", clientId);
    try {
      const { data: clientProfiles } = await client.models.ClientProfile.list({
        filter: { userId: { eq: clientId } },
      });
      
      console.log("Found client profiles:", clientProfiles);
      
      if (clientProfiles && clientProfiles.length > 0) {
        const clientProfile = clientProfiles[0];
        const firstName = clientProfile.firstName || "";
        const lastName = clientProfile.lastName || "";
        console.log("Client profile details:", { firstName, lastName });
        
        if (firstName || lastName) {
          const fullName = `${firstName} ${lastName}`.trim();
          console.log("Resolved full name:", fullName);
          return fullName;
        }
      } else {
        console.log("No client profile found for userId:", clientId);
      }
    } catch (error) {
      console.error("Error fetching client profile:", error);
    }

    // Fallback to "Unknown Client" 
    console.log("Using fallback name");
    return "Unknown Client";
  };

  // Fetch current user and their booking requests
  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      // Get provider profile to fetch their services and check completion
      const providerProfile = await getProviderProfileById(user.userId);
      if (providerProfile?.servicesOffered) {
        setProviderServices(providerProfile.servicesOffered);
      }
      
      // Check if provider profile is complete
      const isProviderProfileComplete = providerProfile?.isProfileComplete || false;
      setProfileCompleted(isProviderProfileComplete);
      
      // Fetch pending bookings for this provider
      const pendingBookings = await BookingService.getPendingBookingsForProvider(user.userId);
      
      // Fetch notifications for notification count
      const notifications = await NotificationService.getNotificationsForUser(user.userId);
      const unactionedNotifications = notifications.filter(notification => 
        notification.type === "booking_request" && !notification.isActioned
      );
      
      console.log("Fetched notifications:", notifications);
      console.log("Unactioned notifications:", unactionedNotifications);
      
      // Resolve client names for all booking requests
      const requests = await Promise.all(
        pendingBookings.map(async (booking) => {
          console.log("Processing booking with stored clientName:", booking.clientName);
          const resolvedClientName = await getClientName(
            booking.clientId,
            Array.isArray(booking.clientName) ? booking.clientName.join(" ") : booking.clientName
          );
          console.log("Resolved clientName:", resolvedClientName);
          
          return {
            id: booking.id,
            clientId: booking.clientId,
            clientName: resolvedClientName,
            date: booking.date,
            time: booking.time,
            duration: booking.duration,
            totalCost: booking.totalCost,
            service: getServiceFromProviderServices(providerProfile?.servicesOffered || []) || "Care Services",
            createdAt: booking.createdAt,
          };
        })
      );
      
      // Create todos from booking requests and notifications
      const todoItems: TodoItem[] = [];

      // Add booking requests as todos
      requests.forEach((request) => {
        const relatedNotification = unactionedNotifications.find(
          (notification) => notification.bookingId === request.id
        );

        todoItems.push({
          id: `booking-${request.id}`,
          type: "booking_request",
          taskTitle: `Booking Request from ${request.clientName}`,
          description: `Respond to booking request for ${request.service} on ${new Date(request.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })} at ${request.time} for ${request.duration} hours. Total cost: $${request.totalCost}`,
          notificationId: relatedNotification?.id,
          bookingRequest: request,
          dueDate: "Within 24 hours",
          dueTime: "Response required"
        });
      });

      // Add unactioned notifications as todos
      unactionedNotifications.forEach((notification) => {
        if (notification.type === "booking_request") {
          // Skip if we already added this as a booking request todo
          const existingBookingTodo = todoItems.find(todo => 
            todo.type === "booking_request" && 
            todo.bookingRequest?.id === notification.bookingId
          );
          if (!existingBookingTodo) {
            todoItems.push({
              id: `notification-${notification.id}`,
              type: "notification",
              taskTitle: notification.title,
              description: notification.message,
              dueDate: "Within 24 hours",
              dueTime: "Response required"
            });
          }
        }
      });

      setTodos(todoItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceFromProviderServices = (services: string[]): string => {
    if (services && services.length > 0) {
      return services[0]; // Use the first service
    }
    return "Care Services";
  };

  const handleNotificationClick = () => {
    setIsNotificationModalOpen(true);
  };

  const handleNotificationUpdate = () => {
    // Refresh the todos and data when notifications are updated
    fetchData();
  };

  const handleAcceptAppointment = async (requestId: string) => {
    if (!currentUser) return;

    const todo = todos.find(todo =>
      todo.type === "booking_request" && todo.bookingRequest?.id === requestId
    );
    
    try {
      await BookingService.acceptBooking(
        requestId,
        currentUser.userId,
        currentUser.username || "Provider",
        todo.notificationId
      );
      
      // Remove from todos
      setTodos(prev => prev.filter(todo => 
        !(todo.type === "booking_request" && todo.bookingRequest?.id === requestId)
      ));
      
      // Show success message or toast here
      console.log("Booking accepted successfully!");
    } catch (error) {
      console.error("Error accepting booking:", error);
      // Show error message here
    }
  };

  const handleDeclineAppointment = async (requestId: string) => {
    if (!currentUser) return;

    const todo = todos.find(todo =>
      todo.type === "booking_request" && todo.bookingRequest?.id === requestId
    );
    
    try {
      await BookingService.declineBooking(
        requestId,
        currentUser.userId,
        currentUser.username || "Provider",
        todo.notificationId
      );
      
      // Remove from todos
      setTodos(prev => prev.filter(todo => 
        !(todo.type === "booking_request" && todo.bookingRequest?.id === requestId)
      ));
      
      // Show success message or toast here
      console.log("Booking declined successfully!");
    } catch (error) {
      console.error("Error declining booking:", error);
      // Show error message here
    }
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Example appointments - you can replace this with real data
  const appointments = [
    {
      id: "1",
      date: "2025-08-05",
      time: "9:00 AM - 10:00 AM",
      client: "Emma Wilson",
      color: "bg-blue-200",
    },
    {
      id: "2",
      date: "2025-08-07",
      time: "2:00 PM - 3:00 PM",
      client: "Carol Cooper",
      color: "bg-green-200",
    },
  ];

  // Example today's appointment - make service dynamic
  const todayAppointment = {
    patientName: "Emma Wilson",
    service: getServiceFromProviderServices(providerServices) || "Physical Therapy",
    time: "9:00 AM - 11:00 AM",
    date: "Aug 3, 2025",
    location: "123 Main Street, San Francisco, CA",
    notes:
      "Focus on mobility exercises and strength training. Patient has been making good progress with previous sessions.",
    avatar: "/placeholder.svg?height=60&width=60",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <TopNav 
        title="My Dashboard" 
        notificationCount={todos.length} 
        onNotificationClick={handleNotificationClick}
      />

      <div className="space-y-6">
        {/* Weekly Schedule */}
        <Card className="border border-gray-200 bg-white rounded-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold dashboard-text-primary">
                Weekly Schedule
              </CardTitle>
              <div className="text-sm dashboard-text-secondary border border-gray-300 px-3 py-1">
                {format(weekDays[0], "MMM d")} -{" "}
                {format(weekDays[6], "MMM d, yyyy")}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(addDays(currentDate, -7))}
                  aria-label="Previous Week"
                >
                  <span>&lt;</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(addDays(currentDate, 7))}
                  aria-label="Next Week"
                >
                  <span>&gt;</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div key={day.toISOString()} className="text-center">
                  <div className="text-xs dashboard-text-secondary mb-1">
                    {format(day, "EEE")}
                  </div>
                  <div
                    className={`text-lg font-semibold dashboard-text-primary mb-2 ${
                      isSameDay(day, new Date()) ? "text-green-700" : ""
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1 min-h-[100px]">
                    {appointments
                      .filter(
                        (apt) =>
                          isSameDay(new Date(apt.date), day) &&
                          isSameMonth(new Date(apt.date), currentDate)
                      )
                      .map((apt) => (
                        <div
                          key={apt.id}
                          className={`${apt.color} p-2 text-xs rounded`}
                        >
                          <div className="font-medium text-gray-800">
                            {apt.time}
                          </div>
                          <div className="text-gray-700">{apt.client}</div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* To-Do Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* To-Do Items */}
          <Card className="border-1 drop-shadow-sm border-gray-200 bg-white rounded-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold dashboard-text-primary">
                To-Do Items
              </CardTitle>
              {todos.length > 0 && (
                <p className="text-sm text-amber-600 mt-2">
                  ⏰ You have {todos.length} item{todos.length > 1 ? "s" : ""} requiring your attention
                </p>
              )}
            </CardHeader>
            <CardContent className="pt-0 space-y-4 max-h-[500px] overflow-y-auto">
              {todos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No pending to-do items</p>
                  <p className="text-sm">You&apos;re all caught up!</p>
                </div>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="bg-[var(--color-lightest-green,#e6f4f1)] border-1 border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between mb-3 gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-white text-teal-700">
                            {todo.type === "booking_request" ? "📅" : "🔔"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-[var(--color-darkest-green)] underline">
                            {todo.taskTitle}
                          </div>
                          {todo.dueDate && (
                            <div className="text-sm text-amber-600">
                              ⏰ {todo.dueDate}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons for booking requests */}
                      {todo.type === "booking_request" && todo.bookingRequest && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <GreenButton
                            variant="action"
                            onClick={() => handleAcceptAppointment(todo.bookingRequest!.id)}
                            aria-label="Accept"
                            className="rounded-none flex-1 sm:flex-none"
                          >
                            <span className="text-xs">✓ Accept</span>
                          </GreenButton>
                          <OrangeButton
                            variant="action"
                            onClick={() => handleDeclineAppointment(todo.bookingRequest!.id)}
                            aria-label="Decline"
                            className="rounded-none flex-1 sm:flex-none"
                          >
                            <span className="text-xs">✗ Decline</span>
                          </OrangeButton>
                        </div>
                      )}

                      {/* Start button for profile completion */}
                      {todo.type === "profile_completion" && (
                        <div className="flex w-full md:w-auto justify-center md:justify-end items-center">
                          <GreenButton
                            variant="route"
                            href={todo.href || "/provider-dashboard/profile"}
                          >
                            <span className="text-md text-center">
                              {profileCompleted ? "View Your Profile" : "Start"}
                            </span>
                          </GreenButton>
                        </div>
                      )}

                      {/* View button for notifications */}
                      {todo.type === "notification" && (
                        <div className="flex w-full md:w-auto justify-center md:justify-end items-center">
                          <GreenButton
                            variant="action"
                            onClick={handleNotificationClick}
                            className="rounded-none"
                          >
                            <span className="text-xs">View Details</span>
                          </GreenButton>
                        </div>
                      )}
                    </div>

                    {/* Booking Details for booking requests */}
                    {todo.type === "booking_request" && todo.bookingRequest && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <span className="ml-2 font-medium">
                              {new Date(todo.bookingRequest.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Time:</span>
                            <span className="ml-2 font-medium">
                              {todo.bookingRequest.time}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <span className="ml-2 font-medium">
                              {todo.bookingRequest.duration} hours
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Service:</span>
                            <span className="ml-2 font-medium">
                              {todo.bookingRequest.service}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500">Total Cost:</span>
                            <span className="ml-2 font-medium text-green-600">
                              ${todo.bookingRequest.totalCost}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-[var(--color-darkest-green)] leading-relaxed">
                      {todo.description}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="border border-gray-200 bg-white rounded-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold dashboard-text-primary">
                Today&#39;s Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="border border-gray-200 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={todayAppointment.avatar || "/placeholder.svg"}
                      alt={todayAppointment.patientName}
                    />
                    <AvatarFallback className="bg-teal-100 text-teal-800">
                      {todayAppointment.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm dashboard-text-secondary">
                        Patient:
                      </span>
                      <span className="font-medium dashboard-text-primary">
                        {todayAppointment.patientName}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold dashboard-text-primary mb-2">
                  {todayAppointment.service}
                </h3>
                <p className="text-sm dashboard-text-primary mb-3 leading-relaxed">
                  {todayAppointment.notes}
                </p>

                <div className="space-y-2 text-sm dashboard-text-primary">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {todayAppointment.date} @ {todayAppointment.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{todayAppointment.location}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onOpenChange={setIsNotificationModalOpen}
        onNotificationUpdate={handleNotificationUpdate}
      />
    </>
  );
}
