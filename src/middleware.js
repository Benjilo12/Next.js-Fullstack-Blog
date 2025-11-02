// middleware.js
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard/(.*)",
  "/admin(.*)", // Protect admin routes
]);

const isPublicApiRoute = createRouteMatcher([
  "/api/posts(.*)", // All posts API routes should be public for GET requests
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect the specified routes (dashboard, admin, etc.)
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // For API posts routes, only protect non-GET methods (POST, PUT, DELETE)
  if (req.nextUrl.pathname.startsWith("/api/posts")) {
    // Allow all GET requests without authentication
    if (req.method === "GET") {
      return; // No protection needed for GET requests
    }

    // Protect all other methods (POST, PUT, DELETE, etc.)
    await auth.protect();
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
