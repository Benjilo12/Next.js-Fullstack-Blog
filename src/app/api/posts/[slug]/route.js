// app/api/posts/comments/route.js
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Post from "@/lib/models/post.model";
import { currentUser } from "@clerk/nextjs/server";

// Get all comments from all posts (admin only)
export async function GET(request) {
  try {
    await connect();

    // Check if user is admin
    const user = await currentUser();
    if (!user || user.publicMetadata.isAdmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeUnapproved = searchParams.get("admin") === "true";

    // Get all published posts with their comments
    const posts = await Post.find({ published: true })
      .select("title slug comments")
      .lean();

    console.log(`Found ${posts.length} posts with comments`);

    // Flatten all comments and include post information
    let allComments = [];

    posts.forEach((post) => {
      if (post.comments && post.comments.length > 0) {
        console.log(
          `Post "${post.title}" has ${post.comments.length} comments`
        );
        post.comments.forEach((comment) => {
          // Convert comment to plain object and ensure _id is string
          const commentObj = {
            ...comment,
            postTitle: post.title,
            postSlug: post.slug,
            _id: comment._id?.toString() || comment._id,
          };

          // If admin, include all comments, otherwise only approved ones
          if (includeUnapproved || commentObj.isApproved) {
            allComments.push(commentObj);
          }
        });
      }
    });

    console.log(`Total comments found: ${allComments.length}`);

    // Sort by latest first
    allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const pendingCount = allComments.filter((c) => !c.isApproved).length;
    const approvedCount = allComments.filter((c) => c.isApproved).length;

    return NextResponse.json({
      comments: allComments,
      total: allComments.length,
      pending: pendingCount,
      approved: approvedCount,
    });
  } catch (error) {
    console.error("Error fetching all comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
