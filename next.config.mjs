// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/benjiblog/**",
      },
      // Clerk configurations - comprehensive coverage
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "*.clerk.com",
      },
      {
        protocol: "https",
        hostname: "*.clerk.dev",
      },
      // Gravatar configurations
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        port: "",
        pathname: "/avatar/**",
      },
      {
        protocol: "https",
        hostname: "gravatar.com",
        port: "",
        pathname: "/avatar/**",
      },
      // Placeholder for fallback avatars
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;
