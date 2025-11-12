import { notFound } from "next/navigation";
import { connect } from "@/lib/mongodb/mongoose";
import Post from "@/lib/models/post.model";
import CommentsSection from "@/app/components/CommentsSection";
import ShareButtons from "@/app/components/ShareButtons";
import Image from "next/image";
import Footer from "@/app/components/Footer";

export async function generateMetadata({ params }) {
  await connect();

  // Await the params promise
  const { slug } = await params;

  const post = await Post.findOne({
    slug,
    published: true,
  }).select("title excerpt featuredImage category tags publishedAt author");

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  // Construct the full URL for this post
  const postUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"
  }/posts/${slug}`;

  // Default image fallback
  const defaultImage = {
    url: "/opengraph-image.png",
    width: 1200,
    height: 630,
    alt: `${post.title} - EleventhFactor Blog`,
  };

  // Use featured image if available, otherwise fallback
  const ogImage = post.featuredImage?.url
    ? {
        url: post.featuredImage.url,
        width: 1200,
        height: 630,
        alt: post.title,
      }
    : defaultImage;

  // Format published date for article metadata
  const publishedTime = post.publishedAt.toISOString();

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags?.join(", ") || "",

    // Open Graph for Facebook, LinkedIn, etc.
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: "TopBlog",
      images: [ogImage],
      type: "article",
      locale: "en_US",
      publishedTime: publishedTime,
      authors: [post.author],
      tags: post.tags || [],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage.url],
      creator: "@TopBlog", // Replace with your actual Twitter handle
      site: "@TopBlog", // Replace with your actual Twitter handle
    },

    // Additional meta tags
    alternates: {
      canonical: postUrl,
    },

    // Article-specific meta
    authors: [{ name: post.author }],
    category: post.category,

    // Robots meta
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Verification for search consoles (optional)
    verification: {
      google: "your-google-verification-code", // Add your Google Search Console code
      yandex: "your-yandex-verification-code", // Add if using Yandex
    },
  };
}

export default async function PostPage({ params }) {
  await connect();

  // Await the params promise
  const { slug } = await params;

  const post = await Post.findOne({
    slug,
    published: true,
  });

  if (!post) {
    notFound();
  }

  // Construct the full URL for sharing
  const postUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"
  }/posts/${slug}`;

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage?.url ? [post.featuredImage.url] : [],
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.publishedAt.toISOString(), // Update if you have modified date
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "TopBlog",
      logo: {
        "@type": "ImageObject",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"
        }/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    keywords: post.tags?.join(", ") || "",
    articleSection: post.category,
  };

  return (
    <>
      {/* Add structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen py-8 transition-colors duration-200 mt-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Image */}
          {post.featuredImage?.url && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg dark:shadow-gray-800/20">
              <Image
                src={post.featuredImage.url}
                alt={post.title}
                width={1200}
                height={630}
                className="w-full h-64 sm:h-96 object-cover"
                priority
              />
            </div>
          )}

          {/* Post Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4 flex-wrap">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                {post.category}
              </span>
              <span className="hidden sm:inline">•</span>
              <time dateTime={post.publishedAt.toISOString()}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="hidden sm:inline">•</span>
              <span>By {post.author}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className=" bg-sky-500 text-fuchsia-800 dark:bg-emerald-400 dark:text-blue-800 px-3 py-1 rounded-full text-sm border border-gray-200 dark:border-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Post Content */}
          <article
            className="prose prose-lg max-w-none mb-12 
          prose-headings:text-gray-900 prose-headings:dark:text-white
          prose-p:text-gray-700 prose-p:dark:text-gray-300
          prose-strong:text-gray-900 prose-strong:dark:text-white
          prose-em:text-gray-700 prose-em:dark:text-gray-300
          prose-blockquote:text-gray-600 prose-blockquote:dark:text-gray-400
          prose-blockquote:border-gray-300 prose-blockquote:dark:border-gray-600
          prose-ul:text-gray-700 prose-ul:dark:text-gray-300
          prose-ol:text-gray-700 prose-ol:dark:text-gray-300
          prose-li:text-gray-700 prose-li:dark:text-gray-300
          prose-code:text-gray-900 prose-code:dark:text-white
          prose-code:bg-gray-100 prose-code:dark:bg-gray-800
          prose-pre:bg-gray-900 prose-pre:dark:bg-gray-800
          prose-a:text-blue-600 prose-a:dark:text-blue-400
          prose-a:no-underline hover:prose-a:underline
          prose-hr:border-gray-300 prose-hr:dark:border-gray-600"
          >
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="leading-relaxed"
            />
          </article>

          {/* Share Section */}
          <ShareButtons url={postUrl} title={post.title} />

          {/* Comments Section */}
          <CommentsSection postSlug={slug} />
        </article>
      </div>
      <Footer />
    </>
  );
}
