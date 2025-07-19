"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("loading");
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

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
    <div className="p-10">
      <h1 className="text-2xl font-bold">Payment Successful</h1>
      <p>Your booking is now confirmed.</p>
      <Link href="/" className="text-medium-green-500 mt-5 hover:underline">
        Go back to the homepage
      </Link>
    </div>
  );
}
