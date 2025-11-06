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
    <div className="p-6 lg:p-8 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen  min-w-[90vw] mt-10 ">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm lg:text-base">
          Welcome back! Here&pos;s what&apos;s happening with your blog.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Users Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">
                TOTAL USERS
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {totalUsers}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Last month
                  </span>
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+{lastMonthUsers}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Active members
              </p>
            </div>
            <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl p-4">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Total Posts Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">
                TOTAL POSTS
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {totalPosts}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Last month
                  </span>
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+{lastMonthPosts}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Published content
              </p>
            </div>
            <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Recent Users
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Newly registered members
                </p>
              </div>
              <Link href="/dashboard?tab=users">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  View All
                </button>
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white text-sm">
                    User
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white text-sm">
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
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={user.profilePicture}
                          alt="user"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.username}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Posts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Recent Posts
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Latest published content
                </p>
              </div>
              <Link href="/dashboard?tab=posts">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  View All
                </button>
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white text-sm">
                    Post
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white text-sm">
                    Title
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white text-sm">
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
                    <td className="p-4">
                      <Image
                        src={post.image}
                        alt="post"
                        width={56}
                        height={40}
                        className="w-14 h-10 rounded-lg bg-gray-300 dark:bg-gray-600 object-cover"
                      />
                    </td>
                    <td className="p-4">
                      <div
                        className="max-w-[150px] lg:max-w-[200px] truncate font-medium text-gray-900 dark:text-white text-sm"
                        title={post.title}
                      >
                        {post.title}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {posts.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No posts found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
