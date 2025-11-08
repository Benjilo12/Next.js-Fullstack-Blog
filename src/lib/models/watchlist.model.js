// models/Watchlist.js
import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // This creates an index automatically
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: "Please enter a valid email address",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      default: "newsletter",
    },
    preferences: {
      categories: [
        {
          type: String,
          enum: ["tech", "startup", "vacancy", "finance", "news", "all"],
          default: "all",
        },
      ],
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        default: "weekly",
      },
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
      referrer: String,
    },
  },
  {
    timestamps: true,
  }
);

// Remove the manual index definitions to avoid duplicates
// The 'unique: true' on email field automatically creates an index
// watchlistSchema.index({ email: 1 }); // REMOVE THIS LINE
// watchlistSchema.index({ isActive: 1 }); // REMOVE THIS LINE
// watchlistSchema.index({ subscribedAt: -1 }); // REMOVE THIS LINE

// Only keep custom indexes if needed for compound queries
watchlistSchema.index({ isActive: 1, subscribedAt: -1 }); // Keep this if you need compound index

export default mongoose.models.Watchlist ||
  mongoose.model("Watchlist", watchlistSchema);
