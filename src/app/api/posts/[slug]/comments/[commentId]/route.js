// app/api/posts/[slug]/comments/[commentId]/route.js
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Post from "@/lib/models/post.model";
import { currentUser } from "@clerk/nextjs";

// Approve/Disapprove comment
export async function PATCH(request, { params }) {
  try {
    await connect();

    // Check if user is admin
    const user = await currentUser();
    if (!user || user.publicMetadata.isAdmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, commentId } = params;
    const { isApproved } = await request.json();

    if (typeof isApproved !== "boolean") {
      return NextResponse.json(
        { error: "isApproved must be a boolean" },
        { status: 400 }
      );
    }

    const post = await Post.findOneAndUpdate(
      { slug, "comments._id": commentId },
      { $set: { "comments.$.isApproved": isApproved } },
      { new: true }
    );

    if (!post) {
      return NextResponse.json(
        { error: "Post or comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Comment ${isApproved ? "approved" : "disapproved"}`,
      comment: post.comments.id(commentId),
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete comment
export async function DELETE(request, { params }) {
  try {
    await connect();

    // Check if user is admin
    const user = await currentUser();
    if (!user || user.publicMetadata.isAdmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, commentId } = params;

    const post = await Post.findOneAndUpdate(
      { slug },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
