// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const body = await req.json();

    const { name, amount, quantity } = body;

    if (!name || !amount || !quantity) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: name,
            },
            unit_amount: Math.round(amount * 100), // amount in cents
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    if (err instanceof Stripe.errors.StripeError) 
      return  NextResponse.json({ error: err.message }, { status: 500 });
  }
    return NextResponse.json({ error: "Unknown error"}, { status: 500 });
}
