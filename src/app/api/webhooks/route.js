// app/api/webhooks/route.js
import { clerkClient } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { headers as nextHeaders } from "next/headers";
import { createOrUpdateUser, deleteUser } from "@/lib/userService"; // ✅ adjust path

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "❌ Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // ✅ Get headers safely
  const headerList = nextHeaders();
  const svix_id = headerList.get("svix-id");
  const svix_timestamp = headerList.get("svix-timestamp");
  const svix_signature = headerList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("❌ Missing Svix headers", { status: 400 });
  }

  // ✅ Get and stringify the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // ✅ Verify webhook using Svix
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

  // ✅ Webhook event data
  const eventType = evt.type;
  const data = evt.data;

  console.log(`✅ Received Clerk webhook: ${eventType}`);
  console.log("Payload:", data);

  try {
    // 🧩 Handle Clerk events
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

    if (eventType === "user.deleted") {
      const { id } = data;
      await deleteUser(id);
    }

    return new Response("✅ Webhook received successfully", { status: 200 });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}
