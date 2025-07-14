"use client";

import { Button } from "@/components/provider-dashboard-ui/button";

export default function CheckoutPage() {
  const handleCheckout = async () => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Care Aide",   // get service name from DynamoDB
        amount: 35, // get total from DynamoDB
        quantity: 1,
      }),
    });

    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert("Checkout failed");
    }
  };

  return (
    <div className="p-6">
      <Button onClick={handleCheckout} className="dashboard-button-primary text-primary-white">
        Pay Now
      </Button>
    </div>
  );
}
