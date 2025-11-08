// app/components/DashCreate.jsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Loader2 } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import Image from "next/image";

export default function DashCreate() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    // Add content from ReactQuill
    formData.set("content", content);
    formData.set("category", selectedCategory);
    formData.set("published", "true");

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Post created successfully:", result);

        // Show success notification
        setShowNotification(true);

        // Redirect to home page after a short delay to show notification
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 2000);
      } else {
        const errorText = await response.text();
        console.log("Raw error response:", errorText);

        try {
          const error = JSON.parse(errorText);
          console.error("Failed to create post:", error);
          alert(`Error: ${error.error || "Failed to create post"}`);
        } catch (parseError) {
          console.error("Failed to parse error response:", errorText);
          alert(`Error: Server returned ${response.status} - ${errorText}`);
        }
      }
    } catch (error) {
      console.error("Network error creating post:", error);
      alert("Network error creating post. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Auto-hide notification after 5 seconds
  useState(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 dark:border-teal-400"></div>
      </div>
    );
  }

  if (isSignedIn && user.publicMetadata.isAdmin) {
    return (
      <div className="min-h-screen bg-white dark:bg-black py-6 px-4">
        {/* Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed top-4 right-4 z-50 max-w-sm w-full"
            >
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                      <Bell className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-green-800 dark:text-green-200">
                      Blog Post Published!
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Your post has been successfully published and is now live.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNotification(false)}
                    className="shrink-0 text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-3xl mx-auto">
          {/* Header - More Compact */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create Post
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Share your thoughts with the community
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-gray-900/30 p-4 sm:p-6 space-y-6"
          >
            {/* Title & Category Row - More Compact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Post Title *
                </Label>
                <Input
                  type="text"
                  name="title"
                  placeholder="Enter post title..."
                  required
                  id="title"
                  className="w-full p-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category *
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full p-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                    <SelectGroup>
                      <SelectLabel className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        Categories
                      </SelectLabel>
                      <SelectItem
                        value="tech"
                        className="text-sm p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        💻 Tech
                      </SelectItem>
                      <SelectItem
                        value="startup"
                        className="text-sm p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        🚀 Startup
                      </SelectItem>
                      <SelectItem
                        value="vacancy"
                        className="text-sm p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        💼 Vacancy
                      </SelectItem>
                      <SelectItem
                        value="finance"
                        className="text-sm p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        💰 Finance
                      </SelectItem>
                      <SelectItem
                        value="news"
                        className="text-sm p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        📰 News
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags Field */}
            <div className="space-y-2">
              <Label
                htmlFor="tags"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tags
              </Label>
              <Input
                type="text"
                name="tags"
                placeholder="Enter tags separated by commas (e.g., javascript, react, nextjs)"
                id="tags"
                className="w-full p-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Separate multiple tags with commas
              </p>
            </div>

            {/* File Upload Section - More Compact */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Featured Image
              </Label>
              <div className="border-2 border-dashed border-teal-200 dark:border-teal-800 rounded-lg p-4 text-center bg-teal-50 dark:bg-teal-900/10 hover:bg-teal-100 dark:hover:bg-teal-900/20 transition-colors">
                <input
                  type="file"
                  name="featuredImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="featuredImage"
                />

                <div className="flex flex-col items-center gap-4">
                  {imagePreview ? (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        width={100}
                        height={100}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          document.getElementById("featuredImage").value = "";
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">
                      <svg
                        className="w-12 h-12 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm">Click to upload featured image</p>
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("featuredImage").click()
                    }
                    className="border border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-300 hover:bg-teal-500 dark:hover:bg-teal-600 hover:text-white dark:hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    {imagePreview ? "Change Image" : "Browse"}
                  </Button>
                </div>

                <p className="text-gray-500 dark:text-gray-400 mt-2 text-xs">
                  Upload featured image (JPEG, PNG, WebP) - Max 5MB
                </p>
              </div>
            </div>

            {/* Content Editor - More Compact */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Content *
              </Label>
              <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  placeholder="Write your content here..."
                  className="h-64 mb-10 dark:bg-gray-800 dark:text-white"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
              </div>
            </div>

            {/* Author Field - More Compact */}
            <div className="space-y-2">
              <Label
                htmlFor="author"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Author *
              </Label>
              <Input
                type="text"
                name="author"
                placeholder="Author name..."
                required
                id="author"
                defaultValue={user.fullName || ""}
                className="w-full p-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Submit Button - More Compact */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={loading || !content || !selectedCategory}
                className="w-full sm:w-40 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg text-base shadow-md hover:shadow-lg transition-all"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </div>
                ) : (
                  "Publish Post"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-gray-900/30 p-6 max-w-sm mx-auto">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-red-500 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-9a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Admin privileges required
            </p>
            <Button
              onClick={() => window.history.back()}
              className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
