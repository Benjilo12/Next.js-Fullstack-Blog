// app/api/webhooks/route.js
import { clerkClient } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("❌ WEBHOOK_SECRET is missing");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  try {
    // Get headers properly
    const headerList = await headers(); // Add await
    const svix_id = headerList.get("svix-id");
    const svix_timestamp = headerList.get("svix-timestamp");
    const svix_signature = headerList.get("svix-signature");

    console.log("📨 Webhook headers:", {
      svix_id,
      svix_timestamp,
      svix_signature,
    });

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("❌ Missing Svix headers");
      return new Response("Missing Svix headers", { status: 400 });
    }

    // Get the raw body text instead of parsing as JSON first
    const body = await req.text(); // Use text() instead of json()

    console.log("📝 Raw webhook body:", body);

    // Verify webhook
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("❌ Error verifying webhook:", err.message);
      return new Response(`Error verifying webhook: ${err.message}`, {
        status: 400,
      });
    }

    // Now parse the verified event data
    const eventType = evt.type;
    const data = evt.data;

    console.log(`✅ Webhook verified: ${eventType}`);
    console.log("📊 Event data:", JSON.stringify(data, null, 2));

    // Handle events
    if (eventType === "user.created" || eventType === "user.updated") {
      const {
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username,
      } = data;

      const email = email_addresses?.[0]?.email_address || "";

      const user = await createOrUpdateUser({
        clerkId: id,
        email,
        firstName: first_name || "",
        lastName: last_name || "",
        username: username || "",
        profilePicture: image_url || "",
      });

      // Update Clerk metadata if user was created
      if (user && eventType === "user.created") {
        try {
          await clerkClient.users.updateUserMetadata(id, {
            publicMetadata: {
              userMongoId: user._id?.toString() || user.id,
              isAdmin: user.isAdmin || false,
            },
          });
          console.log("✅ Clerk metadata updated for user:", id);
        } catch (metadataError) {
          console.error("❌ Failed to update Clerk metadata:", metadataError);
        }
      }
    }

    // Handle user deletion
    if (eventType === "user.deleted") {
      await deleteUser(data.id);
      console.log("✅ User deleted:", data.id);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("❌ Unexpected error in webhook:", error);
    return new Response(`Internal server error: ${error.message}`, {
      status: 500,
    });
  }
}
