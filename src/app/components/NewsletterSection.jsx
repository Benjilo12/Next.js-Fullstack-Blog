"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, Bell } from "lucide-react";
import Image from "next/image";

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call with timeout
    setTimeout(() => {
      setIsLoading(false);
      setShowNotification(true);
      setEmail("");
      console.log("Newsletter subscription:", email);
    }, 1500);
  };

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  return (
    <div className="relative font-sans w-full min-h-[400px] flex items-center justify-center overflow-hidden p-4 bg-white dark:bg-black transition-colors duration-300">
      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-4 right-4 z-50 max-w-sm w-full"
          >
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <Bell className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-green-800 dark:text-green-200">
                    Successfully Subscribed!
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    You&apos;ll receive our latest updates soon.
                  </p>
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="shrink-0 text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10 container mx-auto text-center max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-gray-800 dark:text-white"
          variants={itemVariants}
        >
          Stay Updated with Our Latest Posts
        </motion.h2>

        {/* Description */}
        <motion.p
          className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Get the latest tech insights, startup stories, and career
          opportunities delivered straight to your inbox.
        </motion.p>

        {/* Newsletter Form */}
        <motion.form
          className="mt-10 max-w-lg mx-auto"
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          <div className="relative flex flex-col sm:flex-row items-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-gray-200/80 dark:border-gray-700/80 group focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-black transition-all duration-300">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 hidden sm:block" />

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Your Email Address"
              className="w-full sm:w-auto grow bg-transparent sm:pl-12 px-4 py-3 text-gray-700 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-none text-center sm:text-left rounded-lg"
              required
              disabled={isLoading}
            />

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full sm:w-auto mt-2 sm:mt-0 px-6 py-3 bg-blue-600 dark:bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors duration-300 shadow-md flex items-center justify-center gap-2 min-w-[120px] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </motion.button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-red-600 dark:text-red-400 mt-2"
            >
              {error}
            </motion.p>
          )}
        </motion.form>

        {/* Social Proof */}
        <motion.div
          className="mt-8 flex items-center justify-center space-x-3"
          variants={itemVariants}
        >
          <div className="flex -space-x-2">
            <Image
              width={32}
              height={32}
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
              src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User 1"
            />
            <Image
              width={32}
              height={32}
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
              src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User 2"
            />
            <Image
              width={32}
              height={32}
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
              alt="User 3"
            />
          </div>

          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              100+
            </span>{" "}
            readers already subscribed
          </p>
        </motion.div>

        {/* Privacy Note */}
        <motion.p
          className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 leading-relaxed"
          variants={itemVariants}
        >
          No spam ever. Unsubscribe at any time.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default function NewsletterSection() {
  return <Newsletter />;
}
