// app/api/posts/[slug]/comments/[commentId]/route.js
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Post from "@/lib/models/post.model";
import { currentUser } from "@clerk/nextjs/server";

// Approve/Disapprove comment
export async function PATCH(request, { params }) {
  try {
    await connect();

    // Check if user is admin
    const user = await currentUser();
    if (!user || user.publicMetadata.isAdmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, commentId } = await params;
    const { isApproved } = await request.json();

    const post = await Post.findOneAndUpdate(
      { slug, "comments._id": commentId },
      {
        $set: {
          "comments.$.isApproved": isApproved,
          "comments.$.updatedAt": new Date(),
        },
      },
      { new: true }
    );

    if (!post) {
      return NextResponse.json(
        { error: "Post or comment not found" },
        { status: 404 }
      );
    }

    const updatedComment = post.comments.id(commentId);

    return NextResponse.json({
      success: true,
      comment: updatedComment,
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

    const { slug, commentId } = await params;

    const post = await Post.findOneAndUpdate(
      { slug },
      {
        $pull: {
          comments: { _id: commentId },
        },
      },
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
