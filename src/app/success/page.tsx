"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, CheckCircle, Home } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("loading");
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const updateBookingStatus = async () => {
      if (!sessionId || authStatus !== "authenticated") return;

      try {
        const res = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();
      if (data.success) {
        setBookingDetails(data.bookingDetails);
        setStatus("success");
      } else {
        console.error("Failed to update booking status", data.error);
        setStatus("error");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      setStatus("error");
    } 
  };

    updateBookingStatus();
  }, [sessionId, authStatus]);

  if (!sessionId) {
    return <p className="p-10">No session ID found in URL.</p>;
  }

  if (status === "loading") {
    return <p className="p-10">Updating your booking status...</p>;
  }

  if (status === "error") {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold text-red-600">Oops! Something went wrong.</h1>
        <p>We were unable to update your booking status. Please contact support.</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">Your booking has been confirmed and payment processed.</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Booking Confirmation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Booking Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-medium-green" />
                  <div>
                    <p className="font-medium text-gray-900">Provider</p>
                    <p className="text-gray-600">{bookingDetails?.providerName}</p>
                    <p className="text-sm text-gray-500">{bookingDetails?.providerTitle} • {bookingDetails?.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-medium-green" />
                  <div>
                    <p className="font-medium text-gray-900">Date</p>
                    <p className="text-gray-600">{bookingDetails?.date}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-medium-green" />
                  <div>
                    <p className="font-medium text-gray-900">Time</p>
                    <p className="text-gray-600">{bookingDetails?.time}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Services</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-medium-green rounded-full"></div>
                      <span className="text-gray-600">Personal Care Assistance</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-medium-green rounded-full"></div>
                      <span className="text-gray-600">Light Housekeeping</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium text-gray-900">Total Paid</p>
                    <p className="text-2xl font-bold text-green-600">$ {Number(bookingDetails?.totalCost).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{bookingDetails?.providerRate} × {bookingDetails?.duration} hours</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Confirmation Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Important Information</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• A confirmation email has been sent to your registered email address</li>
                <li>• Wait for your provider to reach out to you for confirmation</li>
                <li>
                  • Please have your booking reference ready:{" "}
                  <span className="font-mono font-semibold">CMW-2025-0710-001</span>
                </li>
                <li>• If you need to make changes, please contact us at least 24 hours in advance</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-medium-green hover:bg-medium-green text-white"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="h-5 w-5 mr-2" />
            Return to Homepage
          </Button>
          <Button size="lg" variant="outline" onClick={() => (window.location.href = "/dashboard")}>
            <Calendar className="h-5 w-5 mr-2" />
            View My Bookings
          </Button>
        </div>

        {/* Support Information */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-2">Need help with your booking?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a href="tel:1-800-CARE-WAY" className="text-medium-green hover:text-medium-green font-medium">
              Call: PLACEHOLDER
            </a>
            <a href="mailto:support@caremyway.com" className="text-medium-green hover:text-medium-green font-medium">
              Email: support@caremyway.com
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
