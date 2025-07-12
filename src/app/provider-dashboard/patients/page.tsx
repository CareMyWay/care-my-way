"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TopNav } from "@/components/provider-dashboard-ui/dashboard-topnav";

export default function PatientsPage() {
  const patients = [
    "Emma Wilson",
    "Robert Davis",
    "Lisa Martinez",
    "Sarah Johnson",
  ];

  return (
    <>
      <TopNav title="My Patients" notificationCount={2} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patientName, index) => (
          <Card
            key={index}
            className="border-gray-400 dashboard-bg-primary rounded-2xl dashboard-card !shadow-none"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt={patientName}
                  />
                  <AvatarFallback className="bg-teal-100 text-teal-800">
                    {patientName.split(" ").map((n) => n[0])}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium dashboard-text-primary">
                    {patientName}
                  </h4>
                  <p className="dashboard-text-secondary">Active Patient</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="dashboard-text-secondary">
                  Last Session: Jan 10, 2024
                </p>
                <p className="dashboard-text-secondary">
                  Next Appointment: Jan 15, 2024
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-4 dashboard-button-secondary"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
