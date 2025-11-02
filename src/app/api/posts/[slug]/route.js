// app/api/posts/[slug]/route.js
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Post from "@/lib/models/post.model";
import { currentUser } from "@clerk/nextjs/server";
import { deleteFromImageKit } from "@/lib/imagekit";

// app/api/posts/route.js

export async function GET() {
  try {
    await connect();

    const posts = await Post.find({ published: true })
      .sort({ publishedAt: -1 })
      .select(
        "title slug content author category tags featuredImage publishedAt updatedAt"
      );

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connect();

    // Check if user is admin
    const user = await currentUser();
    if (!user || user.publicMetadata.isAdmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;

    // Get post first to check for images
    const post = await Post.findOne({ slug });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete associated images from ImageKit
    if (post?.featuredImage?.fileId) {
      await deleteFromImageKit(post.featuredImage.fileId);
    }

    await Post.findOneAndDelete({ slug });

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connect();

    // Check if user is admin
    const user = await currentUser();
    if (!user || user.publicMetadata.isAdmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
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
    const published = formData.get("published") === "true";

    // Get current post to handle image updates
    const currentPost = await Post.findOne({ slug });
    if (!currentPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Handle image upload/update
    let featuredImageData = currentPost.featuredImage;
    if (featuredImage && featuredImage.size > 0) {
      // Delete old image if exists
      if (currentPost.featuredImage?.fileId) {
        await deleteFromImageKit(currentPost.featuredImage.fileId);
      }
      // Upload new image
      featuredImageData = await uploadToImageKit(featuredImage);
    }

    const updates = {
      title,
      content,
      category,
      author,
      tags,
      published,
      featuredImage: featuredImageData,
      updatedAt: new Date(),
    };

    // Update publishedAt if publishing for the first time
    if (published && !currentPost.publishedAt) {
      updates.publishedAt = new Date();
    }

    const updatedPost = await Post.findOneAndUpdate({ slug }, updates, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
