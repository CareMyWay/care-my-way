"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import "@/app/globals.css";
import NavBar from "@/components/nav-bars/navbar";
import ProfileSummary from "@/components/provider-profile/profile-summary";
import ProfileDetails from "@/components/provider-profile/profile-details";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Provider() {
  const searchParams = useSearchParams();
  const isCancelled = searchParams.get("cancelled");
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    if (isCancelled && bookingId) {
      fetch("/api/cancel-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            console.error("Failed to cancel booking:", data.error);
          } else {
            console.log("Booking status updated to cancelled");
          }
        })
        .catch((error) => {
          console.error("Error cancelling booking:", error);
        });
      }
    }, [isCancelled, bookingId]);

  return (
    <div>
      <main>
        {/* Temp location of top navbar */}
        <NavBar />
        <div className="flex flex-col lg:flex-row justify-center gap-5 mt-10 mx-4 md:mx-10 md:mr-24 2xl:mx-30 2xl:mr-52">
          <div className="flex flex-col w-full md:flex-1/5 ml-0 md:ml-5 xl:ml-16 mr-0 md:mr-10 lg:sticky md:top-10 self-start">
            <div className="mb-5 md:mb-10">
              <Link
                href="/marketplace"
                className="flex text-h6-size text-dark-green underline-overlap hover:text-medium-green"
              >
                <ArrowLeft size={17} className="mr-1" /> Back to search page
              </Link>
            </div>
            <div className="items-center md:items-end mx-auto mb-5">
              <ProfileSummary />
            </div>
          </div>
          <div className="w-full md:flex-4/5">
            <ProfileDetails />
          </div>
        </div>
      </main>
    </div>
  );
}
