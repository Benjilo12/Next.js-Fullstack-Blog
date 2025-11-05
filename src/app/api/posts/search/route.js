// app/api/posts/search/route.js
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Post from "@/lib/models/post.model";

export async function GET(request) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("searchTerm") || "";
    const category = searchParams.get("category") || "all";
    const sort = searchParams.get("sort") || "desc";
    const limit = parseInt(searchParams.get("limit")) || 9;
    const startIndex = parseInt(searchParams.get("startIndex")) || 0;

    // Build query
    let query = { published: true };

    // Category filter
    if (category && category !== "all") {
      query.category = category;
    }

    // Search term filter (search in title, content, excerpt, tags)
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { content: { $regex: searchTerm, $options: "i" } },
        { excerpt: { $regex: searchTerm, $options: "i" } },
        { tags: { $in: [new RegExp(searchTerm, "i")] } },
      ];
    }

    const posts = await Post.find(query)
      .sort({ publishedAt: sort === "asc" ? 1 : -1 })
      .skip(startIndex)
      .limit(limit)
      .select(
        "title slug excerpt featuredImage category author publishedAt tags"
      );

    const total = await Post.countDocuments(query);

    return NextResponse.json({
      success: true,
      posts,
      total,
      hasMore: posts.length === limit,
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
