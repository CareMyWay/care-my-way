"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

const stripePromise = loadStripe("pk_test_51RjANWP5j9L9TyllA2l8XyojeFX8tZg3G9xFm0VTmkBuV0dq8Uwj6FssOtNnOLxox4rGMlh0bUPIPrM3CbWSAmtv00ri2QAOSH");

export default function StripeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
