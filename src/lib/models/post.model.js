// models/Post.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
});

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      trim: true,
    },
    featuredImage: {
      url: String,
      fileId: String, // ImageKit file ID
      thumbnailUrl: String,
    },
    category: {
      type: String,
      required: true,
      enum: ["tech", "startup", "vacancy", "finance", "news"],
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    comments: [commentSchema],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Generate slug before saving
postSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = generateSlug(this.title);
  }

  // Generate excerpt from content if not provided
  if (this.isModified("content") && !this.excerpt) {
    // Remove HTML tags and limit to 150 characters
    const plainText = this.content.replace(/<[^>]*>/g, "");
    this.excerpt =
      plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "");
  }
  next();
});

// Also handle slug generation for create operations
postSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = generateSlug(this.title);
  }
  next();
});

export default mongoose.models.Post || mongoose.model("Post", postSchema);
