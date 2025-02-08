import React from "react";
import Link from "next/link";
import { TrendingUp, Globe2, Camera, Flame, Users } from "lucide-react";

function RightDiv() {
  const trendingTopics = [
    {
      icon: Flame,
      label: "Technology",
      posts: "125K posts",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-500/10",
    },
    {
      icon: Globe2,
      label: "Travel",
      posts: "98K posts",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      icon: Camera,
      label: "Photography",
      posts: "76K posts",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-500/10",
    },
  ];

  return (
    <div className="hidden lg:block sticky top-20 h-[calc(100vh-5rem)]">
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Trending Now
            </h3>
          </div>
        </div>

        {/* Trending Topics */}
        <div className="p-6 space-y-4">
          {trendingTopics.map((topic, index) => (
            <button
              key={index}
              className="w-full p-4 rounded-xl hover:scale-105 transition-all duration-200 group"
            >
              <div
                className={`flex items-start gap-3 ${topic.bgColor} p-3 rounded-xl`}
              >
                <div className={`${topic.color} mt-1`}>
                  <topic.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {topic.label}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {topic.posts}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Stats Section */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <p className="text-2xl font-bold text-blue-500">2M+</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Active Users
              </p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <p className="text-2xl font-bold text-purple-500">500K+</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Daily Posts
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <Link href="/login" className="block">
              <button
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
                               text-white font-semibold rounded-xl hover:opacity-90 transition-all
                               hover:shadow-lg hover:shadow-purple-500/20"
              >
                Login Now
              </button>
            </Link>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightDiv;
