// app/contact/page.js
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

export const metadata = {
  title: "Contact Us - TopBlog",
  description:
    "Get in touch with TopBlog team. We're here to help with technical support, feature requests, billing questions, and general inquiries about our blogging platform.",
  keywords: [
    "contact TopBlog",
    "blogging support",
    "technical help",
    "feature request",
    "billing questions",
    "blog platform contact",
    "customer support",
    "help center",
  ],
  openGraph: {
    title: "Contact Us - TopBlog",
    description:
      "Get in touch with TopBlog team. We're here to help with your blogging journey and answer any questions you may have.",
    url: "/contact",
    siteName: "TopBlog",
    type: "website",
    images: [
      {
        url: "Topz.png",
        width: 1200,
        height: 630,
        alt: "Contact TopBlog - Get Help with Your Blogging Journey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - TopBlog",
    description:
      "Get in touch with TopBlog team. We're here to help with your blogging journey.",
    images: ["/Topz.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/contact",
  },
};

// Client component for the form

// Structured data for contact page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact TopBlog",
  description:
    "Contact the TopBlog team for support, feature requests, and general inquiries about our blogging platform.",
  url: "/contact",
  mainEntity: {
    "@type": "Organization",
    name: "TopBlog",
    email: "support@topblog.com",
    url: "https://www.topblog.com",
    description: "Premium blogging platform for content creators and writers",
  },
};

export default function Contact() {
  return (
    <>
      {/* Add structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-gray-100 mt-16">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Get In Touch
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have questions about TopBlog? We&apos;d love to hear from you.
              Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-gray-800/20 p-8 border border-gray-200 dark:border-gray-800">
            <ContactForm />
          </div>

          {/* Additional Contact Information */}
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Email Us
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                support@topblog.com
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Visit Us
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                123 Blog Street, Digital City
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Response Time
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Within 24 hours
              </p>
            </div>
          </div>

          {/* FAQ Call-to-Action */}
          <div className="mt-12 text-center p-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Check out our Frequently Asked Questions for instant answers to
              common questions about account setup, blog customization, and
              more.
            </p>
            <a
              href="/faq"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-emerald-500 dark:hover:bg-emerald-600 font-medium"
            >
              Visit FAQ Page
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
