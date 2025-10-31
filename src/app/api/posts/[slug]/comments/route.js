// app/api/posts/[slug]/comments/route.js
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Post from "@/lib/models/post.model";

// Add new comment
export async function POST(request, { params }) {
  try {
    await connect();

    const { slug } = params;
    const { author, email, content } = await request.json();

    // Validation
    if (!author || !email || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      return NextResponse.json(
        { error: "Invalid email format" },
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
            author: author.trim(),
            email: email.trim().toLowerCase(),
            content: content.trim(),
            createdAt: new Date(),
            isApproved: false, // Comments require admin approval
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

// Get all approved comments for a post
export async function GET(request, { params }) {
  try {
    await connect();

    const { slug } = params;
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
