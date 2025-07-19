<<<<<<< HEAD
<<<<<<< HEAD
=======
// app/api/create-checkout-session/route.ts
>>>>>>> f29aef9 (Fixed booking model file structure and implemented stripe hosted checkout page)
=======
>>>>>>> 0099742 (Completed booking status update)
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const body = await req.json();

<<<<<<< HEAD
<<<<<<< HEAD
    const { name, amount, quantity, bookingId, providerId, providerPhoto, providerName, providerTitle, providerLocation, providerRate, date, time, duration } = body;

    if (!name || !amount || !quantity || !bookingId || !providerId) {
=======
    const { name, amount, quantity } = body;
=======
    const { name, amount, quantity, bookingId} = body;
>>>>>>> 0099742 (Completed booking status update)

    if (!name || !amount || !quantity) {
>>>>>>> f29aef9 (Fixed booking model file structure and implemented stripe hosted checkout page)
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: name,
<<<<<<< HEAD
<<<<<<< HEAD
              images: providerPhoto ? [providerPhoto] : [],
            },
            unit_amount: Math.round(amount * 100),
=======
            },
            unit_amount: Math.round(amount * 100), // amount in cents
>>>>>>> f29aef9 (Fixed booking model file structure and implemented stripe hosted checkout page)
=======
              images: [body.imageUrl],
            },
            unit_amount: Math.round(amount * 100),
>>>>>>> 0099742 (Completed booking status update)
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
<<<<<<< HEAD
<<<<<<< HEAD
      cancel_url: `${origin}/provider/${providerId}?cancelled=true&bookingId=${bookingId}`,
      metadata: {
        bookingId,
        providerName,
        providerTitle,
        providerLocation,
        providerRate,
        date,
        time,
        duration,
      },
=======
      cancel_url: `${origin}/checkout?canceled=true`,
>>>>>>> f29aef9 (Fixed booking model file structure and implemented stripe hosted checkout page)
=======
      cancel_url: `${origin}/provider?cancelled=true&bookingId=${bookingId}`,
      metadata: {
        bookingId,
      },
>>>>>>> 0099742 (Completed booking status update)
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    if (err instanceof Stripe.errors.StripeError) 
      return  NextResponse.json({ error: err.message }, { status: 500 });
  }
    return NextResponse.json({ error: "Unknown error"}, { status: 500 });
}
