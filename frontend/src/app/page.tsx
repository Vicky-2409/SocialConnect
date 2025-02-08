import React from "react";
import Navbar from "@/components/Navbar";
import Feed from "@/components/PublicFeed";
import LeftDiv from "@/components/LeftDiv";
import RightDiv from "@/components/RightDiv";

function SocialPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
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
    </div>
  );
}

export default SocialPage;
