import React from "react";
import Link from "next/link";
import {
  Users,
  Newspaper,
  BookMarked,
  Calendar,
  TrendingUp,
} from "lucide-react";

function LeftDiv() {
  const navigationItems = [
    {
      icon: Users,
      label: "Find Friends",
      color: "text-blue-500",
      bgHover: "hover:bg-blue-50 dark:hover:bg-blue-500/10",
    },
    {
      icon: Newspaper,
      label: "Latest News",
      color: "text-purple-500",
      bgHover: "hover:bg-purple-50 dark:hover:bg-purple-500/10",
    },
    {
      icon: BookMarked,
      label: "Saved Posts",
      color: "text-pink-500",
      bgHover: "hover:bg-pink-50 dark:hover:bg-pink-500/10",
    },
    {
      icon: Calendar,
      label: "Events",
      color: "text-green-500",
      bgHover: "hover:bg-green-50 dark:hover:bg-green-500/10",
    },
    {
      icon: TrendingUp,
      label: "Trending",
      color: "text-orange-500",
      bgHover: "hover:bg-orange-50 dark:hover:bg-orange-500/10",
    },
  ];

  return (
    <div className="hidden lg:block sticky top-20 h-[calc(100vh-5rem)]">
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 space-y-8 shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Welcome Section */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Welcome
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Connect, Share, Grow Together
          </p>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-2">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 
                         ${item.bgHover} group hover:scale-105`}
            >
              <div
                className={`p-2 rounded-lg ${item.color} bg-gray-50 dark:bg-gray-800 
                             group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors`}
              >
                <item.icon className={`w-5 h-5`} />
              </div>
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* CTA Section */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <Link href="/signup" className="block">
            <button
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                             text-white font-semibold rounded-xl hover:opacity-90 transition-opacity
                             hover:shadow-lg hover:shadow-purple-500/20"
            >
              Get Started
            </button>
          </Link>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Join our growing community today
          </p>
        </div>
      </div>
    </div>
  );
}

export default LeftDiv;
