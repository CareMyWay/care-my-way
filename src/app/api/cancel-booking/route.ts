import { NextResponse } from "next/server";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({
  region: "ca-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      throw new Error("Missing booking ID");
    }

    const updateCommand = new UpdateItemCommand({
      TableName: "Booking-pnrbd5j3jraz3p7qhb4mco6cwe-NONE",
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 0099742 (Completed booking status update)
