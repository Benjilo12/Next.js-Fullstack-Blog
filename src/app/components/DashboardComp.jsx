"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Users, FileText, ArrowUp, Eye, Calendar } from "lucide-react";
import Image from "next/image";

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            limit: 5,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            limit: 5,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (user?.publicMetadata?.isAdmin) {
      fetchUsers();
      fetchPosts();
    }
  }, [user]);

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen w-full max-w-7xl mx-auto mt-10">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs lg:text-sm">
          Welcome back! Here&apos;s what&apos;s happening with your blog.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Total Users Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
                TOTAL USERS
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {totalUsers}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Last month
                  </span>
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <ArrowUp className="w-3 h-3" />
                  <span className="text-xs font-medium">+{lastMonthUsers}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Active members
              </p>
            </div>
            <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-xl p-3">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Posts Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
                TOTAL POSTS
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {totalPosts}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Last month
                  </span>
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <ArrowUp className="w-3 h-3" />
                  <span className="text-xs font-medium">+{lastMonthPosts}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Published content
              </p>
            </div>
            <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-xl p-3">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Recent Users
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Newly registered members
                </p>
              </div>
              <Link href="/dashboard?tab=users">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-xs font-medium">
                  <Eye className="w-3 h-3" />
                  View All
                </button>
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[300px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white text-xs">
                    User
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white text-xs">
                    Username
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 dark:border-gray-600 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Image
                          src={user.profilePicture}
                          alt="user"
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {user.username}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Posts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Recent Posts
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Latest published content
                </p>
              </div>
              <Link href="/dashboard?tab=posts">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-xs font-medium">
                  <Eye className="w-3 h-3" />
                  View All
                </button>
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white text-xs">
                    Post
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white text-xs">
                    Title
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white text-xs">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post._id}
                    className="border-b border-gray-100 dark:border-gray-600 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-3">
                      <Image
                        src={post.image}
                        alt="post"
                        width={48}
                        height={32}
                        className="w-12 h-8 rounded bg-gray-300 dark:bg-gray-600 object-cover"
                      />
                    </td>
                    <td className="p-3">
                      <div
                        className="max-w-[100px] lg:max-w-[120px] truncate font-medium text-gray-900 dark:text-white text-xs"
                        title={post.title}
                      >
                        {post.title}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {posts.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No posts found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
