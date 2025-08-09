import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const body = await req.json();

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
    if (err instanceof Stripe.errors.StripeError) 
      return  NextResponse.json({ error: err.message }, { status: 500 });
  }
    return NextResponse.json({ error: "Unknown error"}, { status: 500 });
}
