"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav";
import GreenButton from "@/components/buttons/green-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, startOfWeek, addDays, isSameDay, isSameMonth } from "date-fns";
import { Button } from "@/components/ui/button";

import { getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";

import { BookingService } from "@/services/bookingService";
import { getProviderProfileById } from "@/actions/providerProfileActions";
import { NotificationService } from "@/services/notificationService";
import { todo } from "node:test";

const client = generateClient<Schema>();

interface BookingRequest {
  id: string;
  clientId: string;
  clientName: string;
  providerId: string;
  providerName?: string;
  providerTitle?: string;
  providerRate?: string;
  providerLocation?: string;
  providerPhoto?: string;
  date: string;
  time: string;
  duration: number;
  totalCost: number;
  service: string;
  createdAt: string;
}

interface TodoItem {
  id: string;
  type: "booking_accepted" | "profile_completion" | "notification" | "booking_declined";
  taskTitle: string;
  description: string;
  completed?: boolean;
  href?: string;
  bookingRequest?: BookingRequest;
  dueDate?: string;
  dueTime?: string;
}

interface CurrentUser {
  userId: string;
  username?: string;
}

export default function HomeDashPage() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [providerServices, setProviderServices] = useState<string[]>([]);

  // const todos = [
  //   {
  //     id: "1",
  //     type: "future_task",
  //     href: "client-dashboard/to-dos/complete-profile",
  //     taskTitle: "Complete User Profile",
  //     // dueDate: "Jan 20, 2025",
  //     // dueTime: "8:00 AM - 10:00 AM",
  //     completed: false,
  //     description:
  //       "You must complete your profile before gaining access to Care My Way services.",
  //   },
  //   // {
  //   //   id: "2",
  //   //   type: "future_task",
  //   //   href: "client-dashboard/to-dos/complete-profile",
  //   //   taskTitle: "Complete Booking with Provider",
  //   //   dueDate: "Jan 20, 2025",
  //   //   dueTime: "8:00 AM - 10:00 AM",
  //   //   completed: false,
  //   //   description: "Something.",
  //   // },
  //   // {
  //   //   id: "3",
  //   //   type: "future_task",
  //   //   href: "client-dashboard/to-dos/complete-profile",
  //   //   taskTitle: "Complete Booking with Provider",
  //   //   dueDate: "Jan 20, 2025",
  //   //   dueTime: "8:00 AM - 10:00 AM",
  //   //   description: "Provide personal care assistance for Sarah Johnson.",
  //   // },
  //   // {
  //   //   id: "4",
  //   //   type: "future_task",
  //   //   href: "client-dashboard/to-dos/complete-profile",
  //   //   taskTitle: "Complete Booking with Provider",
  //   //   dueDate: "Jan 20, 2025",
  //   //   completed: false,
  //   //   dueTime: "8:00 AM - 10:00 AM",
  //   //   description: "Provide personal care assistance for Sarah Johnson.",
  //   // },
  // ];

  const getServiceFromProviderServices = (services: string[]): string => {
          if (services && services.length > 0) {
            return services[0]; // Use the first service
          }
          return "Care Services";
        };

  const todayAppointment = {
    providerName: "Emma Wilson",
    service: getServiceFromProviderServices(providerServices) || "Physical Therapy",
    time: "9:00 AM - 11:00 AM",
    date: "Jan 15, 2025",
    location: "123 Main Street, San Francisco, CA",
    notes:
      "Focus on mobility exercises and strength training. provider has been making good progress with previous sessions.",
    avatar: "/placeholder.svg?height=60&width=60",
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [profileCompleted, setProfileCompleted] = useState(false);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Example: appointments for the current week (replace with your real data)
  const appointments = [
    {
      id: "1",
      date: "2025-06-25",
      time: "9:00 AM - 10:00 AM",
      client: "Emma Wilson",
      color: "bg-blue-200",
    },
    {
      id: "2",
      date: "2025-06-27",
      time: "2:00 PM - 3:00 PM",
      client: "Carol Cooper",
      color: "bg-green-200",
    },
  ];

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

  const handleNotificationUpdate = () => {
    // Refresh the todos and data when notifications are updated
    fetchData();
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
        const clientBookings = await BookingService.getBookingsForClient(user.userId);
        
        // Fetch notifications for notification count
        const notifications = await NotificationService.getNotificationsForUser(user.userId);
        const unactionedNotifications = notifications.filter(notification => 
          ["booking_accepted", "booking_declined"].includes(notification.type) &&
          !notification.isActioned
        );
        
        console.log("Fetched notifications:", notifications);
        console.log("Unactioned notifications:", unactionedNotifications);

        // Resolve client names for all booking requests
        const requests = await Promise.all(
          clientBookings.map(async (booking) => {
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
              providerId: booking.providerId,
              providerName: booking.providerName,
              providerRate: booking.providerRate,
              providerTitle: Array.isArray(booking.providerTitle) ? booking.providerTitle.join(", ") : booking.providerTitle,
              providerLocation: Array.isArray(booking.providerLocation) ? booking.providerLocation.join(", ") : booking.providerLocation,
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

        console.log("Resolved booking requests:", requests);
  
        // // Add booking requests as todos
        // requests.forEach((request) => {
        //   todoItems.push({
        //     id: `booking-${request.id}`,
        //     type: "booking_accepted",
        //     taskTitle: `Booking Request from ${request.clientName}`,
        //     description: `Respond to booking request for ${request.service} on ${new Date(request.date).toLocaleDateString("en-US", {
        //       year: "numeric",
        //       month: "long",
        //       day: "numeric"
        //     })} at ${request.time} for ${request.duration} hours. Total cost: $${request.totalCost}`,
        //     bookingRequest: request,
        //     dueDate: "Within 24 hours",
        //     dueTime: "Response required"
        //   });
        // });
  
        // Add unactioned notifications as todos
        unactionedNotifications.forEach((notification) => {
          if (notification.type === "booking_accepted") {
            const bookingDetails = requests.find(req => req.id === notification.bookingId);

            if (bookingDetails) {
              todoItems.push({
                id: `notification-${notification.id}`,
                type: "booking_accepted",
                taskTitle: `Booking Accepted by ${notification.senderName}`,
                description: `You have an accepted a booking request from ${bookingDetails.clientName} for ${bookingDetails.service} on ${new Date(bookingDetails.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })} at ${bookingDetails.time}.`,
                bookingRequest: bookingDetails,
                dueDate: "Within 24 hours",
                dueTime: "Payment required",
              });
            }
          } else if (notification.type === "booking_declined") {
            const bookingDetails = requests.find(req => req.id === notification.bookingId);

            if (bookingDetails) {
              todoItems.push({
                id: `notification-${notification.id}`,
                type: "booking_declined",
                taskTitle: `Booking Declined by ${notification.senderName}`,
                description: `Your booking request for ${bookingDetails.service} on ${new Date(bookingDetails.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })} at ${bookingDetails.time} was declined.`,
                bookingRequest: bookingDetails,
                dueDate: "No further action",
                dueTime: "—"
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

    const handleCheckout = async (todo: TodoItem) => {
      if (!todo.bookingRequest) {
        alert("Missing booking details for checkout");
        return;
      }

      const booking = todo.bookingRequest;

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Care Aide with ${booking.providerName} on ${booking.date}, ${booking.time}`,
          amount: booking.totalCost,
          quantity: 1,
          bookingId: booking.id,
          providerId: booking.providerId, // if you have photo URL, else empty string
          providerName: booking.providerName,
          providerTitle: booking.providerTitle || "Provider Title",
          providerPhoto: booking.providerPhoto || "",
          providerLocation: booking.providerLocation || "Provider Location",
          providerRate: Number(booking.providerRate),
          date: booking.date,
          time: booking.time,
          duration: booking.duration,
          notificationId: todo.id,
        }),
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed");
      }
    };

    async function handleCloseRejected(todo: TodoItem) {
      if (!todo.bookingRequest) {
        console.warn("No booking request associated with this todo");
        return;
      }

      try {
        // Update notification as actioned (assuming you have notificationId stored or can find it)
        await NotificationService.updateNotification(todo.id.replace("notification-", ""), {
          isActioned: true,
        });

        // Optionally update local state to remove or update this todo
        setTodos((prevTodos) =>
          prevTodos.map((t) =>
            t.id === todo.id ? { ...t, isActioned: true } : t
          )
        );

        // Optionally show a success message or refresh data
      } catch (error) {
        console.error("Error closing declined booking:", error);
      }
    }

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const user = await getCurrentUser();
        const userId = user?.userId;
        if (!userId) return;

        const { data: profiles } = await client.models.ClientProfile.list({
          filter: {
            profileOwner: { eq: userId },
          },
        });

        if (profiles.length > 0) {
          setProfileCompleted(true);
          console.log("Client profile found:", profiles[0]);
        } else {
          console.log("No profile found for user");
        }
      } catch (err) {
        console.error("Error checking profile:", err);
      }
    };

    checkProfileCompletion();
  }, []);

  return (
    <>
      <TopNav title="My Dashboard" notificationCount={todos.length} />

      <div className="space-y-6">
        {/* To Do List*/}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <Card className="border-1 drop-shadow-sm border-medium-green  rounded-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold dashboard-text-primary">
                To-Do Items
              </CardTitle>
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
                    <div className="flex md:flex-col md:justify-between md:items-center mb-3 gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-white text-teal-700">
                            {todo.type === "booking_accepted" ? "📅" : "🔔"}
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

                    {/* Description */}
                    <p className="text-sm text-[var(--color-darkest-green)] leading-relaxed">
                      {todo.description}
                    </p>

                    {todo.type === "booking_accepted" && todo.bookingRequest && (
                        <div className="flex flex-col sm:flex-row gap-2">
                            <GreenButton
                            variant="action"
                            onClick={() => handleCheckout(todo)}
                            aria-label="Pay"
                            className="rounded-none flex-1 sm:flex-none hover:cursor-pointer"
                          >
                          <span className="text-xs">Pay</span>
                          </GreenButton>
                        </div>
                      )}

                      {todo.type === "booking_declined" && todo.bookingRequest && (
                        <div className="flex flex-col sm:flex-row gap-2">
                            <GreenButton
                            variant="action"
                            onClick={() => {
                              handleCloseRejected(todo);
                              handleNotificationUpdate();
                            }}
                            aria-label="Pay"
                            className="rounded-none flex-1 sm:flex-none hover:cursor-pointer"
                          >
                          <span className="text-xs">Close Booking</span>
                          </GreenButton>
                        </div>
                      )}
                  </div>
                </div>
                ))            
              )}

              
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="border-1 drop-shadow-sm border-medium-green rounded-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold dashboard-text-primary">
                Today&#39;s Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="border border-medium-green p-4 rounded-md">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={todayAppointment.avatar || "/placeholder.svg"}
                      alt={todayAppointment.providerName}
                    />
                    <AvatarFallback className="bg-teal-100 text-teal-800">
                      {todayAppointment.providerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg dashboard-text-secondary">
                        Provider:
                      </span>
                      <span className="text-lg font-medium dashboard-text-primary">
                        {todayAppointment.providerName}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold dashboard-text-primary mb-2">
                  {todayAppointment.service}
                </h3>
                <p className="text-md dashboard-text-primary mb-3 leading-relaxed">
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
        {/* Weekly Schedule */}
        <Card className="border-1 drop-shadow-sm border-medium-green  rounded-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-darkest-green">
                Weekly Schedule
              </CardTitle>
              <div className="text-md dashboard-text-secondary border border-medium-green px-3 py-1">
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
      </div>
    </>
  );
}
