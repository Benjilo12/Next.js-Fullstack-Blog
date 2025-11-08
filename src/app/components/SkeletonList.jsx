export default function SkeletonList() {
  return (
    <div className="min-h-screen bg-white dark:bg-black mt-20">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Categories Skeleton */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-300 dark:bg-gray-700 rounded-full w-28 animate-pulse"
            ></div>
          ))}
        </div>

        {/* Posts Skeleton */}
        <div className="space-y-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row gap-6 animate-pulse border-b border-gray-200 dark:border-gray-700 pb-8"
            >
              {/* Image Skeleton */}
              <div className="shrink-0 w-full md:w-64 h-48 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>

              {/* Content Skeleton */}
              <div className="grow space-y-3">
                <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="flex gap-4">
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/6"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/5"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
