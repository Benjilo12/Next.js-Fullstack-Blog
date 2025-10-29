// app/api/webhooks/route.js
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", evt.data);

    // Narrow to specific events for type inference
    if (evt.type === "user.created") {
      console.log("userId:", evt.data.id);
      // Add your user creation logic here
    }
    if (evt.type === "user.updated") {
      console.log("user is updated:", evt.data.id);
      // Add your user update logic here
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
