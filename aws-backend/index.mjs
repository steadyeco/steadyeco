import { DynamoDBClient, PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";

const db = new DynamoDBClient({ region: "ap-southeast-2" });
const TABLE = "SteadyEcoData";
const API_KEY = "se_sync_2026_fnq";

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Api-Key",
  };

  // Handle CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Check API key
  const key = event.headers?.["x-api-key"] || event.headers?.["X-Api-Key"];
  if (key !== API_KEY) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  const method = event.requestContext?.http?.method;
  const path = event.requestContext?.http?.path;

  try {
    // POST /sync — save all app data
    if (method === "POST" && path === "/sync") {
      const body = JSON.parse(event.body || "{}");
      const now = new Date().toISOString();

      await db.send(new PutItemCommand({
        TableName: TABLE,
        Item: {
          pk: { S: "app_data" },
          data: { S: JSON.stringify(body) },
          updatedAt: { S: now },
        },
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, updatedAt: now }),
      };
    }

    // GET /sync — load all app data
    if (method === "GET" && path === "/sync") {
      const result = await db.send(new GetItemCommand({
        TableName: TABLE,
        Key: { pk: { S: "app_data" } },
      }));

      if (!result.Item) {
        return { statusCode: 200, headers, body: JSON.stringify({ data: null }) };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          data: JSON.parse(result.Item.data.S),
          updatedAt: result.Item.updatedAt.S,
        }),
      };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: "Not found" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Server error" }) };
  }
};
