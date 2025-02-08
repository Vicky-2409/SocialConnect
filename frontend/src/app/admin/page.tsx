"use client";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import React from "react";
import { motion } from "framer-motion";

const adminPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AdminNavbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            type: "spring",
            damping: 10,
            stiffness: 100,
          }}
          className="w-full max-w-md"
        >
          <div
            className="bg-white/80 dark:bg-gray-800/80 
                          backdrop-blur-xl 
                          rounded-3xl 
                          shadow-2xl 
                          border border-gray-200/50 dark:border-gray-700/50 
                          overflow-hidden"
          >
            {/* Gradient Header */}
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 
                            h-1 w-full"
            ></div>

            <div className="p-8 space-y-6">
              {/* Welcome Header */}
              <div className="text-center">
                <h1
                  className="text-4xl font-bold 
                               bg-gradient-to-r from-indigo-600 to-purple-600 
                               bg-clip-text text-transparent
                               mb-4"
                >
                  Welcome Back
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Sign in to access your admin dashboard
                </p>
              </div>

              {/* Login Form Container */}
              <div className="space-y-6">
                <AdminLoginForm />
              </div>
            </div>
          </div>

          {/* Subtle Background Decoration */}
          <div
            className="absolute inset-0 -z-10 
                          bg-dot-pattern opacity-10 
                          pointer-events-none"
          ></div>
        </motion.div>
      </div>
    </div>
  );
};

export default adminPage;
