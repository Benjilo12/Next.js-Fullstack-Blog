"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import DashSidebar from "./DashSidebar";

import { Menu, X } from "lucide-react";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPost";
import DashCreate from "../components/DashCreate";
import DashComments from "../components/DashComments"; // Add this import
import DashboardComp from "../components/DashboardComp";

export default function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const [tab, setTab] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else {
      setTab(user?.publicMetadata?.isAdmin ? "dash" : "profile");
    }
  }, [searchParams, user]);

  // Close sidebar when tab changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [tab]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-20 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          )}
        </button>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30 mt-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-40 w-72
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
            mt-16 md:mt-0
          `}
        >
          <DashSidebar currentTab={tab} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="w-full h-full">
            {tab === "profile" && <DashProfile />}
            {tab === "posts" && <DashPosts />}
            {tab === "create" && <DashCreate />}
            {tab === "comments" && <DashComments />} {/* Add this line */}
            {(tab === "dash" || !tab) && user?.publicMetadata?.isAdmin && (
              <DashboardComp />
            )}
            {(tab === "dash" || !tab) && !user?.publicMetadata?.isAdmin && (
              <DashProfile />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
