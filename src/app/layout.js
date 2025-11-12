import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/context/theme-provider";
import { Header } from "./components/Header";
import { ClerkProvider } from "@clerk/nextjs";
// Import from @clerk/nextjs instead of @clerk/themes
import { light, dark } from "@clerk/themes";
import localFont from "next/font/local";

const Jakarta = localFont({
  src: "./fonts/Jakarta.woff2",
  variable: "--font-jakarta",
  weights: ["100 900"],
});

const siteUrl = "https://www.eleventhfactor.com";
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TopBlog",
    template: "%s | TopBlog",
  },
  description:
    "TopBlog - Your go-to source for the latest articles, insights, and trends in technology, lifestyle, and more.",
  keywords: ["blog", "articles", "technology", "lifestyle", "news", "Startups"],
  robots: {
    index: true, // ✅ IMPORTANT: Explicitly allow indexing
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "TopBlog",
    title: "TopBlog",
    description:
      "TopBlog - Your go-to source for the latest articles, insights, and trends in technology, lifestyle, and more.",
    images: [
      {
        url: "/Topz.png",
        width: 1200,
        height: 630,
        alt: "TopBlog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TopBlog",
    description:
      "TopBlog - Your go-to source for the latest articles, insights, and trends in technology, lifestyle, and more.",
    images: ["/Topz.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    // Move ClerkProvider inside ThemeProvider
    <html lang="en" suppressHydrationWarning>
      <body className={`${Jakarta.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            appearance={{
              baseTheme: light, // Default theme
            }}
          >
            <Header />
            {children}
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
