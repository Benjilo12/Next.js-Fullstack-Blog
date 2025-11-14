// app/about/page.js
import Image from "next/image";
import Footer from "../components/Footer";
import Link from "next/link";

export const metadata = {
  title: "About TopBlog - Our Story & Mission",
  description:
    "Learn about TopBlog's mission to empower writers and creators. Discover our story, values, and the team behind Africa's fastest-growing blogging platform.",
  keywords: [
    "about TopBlog",
    "blogging platform",
    "writing community",
    "content creators",
    "African bloggers",
    "storytelling platform",
    "digital publishing",
  ],
  openGraph: {
    title: "About TopBlog - Our Story & Mission",
    description:
      "Learn about TopBlog's mission to empower writers and creators in Africa and beyond.",
    url: "/about",
    siteName: "TopBlog",
    type: "website",
    images: [
      {
        url: "/Topz.png",
        width: 1200,
        height: 630,
        alt: "About TopBlog - Empowering Writers and Creators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About TopBlog - Our Story & Mission",
    description:
      "Learn about TopBlog's mission to empower writers and creators.",
    images: ["/Topz.png"],
  },
};

// Structured data for About page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About TopBlog",
  description:
    "TopBlog is a modern blogging platform empowering writers and content creators across Africa and beyond.",
  url: "/about",
  publisher: {
    "@type": "Organization",
    name: "TopBlog",
    description: "Premium blogging platform for content creators",
    url: "https://www.topblog.com",
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "TopBlog Team",
    },
  },
};

export default function About() {
  return (
    <>
      {/* Add structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-gray-100">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Empowering{" "}
                  <span className="text-blue-600 dark:text-emerald-400">
                    Writers
                  </span>{" "}
                  Across Africa
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                  TopBlog is more than just a platform—it&apos;s a movement to
                  amplify African voices, share unique stories, and build a
                  community of passionate writers and readers.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-emerald-400">
                      2+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Active Writers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-emerald-400">
                      30+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Blog Posts
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-emerald-400">
                      200+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Monthly Readers
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl dark:shadow-gray-800/20">
                  <Image
                    src="/about1.jpg"
                    alt="TopBlog community of writers and readers"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-600 dark:bg-emerald-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-400 dark:bg-emerald-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission & Vision
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                We believe every voice deserves to be heard and every story
                deserves an audience.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Empower Writers
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Provide intuitive tools and platforms for African writers to
                  share their stories with the world.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Build Community
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Foster a supportive community where writers can connect,
                  collaborate, and grow together.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Amplify Voices
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ensure African stories and perspectives reach global audiences
                  through modern technology.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Story Image */}
              <div className="relative order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-lg dark:shadow-gray-800/20">
                      <Image
                        src="/about2.jpg"
                        alt="TopBlog team collaboration"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-lg dark:shadow-gray-800/20">
                      <Image
                        src="/about3.jpg"
                        alt="Writer using TopBlog platform"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-lg dark:shadow-gray-800/20">
                      <Image
                        src="/about4.jpg"
                        alt="TopBlog community event"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-lg dark:shadow-gray-800/20">
                      <Image
                        src="/about5.jpg"
                        alt="Successful blogger celebration"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Content */}
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>
                    Founded in 2024, TopBlog emerged from a simple observation:
                    African writers faced significant barriers in sharing their
                    stories with the world. Existing platforms often overlooked
                    the unique needs and perspectives of African content
                    creators.
                  </p>
                  <p>
                    Our journey began with a small team of passionate
                    developers, writers, and designers who believed in the power
                    of storytelling to bridge cultures and inspire change. We
                    started by listening to writers across the continent,
                    understanding their challenges, and dreaming of a platform
                    built specifically for them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Values
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                These principles guide everything we do at TopBlog
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Authenticity",
                  description:
                    "We celebrate genuine stories and authentic voices from across Africa.",
                  icon: "🎯",
                },
                {
                  title: "Innovation",
                  description:
                    "We continuously evolve our platform with cutting-edge features for writers.",
                  icon: "💡",
                },
                {
                  title: "Community",
                  description:
                    "We believe in the power of collaboration and mutual support among writers.",
                  icon: "🤝",
                },
                {
                  title: "Excellence",
                  description:
                    "We strive for the highest quality in both our platform and the content we host.",
                  icon: "⭐",
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-gray-800/20 border border-gray-200 dark:border-gray-700 text-center hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="text-3xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Share Your Story?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of writers who are already building their audience
              and making their mark with TopBlog.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="inline-block px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-lg transition-colors duration-200"
              >
                Explore Blogs
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
