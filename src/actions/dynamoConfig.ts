import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const envRegion: string = process.env.NEXT_PUBLIC_DYNAMODB_REGION;
const envAccessKeyId: string = process.env.NEXT_PUBLIC_ACCESS_KEY_ID;
const envSecretAccessKey: string = process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY;

export const dbConn = new DynamoDBClient({region: envRegion, credentials: {
    accessKeyId: envAccessKeyId,
    secretAccessKey: envSecretAccessKey
  }});
