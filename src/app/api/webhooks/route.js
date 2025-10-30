// app/api/webhooks/route.js
import { clerkClient } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { headers } from "next/headers"; // ✅ no renaming here
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "❌ Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // ✅ headers() must be called inside POST
  const headerList = headers();

  const svix_id = headerList.get("svix-id");
  const svix_timestamp = headerList.get("svix-timestamp");
  const svix_signature = headerList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("❌ Missing Svix headers", { status: 400 });
  }

  // ✅ Parse the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // ✅ Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  // ✅ Extract event info
  const eventType = evt.type;
  const data = evt.data;

  console.log(`✅ Received Clerk webhook: ${eventType}`);
  console.log("Payload:", data);

  try {
    // Handle user.created / user.updated
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
        firstName: first_name,
        lastName: last_name,
        username,
        profilePicture: image_url,
      });

      if (user && eventType === "user.created") {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userMongoId: user._id,
            isAdmin: user.isAdmin,
          },
        });
      }
    }

    // Handle user.deleted
    if (eventType === "user.deleted") {
      await deleteUser(data.id);
    }

    return new Response("✅ Webhook received successfully", { status: 200 });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}
