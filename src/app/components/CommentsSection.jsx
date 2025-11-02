// components/CommentsSection.jsx
"use client";

import { useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { light, dark } from "@clerk/themes";
import { useTheme } from "next-themes";

// Local avatar color generator
const avatarColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const getAvatarColor = (name) => {
  const index = name ? name.charCodeAt(0) % avatarColors.length : 0;
  return avatarColors[index];
};

export default function CommentsSection({ postSlug }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const { user, isLoaded, isSignedIn } = useUser();
  const { theme } = useTheme();

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postSlug}/comments`);

      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || "Failed to load comments",
        });
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is signed in
    if (!isSignedIn) {
      setMessage({
        type: "error",
        text: "Please sign in to comment",
      });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`/api/posts/${postSlug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: commentContent }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: data.message || "Comment submitted for approval!",
        });
        setCommentContent("");
        // Refresh comments after a short delay
        setTimeout(() => {
          fetchComments();
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to submit comment",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Simple avatar component
  const UserAvatar = ({ comment, className = "" }) => {
    // If the comment was made by the current logged-in user, use their Clerk avatar
    if (user && comment.userId === user.id && user.hasImage) {
      return (
        <Image
          src={user.imageUrl}
          alt={`${user.fullName || user.firstName}'s avatar`}
          width={40}
          height={40}
          className={`rounded-full ${className}`}
        />
      );
    }

    // Fallback: colored circle with initial
    const initial = comment.author?.charAt(0).toUpperCase() || "U";
    const colorClass = getAvatarColor(comment.author);

    return (
      <div
        className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center text-white font-semibold ${className}`}
      >
        {initial}
      </div>
    );
  };

  return (
    <section className="border-t pt-8 border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Comments ({comments.length})
      </h2>

      {/* Comments List */}
      <div className="space-y-6 mb-8">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Loading comments...
            </p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p className="text-lg font-medium mb-2">No comments yet</p>
            <p className="text-sm">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id || comment.createdAt}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <UserAvatar comment={comment} />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {comment.author}
                      {user && comment.userId === user.id && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          You
                        </span>
                      )}
                    </h4>
                    {comment.email && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {comment.email}
                      </p>
                    )}
                  </div>
                </div>
                <time className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap shrink-0">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>

              <div className="text-gray-700 dark:text-gray-300 leading-relaxed ml-13">
                {comment.content}
              </div>

              {!comment.isApproved && (
                <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 ml-13">
                  Awaiting approval
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Comment Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          {isSignedIn && user ? (
            <>
              {user.hasImage ? (
                <Image
                  src={user.imageUrl}
                  alt={`${user.fullName || user.firstName}'s avatar`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div
                  className={`w-10 h-10 rounded-full ${getAvatarColor(
                    user.fullName || user.firstName
                  )} flex items-center justify-center`}
                >
                  <span className="text-white font-semibold text-sm">
                    {(user.fullName || user.firstName || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Leave a Comment
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Commenting as {user.fullName || user.firstName}
                </p>
              </div>
            </>
          ) : (
            <div className="w-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Join the Conversation
              </h3>
              <div className="flex items-center gap-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm flex-1">
                  Sign in to share your thoughts and join the discussion.
                </p>
                <SignInButton
                  mode="modal"
                  appearance={{
                    baseTheme: theme === "dark" ? dark : light,
                  }}
                >
                  <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer">
                    Sign In to Comment
                  </button>
                </SignInButton>
              </div>
            </div>
          )}
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-md mb-4 ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {isSignedIn && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Your Comment *
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows="4"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical"
                placeholder="Share your thoughts..."
                minLength="5"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Minimum 5 characters required
              </p>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={submitting || !commentContent.trim()}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {submitting ? "Submitting..." : "Submit Comment"}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Note: All comments are moderated and will appear after approval.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
