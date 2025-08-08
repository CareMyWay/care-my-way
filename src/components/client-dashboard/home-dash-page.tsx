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

const client = generateClient<Schema>();

export default function HomeDashPage() {
  const todos = [
    {
      id: "1",
      type: "future_task",
      href: "client-dashboard/to-dos/complete-profile",
      taskTitle: "Complete User Profile",
      // dueDate: "Jan 20, 2025",
      // dueTime: "8:00 AM - 10:00 AM",
      completed: false,
      description:
        "You must complete your profile before gaining access to Care My Way services.",
    },
    // {
    //   id: "2",
    //   type: "future_task",
    //   href: "client-dashboard/to-dos/complete-profile",
    //   taskTitle: "Complete Booking with Provider",
    //   dueDate: "Jan 20, 2025",
    //   dueTime: "8:00 AM - 10:00 AM",
    //   completed: false,
    //   description: "Something.",
    // },
    // {
    //   id: "3",
    //   type: "future_task",
    //   href: "client-dashboard/to-dos/complete-profile",
    //   taskTitle: "Complete Booking with Provider",
    //   dueDate: "Jan 20, 2025",
    //   dueTime: "8:00 AM - 10:00 AM",
    //   description: "Provide personal care assistance for Sarah Johnson.",
    // },
    // {
    //   id: "4",
    //   type: "future_task",
    //   href: "client-dashboard/to-dos/complete-profile",
    //   taskTitle: "Complete Booking with Provider",
    //   dueDate: "Jan 20, 2025",
    //   completed: false,
    //   dueTime: "8:00 AM - 10:00 AM",
    //   description: "Provide personal care assistance for Sarah Johnson.",
    // },
  ];

  const todayAppointment = {
    providerName: "Emma Wilson",
    service: "Physical Therapy",
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
      <TopNav title="My Dashboard" notificationCount={todos.length} showClientTabs={true} />

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
            <CardContent className="pt-0 space-y-4 max-h-[400px] overflow-y-auto px-10">
              {todos.map((task) => (
                <div
                  key={task.id}
                  className="bg-[#e7f2f3] border-1 border-medium-green rounded-md p-12 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:justify-between mb-2 gap-2 md:items-stretch">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-semibold text-xl text-darkest-green underline">
                          {task.taskTitle}
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full md:w-auto justify-center md:justify-end items-center">
                      {task.taskTitle === "Complete User Profile" &&
                      profileCompleted ? (
                        <GreenButton
                          variant="route"
                          href="/client-dashboard/profile"
                        >
                          <span className="text-md text-center">
                            View Your Profile
                          </span>
                        </GreenButton>
                      ) : (
                        <GreenButton variant="route" href={task.href}>
                          <span className="text-md text-center">Start</span>
                        </GreenButton>
                      )}
                    </div>
                  </div>

                  <p className="text-xl text-darkest-green leading-relaxed mt-6 ">
                    {task.taskTitle === "Complete User Profile" &&
                    profileCompleted
                      ? "Your profile is complete. View and update your details as needed."
                      : task.description}
                  </p>
                </div>
              ))}
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
