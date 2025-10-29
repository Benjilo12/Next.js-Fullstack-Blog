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

export const metadata = {
  title: "Cabin Booking Dashboard",
  description: "Manage cabin reservations efficiently.",
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
