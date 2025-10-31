// app/api/posts/route.js
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Post from "@/lib/models/post.model";
import { currentUser } from "@clerk/nextjs/server";
import { uploadToImageKit } from "@/lib/imagekit";

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function POST(request) {
  try {
    console.log("Starting post creation...");
    await connect();

    // Check if user is admin
    const user = await currentUser();
    console.log("User:", user?.id, "Is Admin:", user?.publicMetadata?.isAdmin);

    if (!user || user.publicMetadata.isAdmin !== true) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const title = formData.get("title");
    const content = formData.get("content");
    const category = formData.get("category");
    const author = formData.get("author");
    const featuredImage = formData.get("featuredImage");
    const tags =
      formData
        .get("tags")
        ?.split(",")
        .map((tag) => tag.trim()) || [];

    console.log("Form data received:", {
      title,
      category,
      author,
      tags: tags.length,
    });

    // Basic validation
    if (!title || !content || !category || !author) {
      console.log("Missing required fields:", {
        title: !!title,
        content: !!content,
        category: !!category,
        author: !!author,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = generateSlug(title);
    console.log("Generated slug:", slug);

    // Handle image upload to ImageKit if provided
    let featuredImageData = null;
    if (featuredImage && featuredImage.size > 0) {
      console.log("Uploading image to ImageKit...");
      try {
        featuredImageData = await uploadToImageKit(featuredImage);
        console.log("Image uploaded successfully:", featuredImageData?.fileId);
      } catch (imageError) {
        console.error("Image upload failed:", imageError);
        return NextResponse.json(
          { error: "Image upload failed" },
          { status: 500 }
        );
      }
    }

    // Generate excerpt from content
    const plainText = content.replace(/<[^>]*>/g, "");
    const excerpt =
      plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "");

    const postData = {
      title,
      slug, // Add the generated slug
      content,
      excerpt, // Add the generated excerpt
      category,
      author,
      tags,
      published: true,
      publishedAt: new Date(),
      ...(featuredImageData && { featuredImage: featuredImageData }),
    };

    console.log("Creating post in database with data:", postData);
    const post = await Post.create(postData);
    console.log("Post created successfully:", post._id);

    return NextResponse.json(
      {
        success: true,
        post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);

    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return NextResponse.json(
        {
          error:
            "A post with this title already exists. Please choose a different title.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}

// Get all posts (latest first) - unchanged
export async function GET(request) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const category = searchParams.get("category");
    const published = searchParams.get("published") !== "false";

    const query = {};
    if (category) query.category = category;
    if (published) query.published = true;

    const posts = await Post.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select("-comments");

    const total = await Post.countDocuments(query);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
