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

// Get all approved comments for a post (keep this public)
export async function GET(request, { params }) {
  try {
    await connect();

    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const includeUnapproved = searchParams.get("admin") === "true";

    const post = await Post.findOne({ slug, published: true }, { comments: 1 });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let comments = post.comments;

    // If not admin, only return approved comments
    if (!includeUnapproved) {
      comments = comments.filter((comment) => comment.isApproved);
    }

    // Sort by latest first
    comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({
      comments,
      total: comments.length,
      approved: comments.filter((c) => c.isApproved).length,
      pending: comments.filter((c) => !c.isApproved).length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
