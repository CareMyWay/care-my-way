import { NextResponse } from "next/server";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.SDK_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SDK_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      throw new Error("Missing booking ID");
    }

    const updateCommand = new UpdateItemCommand({
      TableName: process.env.BOOKING_TABLE_NAME!,
      Key: {
        id: { S: bookingId },
      },
      UpdateExpression: "SET bookingStatus = :status",
      ExpressionAttributeValues: {
        ":status": { S: "Cancelled" },
      },
    });

    await ddbClient.send(updateCommand);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
