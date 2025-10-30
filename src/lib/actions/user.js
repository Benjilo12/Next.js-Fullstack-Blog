// lib/actions/user.js
import User from "../models/user.model";
import { connect } from "../mongodb/mongoose";

export const createOrUpdateUser = async (
  id,
  first_name,
  last_name,
  image_url,
  email_addresses,
  username
) => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await connect();

    // Safely extract email with multiple fallbacks
    const email =
      email_addresses?.[0]?.email_address ||
      email_addresses?.[0]?.emailAddress ||
      "";

    console.log("📝 Creating/updating user:", {
      clerkId: id,
      email,
      first_name,
      last_name,
      username,
    });

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name || "",
          lastName: last_name || "",
          profilePicture: image_url || "",
          email: email,
          username: username || "",
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    console.log("✅ User saved successfully:", user?._id);
    return user;
  } catch (error) {
    console.error("❌ Error in createOrUpdateUser:", error.message);
    console.error("Full error:", error);
    throw error; // Re-throw to handle in webhook
  }
};

export const deleteUser = async (id) => {
  try {
    console.log("🗑️ Deleting user:", id);
    await connect();
    const result = await User.findOneAndDelete({ clerkId: id });

    if (result) {
      console.log("✅ User deleted successfully:", id);
    } else {
      console.log("⚠️ User not found for deletion:", id);
    }

    return result;
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);
    throw error;
  }
};
