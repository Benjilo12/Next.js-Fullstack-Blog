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

    // Check if connection is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection not ready");
    }

    const email = email_addresses?.[0]?.email_address || "";

    console.log("📝 Creating/updating user:", { clerkId: id, email });

    // Add timeout to the database operation
    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name || "",
          lastName: last_name || "",
          profilePicture: image_url || "",
          email: email_addresses?.[0]?.email_address || "",
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
        runValidators: false, // Disable validators for performance
        maxTimeMS: 30000, // 30 second timeout for the operation
      }
    );

    console.log("✅ User saved successfully:", user?._id);
    return user;
  } catch (error) {
    console.error("❌ Error in createOrUpdateUser:", error.message);

    // Check if it's a connection error and reset connection state
    if (error.name === "MongooseError" || error.message.includes("buffering")) {
      // Reset connection state to force reconnection
      isConnected = false;
      connectionPromise = null;
    }

    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    console.log("🗑️ Deleting user:", id);
    await connect();

    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection not ready");
    }

    const result = await User.findOneAndDelete(
      { clerkId: id },
      { maxTimeMS: 30000 }
    );

    if (result) {
      console.log("✅ User deleted successfully:", id);
    } else {
      console.log("⚠️ User not found for deletion:", id);
    }

    return result;
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);

    if (error.name === "MongooseError" || error.message.includes("buffering")) {
      isConnected = false;
      connectionPromise = null;
    }

    throw error;
  }
};
