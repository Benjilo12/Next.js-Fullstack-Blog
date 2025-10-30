// src/app/dashboard/create-post/page.jsx
"use client";

import { useUser } from "@clerk/nextjs";
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
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

function CreatePostPage() {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 dark:border-teal-400"></div>
      </div>
    );
  }

  if (isSignedIn && user.publicMetadata.isAdmin) {
    return (
      <div className="min-h-screen bg-white dark:bg-black py-6 px-4 mt-20">
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

          <form className="bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-gray-900/30 p-4 sm:p-6 space-y-6">
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
                <Select>
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

            {/* File Upload Section - More Compact */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Featured Image
              </Label>
              <div className="border-2 border-dashed border-teal-200 dark:border-teal-800 rounded-lg p-4 text-center bg-teal-50 dark:bg-teal-900/10 hover:bg-teal-100 dark:hover:bg-teal-900/20 transition-colors">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <FileUpload type="file" accept="image/*" />
                  <Button
                    type="button"
                    variant="outline"
                    className="border border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-300 hover:bg-teal-500 dark:hover:bg-teal-600 hover:text-white dark:hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    Browse
                  </Button>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-xs">
                  Upload featured image (JPEG, PNG, WebP)
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
                placeholder="Author name..."
                required
                id="author"
                className="w-full p-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Submit Button - More Compact */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="w-full sm:w-40 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white font-semibold py-3 px-6 rounded-lg text-base shadow-md hover:shadow-lg transition-all"
              >
                Publish
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

export default CreatePostPage;
