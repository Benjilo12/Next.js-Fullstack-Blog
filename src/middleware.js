// middleware.js (or move to src/middleware.js if needed)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard/(.*)",
  "/api/posts/(.*)", // Protect POST, PUT, DELETE operations
]);

const isPublicApiRoute = createRouteMatcher([
  "/api/posts", // GET requests should be public
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect the specified routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // For API posts route, only protect non-GET methods
  if (req.nextUrl.pathname.startsWith("/api/posts")) {
    if (req.method !== "GET") {
      await auth.protect();
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
