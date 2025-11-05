// app/not-found.js
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:black mt-20 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700">
            404
          </h1>
        </div>

        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The
            page might have been moved, deleted, or you entered an incorrect
            URL.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/blog">Browse Blog</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
