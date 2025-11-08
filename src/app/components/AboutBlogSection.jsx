// components/AboutBlogSection.jsx
import Image from "next/image";

export default function AboutBlogSection() {
  return (
    <section className="px-4 py-5 md:py-20 bg-linear-to-br from-sky-500 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-linear-to-br from-sky-300 to-sky-200 dark:from-gray-900 dark:to-gray-600  rounded-2xl shadow-lg p-8 md:p-12 backdrop-blur-sm">
          {/* Left: Image */}
          <div className="w-full md:w-1/2 shrink-0">
            <div className="relative overflow-hidden rounded-xl shadow-2xl group">
              <Image
                src="/typing.jpg"
                alt="Blog team working together"
                width={400}
                height={400}
                className="rounded-xl object-cover w-full h-[600px] transform group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-teal-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Right: Text */}
          <div className="w-full md:w-1/2 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/30 rounded-full">
              <span className="text-teal-600 dark:text-teal-400 text-lg">
                ✨
              </span>
              <h2 className="text-xs uppercase text-teal-700 dark:text-teal-400 font-bold tracking-wider">
                TopBlog
              </h2>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Discover Inspiring Stories and{" "}
              <span className="text-teal-600 dark:text-teal-400">
                Expert Insights
              </span>
            </h1>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base md:text-lg">
              Welcome to{" "}
              <strong className="text-teal-600 dark:text-teal-400">
                TopBlog
              </strong>{" "}
              — your destination for engaging stories, industry insights, and
              creative perspectives. Whether you&apos;re passionate about
              technology, lifestyle, or personal development, our curated
              articles keep you informed and inspired.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-teal-600 dark:text-teal-400">📚</span>
                <span>100+ Articles</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-teal-600 dark:text-teal-400">✍️</span>
                <span>Expert Writers</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-teal-600 dark:text-teal-400">🚀</span>
                <span>Daily Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
