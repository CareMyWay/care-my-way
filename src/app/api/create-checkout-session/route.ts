import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    console.log("env vars loaded:", {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      BOOKING_TABLE_NAME: !!process.env.BOOKING_TABLE_NAME,
      NOTIFICATION_TABLE_NAME: !!process.env.NOTIFICATION_TABLE_NAME,
      REGION: !!process.env.REGION,
      SDK_ACCESS_KEY_ID: !!process.env.SDK_ACCESS_KEY_ID,
      SDK_SECRET_ACCESS_KEY: !!process.env.SDK_SECRET_ACCESS_KEY,
    });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const headersList = await headers();
    const origin = headersList.get("origin");

    const reqClone = req.clone();
    const body = await reqClone.json();

    console.log("Received checkout request body:", body);
    console.log("STRIPE_SECRET_KEY length:", process.env.STRIPE_SECRET_KEY?.length);

    const { name, amount, quantity, bookingId, providerId, providerPhoto, providerName, providerTitle, providerLocation, providerRate, date, time, duration, notificationId } = body;

    if (!name || !amount || !quantity || !bookingId || !providerId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: name,
              images: providerPhoto ? [providerPhoto] : [],
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?cancelled=true&bookingId=${bookingId}`,
      metadata: {
        bookingId,
        providerName,
        providerTitle,
        providerLocation,
        providerRate,
        date,
        time,
        duration,
        notificationId
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Error creating checkout session:", err);
    if (err instanceof Error) {
      console.error(err.stack);
    }

    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    // fallback for unknown errors
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
