import React from "react";
import Navbar from "@/components/Navbar";
import Feed from "@/components/PublicFeed";
import LeftDiv from "@/components/LeftDiv";
import RightDiv from "@/components/RightDiv";
import Link from "next/link";

function SocialPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 mb-16 md:mb-6">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Left Sidebar - Hidden on mobile, 3 columns on medium screens, 3 columns on large screens */}
          <div className="hidden md:block md:col-span-3 lg:col-span-3">
            <div className="sticky top-6">
              <LeftDiv />
            </div>
          </div>

          {/* Main Feed - 12 columns on mobile, 9 columns on medium screens, 6 columns on large screens */}
          <div className="col-span-12 md:col-span-9 lg:col-span-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-6">
              <Feed />
            </div>
          </div>

          {/* Right Sidebar - Hidden on mobile and medium screens, 3 columns on large screens */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-6">
              <RightDiv />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg md:hidden">
        <div className="flex justify-between items-center px-4 py-3">
          <Link
            href="/login"
            className="w-1/2 mr-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="w-1/2 ml-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-center"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SocialPage;
