// components/PostCard.jsx
import Link from "next/link";
import Image from "next/image";
import GradientBorder from "@/components/GradientBorder";

export function PostCard({ post }) {
  return (
    <GradientBorder>
      <Link
        href={`/blog/${post.slug}`}
        className="group block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        {/* Featured Image */}
        {post.featuredImage?.url && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={post.featuredImage.url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${
                  post.category === "tech"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : post.category === "startup"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : post.category === "vacancy"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    : post.category === "finance"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {post.category}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 text-sm">
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">{post.author}</span>
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs text-gray-400 dark:text-gray-500">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </GradientBorder>
  );
}
