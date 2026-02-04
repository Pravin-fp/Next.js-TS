import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION!,
});

export const ddb = DynamoDBDocumentClient.from(client);
export const TABLE_NAME = process.env.USERS_TABLE!;
