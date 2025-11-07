"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SkeletonList from "../components/SkeletonList";

// Categories matching your API
const CATEGORIES = [
  { value: "all", label: "All Posts", emoji: "📚" },
  { value: "tech", label: "Tech", emoji: "💻" },
  { value: "startup", label: "Startup", emoji: "🚀" },
  { value: "vacancy", label: "Vacancy", emoji: "💼" },
  { value: "finance", label: "Finance", emoji: "💰" },
  { value: "news", label: "News", emoji: "📰" },
];

// BlogContent component that uses useSearchParams
export default function BlogContent() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);

  // Get category from URL search params, default to "all"
  const urlCategory = searchParams.get("category");
  const selectedCategory = urlCategory || "all";

  // Fetch posts from your API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const url =
          selectedCategory === "all"
            ? "/api/posts"
            : `/api/posts?category=${selectedCategory}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.success) {
          setPosts(data.posts || []);
        } else {
          console.error("Error fetching posts:", data.error);
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  // Get currently visible posts
  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visiblePosts.length < posts.length;

  // Load more posts
  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  // Calculate reading time
  const calculateReadingTime = (text) => {
    if (!text) return 3; // Default reading time
    const wordsPerMinute = 150;
    const textLength = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(textLength / wordsPerMinute));
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <SkeletonList />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black  mt-15">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Posts
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the latest insights, news, and opportunities in tech,
            startups, and more.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((category) => (
            <Link
              key={category.value}
              href={
                category.value === "all"
                  ? "/blog"
                  : `/blog?category=${category.value}`
              }
              className={`px-5 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                selectedCategory === category.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span>{category.emoji}</span>
              <span>{category.label}</span>
            </Link>
          ))}
        </div>

        {/* Posts List */}
        <div className="space-y-8">
          {visiblePosts.map((post) => {
            const readingTime = calculateReadingTime(post.excerpt);

            return (
              <article
                key={post._id || post.slug}
                className="group cursor-pointer border-b border-gray-200 dark:border-gray-700 pb-8 last:border-b-0"
              >
                <Link href={`/posts/${post.slug}`}>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Post Image */}
                    <div className="shrink-0 w-full md:w-64 h-48 overflow-hidden rounded-lg">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage.url}
                          alt={post.title}
                          width={256}
                          height={192}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400">📝</span>
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="grow">
                      {/* Category */}
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 mb-3">
                        {CATEGORIES.find((cat) => cat.value === post.category)
                          ?.label || post.category}
                      </span>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {post.excerpt || "Read more about this post..."}
                      </p>

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                        <span>•</span>
                        <span>{readingTime} min read</span>
                        {post.author && (
                          <>
                            <span>•</span>
                            <span>By {post.author}</span>
                          </>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {post.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {post.tags.length > 2 && (
                                <span className="text-xs">
                                  +{post.tags.length - 2} more
                                </span>
                              )}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}

          {/* No Posts Found */}
          {visiblePosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No posts found for this category.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                Check back later for new content!
              </p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              See More Posts
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Showing {visiblePosts.length} of {posts.length} posts
            </p>
          </div>
        )}

        {/* Show message when all posts are loaded */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-500 dark:text-gray-400">
              You&apos;ve reached the end! {posts.length} posts loaded.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
