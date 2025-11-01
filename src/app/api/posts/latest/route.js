// app/api/posts/latest/route.js
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Post from "@/lib/models/post.model";

export async function GET(request) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 8;
    const category = searchParams.get("category");

    const query = { published: true };

    // Add category filter if provided and not "all"
    if (category && category !== "all") {
      query.category = category;
    }

    const posts = await Post.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .select("-comments")
      .lean();

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest posts" },
      { status: 500 }
    );
  }
}
