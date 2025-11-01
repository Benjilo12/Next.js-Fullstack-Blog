"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { light, dark } from "@clerk/themes";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { ModeToggle } from "./ModeToggle";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import Link from "next/link";

export function Header() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Blog", link: "/blog" },
  ];

  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  // Determine active link styling - Fixed hydration issue
  const getLinkClasses = (link) => {
    const isActive = pathname === link || pathname === `${link}/`;
    if (isActive) {
      return "text-blue-600 dark:text-blue-500";
    }
    return "text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white";
  };

  return (
    <div className="relative w-full">
      <Navbar
        className="
          fixed top-0 left-0 w-full z-50 outline-none
           backdrop-blur-lg dark:bg-black
           transition-all duration-300 py-0
        "
      >
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <div className="flex items-center gap-4">
            {navItems.map((item, idx) => (
              <Link
                key={`nav-link-${idx}`}
                href={item.link}
                className={`px-4 py-2 rounded-md text-[14px]  font-medium transition ${getLinkClasses(
                  item.link
                )}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              className="py-1 w-12"
            />
            <NavbarButton variant="secondary">
              <ModeToggle />
            </NavbarButton>

            {/* Fixed Clerk buttons with theme support */}
            <SignedIn>
              <UserButton
                appearance={{
                  baseTheme: theme === "dark" ? dark : light,
                }}
                afterSignOutUrl="/"
              />
            </SignedIn>
            <SignedOut>
              <SignInButton
                mode="modal"
                appearance={{
                  baseTheme: theme === "dark" ? dark : light,
                }}
              />
            </SignedOut>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav className="z-50">
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            className="  backdrop-blur-lg dark:bg-black
          shadow-sm transition-all duration-300 py-0"
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative  text-neutral-600 dark:text-neutral-300 px-4 py-2 rounded-md text-sm font-medium transition ${getLinkClasses(
                  item.link
                )}`}
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}

            <div className="flex w-full flex-col gap-4 mt-4 pl-6.5">
              <ModeToggle className="" />

              {/* Mobile Clerk buttons */}
              <SignedIn className="w-full flex justify-center dark:bg-white text-black">
                <div className="flex flex-col items-center gap-2 mb-2 pr-59">
                  <UserButton
                    appearance={{
                      baseTheme: [light, dark],
                    }}
                    afterSignOutUrl="/"
                  />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton
                  mode="modal"
                  appearance={{
                    baseTheme: [light, dark],
                  }}
                ></SignInButton>
              </SignedOut>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
