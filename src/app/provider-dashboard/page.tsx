// "use client";

// import { useState } from "react";
// import { CheckCircle, XCircle, Clock, MapPin } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/provider-dashboard-ui/card";
// import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav";
// import GreenButton from "@/components/buttons/green-button";
// import OrangeButton from "@/components/buttons/orange-button";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/provider-dashboard-ui/avatar";
// //import AppointmentsPage from "./appointments/page";
// import { format, startOfWeek, addDays, isSameDay, isSameMonth } from "date-fns";
// import { Button } from "@/components/provider-dashboard-ui/button";

// export default function DashboardOverview() {
//   const [notifications, setNotifications] = useState([
//     {
//       id: "1",
//       type: "appointment_request",
//       patientName: "Sarah Johnson",
//       service: "Physical Therapy",
//       date: "2024-01-15",
//       time: "10:00 AM",
//       message:
//         "Requests Personal Care Assistance on March 1, 2025 @ 8:00 AM - 10:00 AM",
//       timestamp: "2 hours ago",
//     },
//     {
//       id: "2",
//       type: "appointment_request",
//       patientName: "Michael Chen",
//       service: "Occupational Therapy",
//       date: "2024-01-16",
//       time: "2:00 PM",
//       message: "Recurring appointment request for weekly OT sessions",
//       timestamp: "4 hours ago",
//     },
//   ]);

//   const todayAppointment = {
//     patientName: "Emma Wilson",
//     service: "Physical Therapy",
//     time: "9:00 AM - 11:00 AM",
//     date: "Jan 15, 2025",
//     location: "123 Main Street, San Francisco, CA",
//     notes:
//       "Focus on mobility exercises and strength training. Patient has been making good progress with previous sessions.",
//     avatar: "/placeholder.svg?height=60&width=60",
//   };

//   const handleAcceptAppointment = (notificationId: string) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
//   };

//   const handleDeclineAppointment = (notificationId: string) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
//   };

//   const [currentDate, setCurrentDate] = useState(new Date());
//   const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
//   const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

//   // Example: appointments for the current week (replace with your real data)
//   const appointments = [
//     {
//       id: "1",
//       date: "2025-06-25",
//       time: "9:00 AM - 10:00 AM",
//       client: "Emma Wilson",
//       color: "bg-blue-200",
//     },
//     {
//       id: "2",
//       date: "2025-06-27",
//       time: "2:00 PM - 3:00 PM",
//       client: "Carol Cooper",
//       color: "bg-green-200",
//     },
//   ];

//   return (
//     <>
//       <TopNav title="My Dashboard" notificationCount={notifications.length} />

