// app/components/DashComments.jsx
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  MessageSquare,
  Clock,
  Eye,
} from "lucide-react";

export default function DashComments() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Fetch all comments from all posts
  // In your DashComments component
  const fetchAllComments = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching comments from /api/posts/comments...");

      // This should now point to the new route
      const response = await fetch("/api/posts/comments?admin=true");

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Comments data received:", data);
        setComments(data.comments || []);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch comments:", errorText);
        setError("Failed to load comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Error loading comments. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.publicMetadata?.isAdmin) {
      fetchAllComments();
    }
  }, [isLoaded, isSignedIn, user]);

  // Approve comment
  const approveComment = async (postSlug, commentId) => {
    try {
      console.log("Approving comment:", postSlug, commentId);
      const response = await fetch(
        `/api/posts/${postSlug}/comments/${commentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isApproved: true }),
        }
      );

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? { ...comment, isApproved: true }
              : comment
          )
        );
        console.log("Comment approved successfully");
      } else {
        const errorText = await response.text();
        console.error("Failed to approve comment:", errorText);
        alert("Failed to approve comment");
      }
    } catch (error) {
      console.error("Error approving comment:", error);
      alert("Error approving comment");
    }
  };

  // Delete comment
  const deleteComment = async (postSlug, commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      console.log("Deleting comment:", postSlug, commentId);
      const response = await fetch(
        `/api/posts/${postSlug}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
        console.log("Comment deleted successfully");
      } else {
        const errorText = await response.text();
        console.error("Failed to delete comment:", errorText);
        alert("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Error deleting comment");
    }
  };

  // Filter comments based on search and status
  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.postTitle?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && comment.isApproved) ||
      (statusFilter === "pending" && !comment.isApproved);

    return matchesSearch && matchesStatus;
  });

  const pendingCount = comments.filter((c) => !c.isApproved).length;
  const approvedCount = comments.filter((c) => c.isApproved).length;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isSignedIn || !user?.publicMetadata?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Admin privileges required to manage comments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Comments Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage and moderate user comments
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <Button
                onClick={() => {
                  setRefreshing(true);
                  fetchAllComments();
                }}
                disabled={refreshing || loading}
                variant="outline"
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Comments
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {comments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mr-4">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pendingCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Approved
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {approvedCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search comments, authors, or posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Comments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Loading comments...
              </p>
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {comments.length === 0
                  ? "No comments yet"
                  : "No matching comments"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Comments will appear here once users start commenting on posts."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredComments.map((comment) => (
                <div key={comment._id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {comment.author || "Anonymous"}
                            </h4>
                            {comment.isApproved ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <CheckCircle className="w-3 h-3" />
                                Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {comment.email} •{" "}
                            {new Date(comment.createdAt).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(comment.createdAt).toLocaleTimeString()}
                          </p>
                          {comment.postTitle && (
                            <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 mb-3">
                              <Eye className="w-4 h-4" />
                              <span>Post: {comment.postTitle}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        {comment.content}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                      {!comment.isApproved && (
                        <Button
                          onClick={() =>
                            approveComment(comment.postSlug, comment._id)
                          }
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      <Button
                        onClick={() =>
                          deleteComment(comment.postSlug, comment._id)
                        }
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
