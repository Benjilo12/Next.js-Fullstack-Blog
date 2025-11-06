"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  FileText,
  LogOut,
  Crown,
  Plus,
  MessageSquare,
} from "lucide-react";

export default function DashSidebar({ currentTab }) {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) {
    return null;
  }

  const isAdmin = user?.publicMetadata?.isAdmin;
  const tab = currentTab || "dash";

  const menuItems = [
    ...(isAdmin
      ? [
          {
            key: "dash",
            href: "/dashboard?tab=dash",
            icon: LayoutDashboard,
            label: "Dashboard",
            active: tab === "dash" || !tab,
          },
        ]
      : []),
    {
      key: "profile",
      href: "/dashboard?tab=profile",
      icon: User,
      label: "Profile",
      active: tab === "profile",
      badge: isAdmin ? "Admin" : "User",
    },
    ...(isAdmin
      ? [
          {
            key: "posts",
            href: "/dashboard?tab=posts",
            icon: FileText,
            label: "Posts",
            active: tab === "posts",
          },
          {
            key: "create",
            href: "/dashboard?tab=create",
            icon: Plus,
            label: "Create",
            active: tab === "create",
          },
          {
            key: "comments",
            href: "/dashboard?tab=comments",
            icon: MessageSquare,
            label: "Comments",
            active: tab === "comments",
          },
        ]
      : []),
  ];

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl overflow-y-auto">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 dark:text-white truncate text-lg">
              {user?.firstName || user?.username}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Crown
                className={`w-4 h-4 ${
                  isAdmin ? "text-yellow-500" : "text-gray-400"
                }`}
              />
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  isAdmin
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                }`}
              >
                {isAdmin ? "Administrator" : "User"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.key} href={item.href}>
            <div
              className={`
              group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer
              ${
                item.active
                  ? "bg-blue-50 border-2 border-blue-200 shadow-md dark:bg-blue-900/30 dark:border-blue-700"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600"
              }
            `}
            >
              <div
                className={`
                p-3 rounded-xl transition-all duration-200 shrink-0
                ${
                  item.active
                    ? "bg-blue-100 text-blue-600 shadow-sm dark:bg-blue-800 dark:text-blue-300"
                    : "bg-gray-100 text-gray-600 group-hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-gray-700"
                }
              `}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 flex items-center justify-between min-w-0">
                <span
                  className={`
                  font-semibold truncate
                  ${
                    item.active
                      ? "text-blue-900 dark:text-blue-100"
                      : "text-gray-900 dark:text-gray-100"
                  }
                `}
                >
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={`
                    text-xs font-bold px-3 py-1.5 rounded-full border-2 shrink-0 ml-2
                    ${
                      item.active
                        ? "bg-blue-200 text-blue-800 border-blue-300 dark:bg-blue-700 dark:text-blue-200 dark:border-blue-600"
                        : "bg-gray-200 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                    }
                  `}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              {item.active && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-8 bg-blue-500 rounded-full dark:bg-blue-400" />
                </div>
              )}
            </div>
          </Link>
        ))}

        {/* Sign Out Button */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <SignOutButton>
            <div className="w-full group flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-red-200 dark:hover:border-red-800">
              <div className="p-3 rounded-xl bg-red-100 text-red-600 group-hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-all duration-200 shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <span className="font-semibold text-red-700 dark:text-red-300 group-hover:text-red-800 dark:group-hover:text-red-200">
                  Sign Out
                </span>
              </div>
            </div>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
