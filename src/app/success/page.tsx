"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    if (sessionId) {
      // Optionally: fetch session details from your backend here
      setMessage(`Payment successful! Session ID: ${sessionId}`);
    } else {
      setMessage("No session ID found.");
    }
  }, [sessionId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Thank you for your payment!</h1>
      <p>{message}</p>
    </div>
  );
}
