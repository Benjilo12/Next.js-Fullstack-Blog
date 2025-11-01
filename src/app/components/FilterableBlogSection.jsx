// components/FilterableBlogSection.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PostCard } from "./PostCard";

const CATEGORIES = [
  { value: "all", label: "All Posts", emoji: "📚" },
  { value: "tech", label: "Tech", emoji: "💻" },
  { value: "startup", label: "Startup", emoji: "🚀" },
  { value: "vacancy", label: "Vacancy", emoji: "💼" },
  { value: "finance", label: "Finance", emoji: "💰" },
  { value: "news", label: "News", emoji: "📰" },
];

export function FilterableBlogSection() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Initialize category from URL params
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (
      categoryFromUrl &&
      CATEGORIES.some((cat) => cat.value === categoryFromUrl)
    ) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  // Fetch posts based on selected category
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        const url =
          selectedCategory === "all"
            ? "/api/posts/latest?limit=8"
            : `/api/posts/latest?limit=8&category=${selectedCategory}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();

        if (data.success) {
          setPosts(data.posts);
        } else {
          throw new Error(data.error || "Failed to fetch posts");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    // Update URL params without page reload
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Blog Posts
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the latest insights, stories, and updates from our blog
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                selectedCategory === category.value
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span>{category.emoji}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl mb-4"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 dark:text-red-400 mb-4">
                Error: {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                No posts found
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                {selectedCategory === "all"
                  ? "Check back later for new posts!"
                  : `No ${selectedCategory} posts available yet.`}
              </p>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <button
                onClick={() => router.push("/blog")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer"
              >
                View All Posts
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
