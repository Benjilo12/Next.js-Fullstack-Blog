// app/api/posts/[slug]/comments/route.js
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Post from "@/lib/models/post.model";
import { currentUser } from "@clerk/nextjs/server";

// Add new comment
export async function POST(request, { params }) {
  try {
    await connect();

    // Check if user is signed in
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to comment" },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const { content } = await request.json();

    // Validation
    if (!content) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    if (content.length < 5) {
      return NextResponse.json(
        { error: "Comment must be at least 5 characters long" },
        { status: 400 }
      );
    }

    const post = await Post.findOneAndUpdate(
      { slug, published: true },
      {
        $push: {
          comments: {
            author: user.fullName || user.firstName || "Anonymous",
            email: user.primaryEmailAddress?.emailAddress || "",
            content: content.trim(),
            createdAt: new Date(),
            isApproved: false, // Comments require admin approval
            userId: user.id, // Store Clerk user ID for reference
          },
        },
      },
      { new: true }
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const newComment = post.comments[post.comments.length - 1];

    return NextResponse.json(
      {
        success: true,
        message: "Comment submitted for approval",
        comment: newComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    // Flatten all comments and include post information
    let allComments = [];

    posts.forEach((post) => {
      if (post.comments && post.comments.length > 0) {
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
