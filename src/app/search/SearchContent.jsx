// app/search/SearchContent.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PostCard } from "@/app/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Footer from "../components/Footer";

export default function SearchContent({ initialParams = {} }) {
  const [filters, setFilters] = useState({
    searchTerm: initialParams.searchTerm || "",
    sort: initialParams.sort || "desc",
    category: initialParams.category || "all",
  });

  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "tech", label: "Technology" },
    { value: "startup", label: "Startups" },
    { value: "vacancy", label: "Vacancies" },
    { value: "finance", label: "Finance" },
    { value: "news", label: "News" },
  ];

  // Fetch all posts initially
  useEffect(() => {
    const fetchAllPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts?limit=100");
        if (res.ok) {
          const data = await res.json();
          setAllPosts(data.posts || []);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  // Apply filters when initialParams or allPosts change
  useEffect(() => {
    // Filter posts based on criteria
    let results = [...allPosts];

    // Apply search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      results = results.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchLower) ||
          post.excerpt?.toLowerCase().includes(searchLower) ||
          post.content?.toLowerCase().includes(searchLower) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          post.author?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category !== "all") {
      results = results.filter((post) => post.category === filters.category);
    }

    // Apply sorting
    results.sort((a, b) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      return filters.sort === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredPosts(results.slice(0, 9));
    setShowMore(results.length > 9);
  }, [filters, allPosts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    if (filters.searchTerm) {
      urlParams.set("searchTerm", filters.searchTerm);
    }
    if (filters.sort !== "desc") {
      urlParams.set("sort", filters.sort);
    }
    if (filters.category !== "all") {
      urlParams.set("category", filters.category);
    }

    const searchQuery = urlParams.toString();
    router.push(`/search?${searchQuery}`);
  };

  const handleShowMore = () => {
    const currentCount = filteredPosts.length;

    // Re-filter to get all results and show more
    let results = [...allPosts];

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      results = results.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchLower) ||
          post.excerpt?.toLowerCase().includes(searchLower) ||
          post.content?.toLowerCase().includes(searchLower) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          post.author?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category !== "all") {
      results = results.filter((post) => post.category === filters.category);
    }

    results.sort((a, b) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      return filters.sort === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredPosts(results.slice(0, currentCount + 9));
    setShowMore(results.length > currentCount + 9);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      sort: "desc",
      category: "all",
    });
    router.push("/search");
  };

  const hasActiveFilters =
    filters.searchTerm || filters.sort !== "desc" || filters.category !== "all";

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-black pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Search Blog Posts
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover the perfect content with our advanced search and filters
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Search Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Search Posts
                    </label>
                    <Input
                      placeholder="Search by title, content, or author..."
                      value={filters.searchTerm}
                      onChange={(e) =>
                        setFilters({ ...filters, searchTerm: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Sort Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sort By
                    </label>
                    <Select
                      value={filters.sort}
                      onValueChange={(value) =>
                        setFilters({ ...filters, sort: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Newest First</SelectItem>
                        <SelectItem value="asc">Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) =>
                        setFilters({ ...filters, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      Apply Filters
                    </Button>
                    {hasActiveFilters && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={clearFilters}
                        className="shrink-0 cursor-pointer"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </form>

                {/* Active Filters Badge */}
                {hasActiveFilters && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                      Active Filters:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {filters.searchTerm && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                          Search: {filters.searchTerm}
                        </span>
                      )}
                      {filters.sort !== "desc" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                          Sort: {filters.sort === "asc" ? "Oldest" : "Newest"}
                        </span>
                      )}
                      {filters.category !== "all" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                          Category:{" "}
                          {
                            categories.find((c) => c.value === filters.category)
                              ?.label
                          }
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Search Results
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {loading
                        ? "Loading posts..."
                        : `Found ${filteredPosts.length} post${
                            filteredPosts.length !== 1 ? "s" : ""
                          }`}
                      {filters.searchTerm && ` for "${filters.searchTerm}"`}
                    </p>
                  </div>
                  {!loading && filteredPosts.length > 0 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Sorted by {filters.sort === "desc" ? "newest" : "oldest"}
                    </div>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl mb-4"></div>
                      <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-3/4 mb-2"></div>
                      <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results State */}
              {!loading &&
                filteredPosts.length === 0 &&
                allPosts.length > 0 && (
                  <div className="text-center py-16">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
                      <div className="w-24 h-24 mx-auto mb-6 text-gray-400 dark:text-gray-500">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No posts found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {hasActiveFilters
                          ? "Try adjusting your search terms or filters"
                          : "No posts available matching your criteria"}
                      </p>
                      {hasActiveFilters && (
                        <Button
                          onClick={clearFilters}
                          variant="outline"
                          className="cursor-pointer"
                        >
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  </div>
                )}

              {/* Initial loading when no posts */}
              {!loading && allPosts.length === 0 && (
                <div className="text-center py-16">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
                    <div className="w-24 h-24 mx-auto mb-6 text-gray-400 dark:text-gray-500">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Loading Content
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Please wait while we load the blog posts...
                    </p>
                  </div>
                </div>
              )}

              {/* Results Grid */}
              {!loading && filteredPosts.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                      <PostCard key={post._id || post.slug} post={post} />
                    ))}
                  </div>

                  {/* Show More Button */}
                  {showMore && (
                    <div className="text-center mt-12">
                      <Button
                        onClick={handleShowMore}
                        variant="outline"
                        className="px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 cursor-pointer"
                      >
                        Load More Posts
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
