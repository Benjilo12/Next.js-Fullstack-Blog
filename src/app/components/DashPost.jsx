"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import Image from "next/image";

export default function DashPosts() {
  const { user, isLoaded } = useUser();
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/posts?limit=100");
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts || []);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.publicMetadata?.isAdmin) {
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [user?.publicMetadata?.isAdmin]);

  const handleDeletePost = async () => {
    setDeleting(true);
    try {
      const post = userPosts.find((p) => p._id === postIdToDelete);
      const res = await fetch(`/api/posts/${post.slug}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
        setPostIdToDelete("");
      } else {
        console.log(data.error || "Failed to delete post");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setDeleting(false);
      setShowModal(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-full w-full py-16">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (!user?.publicMetadata?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-16 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You need administrator privileges to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-50 dark:bg-gray-900 mt-15">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Manage Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all blog posts
          </p>
        </div>

        {user?.publicMetadata?.isAdmin && userPosts.length > 0 ? (
          <Card className="p-6 shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date Updated</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPosts.map((post) => (
                    <TableRow key={post._id}>
                      <TableCell>
                        {new Date(
                          post.updatedAt || post.publishedAt
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Link href={`/posts/${post.slug}`}>
                          {post.featuredImage?.url ? (
                            <Image
                              src={post.featuredImage.url}
                              alt={post.title}
                              width={80}
                              height={40}
                              className="w-20 h-10 object-cover bg-gray-500 rounded"
                            />
                          ) : (
                            <div className="w-20 h-10 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-xs text-gray-500">
                              No image
                            </div>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          href={`/posts/${post.slug}`}
                        >
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-sm">
                          {post.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                          onClick={() => {
                            setShowModal(true);
                            setPostIdToDelete(post._id);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You have no posts yet!
            </p>
            <Link href="/dashboard/create-post">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Your First Post
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showModal} onOpenChange={setShowModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <AlertDialogTitle>Delete Post</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
