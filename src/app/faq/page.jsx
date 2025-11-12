import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "../components/Footer";

// Define metadata
export const metadata = {
  title: "Frequently Asked Questions - TopBlog",
  description:
    "Find answers to common questions about using TopBlog. Learn how to create an account, write blog posts, customize your blog, and more.",
  keywords: [
    "FAQ",
    "frequently asked questions",
    "TopBlog help",
    "blogging questions",
    "account setup",
    "blog customization",
    "writing posts",
    "following bloggers",
    "password reset",
  ],
  openGraph: {
    title: "Frequently Asked Questions - TopBlog",
    description:
      "Find answers to common questions about using TopBlog. Get help with account setup, writing posts, and blog customization.",
    url: "/faq",
    siteName: "TopBlog",
    type: "website",
    images: [
      {
        url: "/og-faq-image.png", // Create this image for better social sharing
        width: 1200,
        height: 630,
        alt: "TopBlog FAQ - Frequently Asked Questions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions - TopBlog",
    description:
      "Find answers to common questions about using TopBlog. Get help with account setup and blog management.",
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
    canonical: "/faq",
  },
};

const faqItems = [
  {
    question: "How do I create an account on TopBlog?",
    answer:
      "To create an account, click on the 'Sign Up' button in the top right corner of the page. You'll need to provide your email address, choose a username, and create a password. After verifying your email, your account will be ready to use.",
  },
  {
    question: "Is TopBlog free to use?",
    answer:
      "Yes, TopBlog is completely free to use for all readers. We may introduce premium features in the future, but the core blogging platform will always remain free.",
  },
  {
    question: "How can I start writing my own blog posts?",
    answer:
      "Once you're logged in, click on your profile picture in the top right corner and select 'New Post' from the dropdown menu. This will open our editor where you can compose and format your blog post.",
  },
  {
    question: "Can I customize the appearance of my blog?",
    answer:
      "Yes! We offer several customization options including themes, fonts, and layout choices. You can access these options in your account settings under 'Blog Appearance'.",
  },
  {
    question: "How do I follow other bloggers?",
    answer:
      "When viewing another blogger's profile or post, click the 'Follow' button on their profile. You'll then see their new posts in your feed.",
  },
  {
    question: "What should I do if I forget my password?",
    answer:
      "Click on 'Forgot Password' on the login page. Enter your email address and we'll send you a link to reset your password. Make sure to check your spam folder if you don't see our email.",
  },
];

// Structured data for FAQ schema
const structuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item, index) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

function FaqPage() {
  return (
    <>
      {/* Add structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-white text-gray-800 dark:bg-black dark:text-gray-100 mt-16">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-primary dark:text-emerald-400">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about using TopBlog. Can&apos;t
              find what you&apos;re looking for?{" "}
              <a
                href="/contact"
                className="text-sky-500 dark:text-emerald-400 hover:underline"
              >
                Contact our support team
              </a>
              .
            </p>
          </div>

          <div>
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg px-6 overflow-hidden bg-white dark:bg-gray-800"
                >
                  <AccordionTrigger className="hover:no-underline  dark:hover:bg-gray-750 py-4">
                    <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200 text-left">
                      {item.question}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-gray-600 dark:text-gray-300">
                    <p>{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-medium mb-4 dark:text-gray-300">
              Still have questions?
            </h3>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FaqPage;