//       <div className="space-y-6">
//         {/* Weekly Schedule */}
//         <Card className="border border-gray-200 bg-white rounded-lg">
//           <CardHeader className="pb-4">
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-lg font-semibold dashboard-text-primary">
//                 Weekly Schedule
//               </CardTitle>
//               <div className="text-sm dashboard-text-secondary border border-gray-300 px-3 py-1">
//                 {format(weekDays[0], "MMM d")} -{" "}
//                 {format(weekDays[6], "MMM d, yyyy")}
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setCurrentDate(addDays(currentDate, -7))}
//                   aria-label="Previous Week"
//                 >
//                   <span>&lt;</span>
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setCurrentDate(addDays(currentDate, 7))}
//                   aria-label="Next Week"
//                 >
//                   <span>&gt;</span>
//                 </Button>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="pt-0">
//             <div className="grid grid-cols-7 gap-2">
//               {weekDays.map((day) => (
//                 <div key={day.toISOString()} className="text-center">
//                   <div className="text-xs dashboard-text-secondary mb-1">
//                     {format(day, "EEE")}
//                   </div>
//                   <div
//                     className={`text-lg font-semibold dashboard-text-primary mb-2 ${
//                       isSameDay(day, new Date()) ? "text-green-700" : ""
//                     }`}
//                   >
//                     {format(day, "d")}
//                   </div>
//                   <div className="space-y-1 min-h-[100px]">
//                     {appointments
//                       .filter(
//                         (apt) =>
//                           isSameDay(new Date(apt.date), day) &&
//                           isSameMonth(new Date(apt.date), currentDate)
//                       )
//                       .map((apt) => (
//                         <div
//                           key={apt.id}
//                           className={`${apt.color} p-2 text-xs rounded`}
//                         >
//                           <div className="font-medium text-gray-800">
//                             {apt.time}
//                           </div>
//                           <div className="text-gray-700">{apt.client}</div>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Appoitment requests */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Notifications */}
//           <Card className="border border-gray-200 bg-white rounded-lg">
//             <CardHeader className="pb-4">
//               <CardTitle className="text-lg font-semibold dashboard-text-primary">
//                 Appointment Requests
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-0 space-y-4">
//               {notifications.map((notification) => (
//                 <div
//                   key={notification.id}
//                   className="bg-[var(--color-lightest-green,#e6f4f1)] p-4"
//                 >
//                   <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 gap-2">
//                     <div className="flex items-center gap-3">
//                       <Avatar className="h-8 w-8">
//                         <AvatarFallback className="bg-white text-teal-700">
//                           {notification.patientName
//                             .split(" ")
//                             .map((n) => n[0])
//                             .join("")}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         {/* <div className="font-medium text-[var(--color-darkest-green)]">Booking Request</div> */}
//                         <div className="font-medium text-[var(--color-darkest-green)]">
//                           {notification.patientName}
//                         </div>
//                       </div>
//                     </div>
//                     {/* Buttons: stack vertically on mobile */}
//                     <div className="flex flex-col w-full md:w-auto md:flex-row gap-2 md:gap-2">
//                       <GreenButton
//                         // size="sm"
//                         variant="action"
//                         // label="Accept"
//                         className="bg-[var(--color-dark-green)] hover:bg-[var(--color-darkest-green)] text-white h-8 px-3 flex items-center justify-center gap-1 text-xs font-medium w-full md:w-auto"
//                         onClick={() => handleAcceptAppointment(notification.id)}
//                         aria-label="Accept"
//                       >
//                         <CheckCircle className="h-3 w-3" />
//                         <span className="text-xs text-center">Accept</span>
//                       </GreenButton>
//                       <OrangeButton
//                         variant="action"
//                         className="bg-[var(--color-primary-orange)] hover:bg-[var(--color-hover-orange)] text-white h-8 px-3 flex items-center justify-center gap-1 text-xs font-medium w-full md:w-auto"
//                         onClick={() =>
//                           handleDeclineAppointment(notification.id)
//                         }
//                         aria-label="Decline"
//                       >
//                         <XCircle className="h-3 w-3" />
//                         <span className="text-xs text-center">Decline</span>
//                       </OrangeButton>
//                     </div>
//                   </div>
//                   <p className="text-sm text-[var(--color-darkest-green)]">
//                     {notification.message}
//                   </p>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>

//           {/* Today's Schedule */}
//           <Card className="border border-gray-200 bg-white rounded-lg">
//             <CardHeader className="pb-4">
//               <CardTitle className="text-lg font-semibold dashboard-text-primary">
//                 Today&#39;s Schedule
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-0 space-y-4">
//               <div className="border border-gray-200 p-4">
//                 <div className="flex items-start gap-3 mb-3">
//                   <Avatar className="h-12 w-12">
//                     <AvatarImage
//                       src={todayAppointment.avatar || "/placeholder.svg"}
//                       alt={todayAppointment.patientName}
//                     />
//                     <AvatarFallback className="bg-teal-100 text-teal-800">
//                       {todayAppointment.patientName
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="text-sm dashboard-text-secondary">
//                         Patient:
//                       </span>
//                       <span className="font-medium dashboard-text-primary">
//                         {todayAppointment.patientName}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <h3 className="font-semibold dashboard-text-primary mb-2">
//                   {todayAppointment.service}
//                 </h3>
//                 <p className="text-sm dashboard-text-primary mb-3 leading-relaxed">
//                   {todayAppointment.notes}
//                 </p>

//                 <div className="space-y-2 text-sm dashboard-text-primary">
//                   <div className="flex items-center gap-2">
//                     <Clock className="h-4 w-4" />
//                     <span>
//                       {todayAppointment.date} @ {todayAppointment.time}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <MapPin className="h-4 w-4" />
//                     <span>{todayAppointment.location}</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </>
//   );
// }
import React from "react";
import ProviderDashboardComponent from "@/components/dashboards/provider-dashboard";
// import HomeDashPage from "@/components/provider-dash/home-dash-page";
// import HomeDashPage from "@/components/provider-dashboard-ui/home-dash-page";
export default function ProviderDashboard() {
  return (
    <div>
      <ProviderDashboardComponent />
    </div>
  );
}
