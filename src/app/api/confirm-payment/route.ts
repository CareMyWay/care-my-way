import { NextResponse } from "next/server";
import Stripe from "stripe";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// GOLIVE TODO: Implement a stripe webhook to handle payment confirmation (needed a public domain for this)
const ddbClient = new DynamoDBClient({
  region: "ca-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      throw new Error("Missing booking ID from Stripe metadata");
    }

    const updateCommand = new UpdateItemCommand({
      TableName: "Booking-lp62gakperctdporhcqw5fsfxi-NONE",
      Key: {
        id: { S: bookingId },
      },
      UpdateExpression: "SET bookingStatus = :status",
      ExpressionAttributeValues: {
        ":status": { S: "Payment Completed" },
      },
    });

    await ddbClient.send(updateCommand);

    return NextResponse.json({
      success: true,
      bookingDetails: {
        providerName: session.metadata?.providerName,
        providerTitle: session.metadata?.providerTitle,
        location: session.metadata?.providerLocation,
        date: session.metadata?.date,
        time: session.metadata?.time,
        duration: session.metadata?.duration,
        totalCost: session.amount_total / 100,
        providerRate: session.metadata?.providerRate,
      },
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
