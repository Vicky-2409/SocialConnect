import React from "react";
import { Menu, Search, Bell, Settings, User } from "lucide-react";
function AdminNavbar() {
  return (
    <nav
      className="sticky top-0 z-50 bg-white/80 dark:bg-[#1E2738]/80 
                    backdrop-blur-xl 
                    border-b border-gray-200/50 dark:border-gray-800/50 
                    flex items-center justify-between px-4 md:px-8 py-3 w-full"
    >
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <h1
            className="text-xl font-semibold 
                         text-gray-800 dark:text-gray-100 
                         hidden md:block 
                         tracking-tight"
          >
            Admin Portal
          </h1>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        <button
          className="p-2 rounded-full 
                           hover:bg-gray-100 dark:hover:bg-gray-800 
                           relative 
                           transition-colors duration-300"
        >
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span
            className="absolute top-0 right-0 h-2.5 w-2.5 
                           bg-red-500 rounded-full 
                           animate-pulse"
          ></span>
        </button>

        <button
          className="p-2 rounded-full 
                           hover:bg-gray-100 dark:hover:bg-gray-800 
                           transition-colors duration-300"
        >
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 
                          rounded-full flex items-center justify-center 
                          shadow-md"
          >
            <User className="h-5 w-5 text-white" />
          </div>
          <span
            className="text-sm font-medium 
                           text-gray-800 dark:text-gray-100 
                           hidden md:block 
                           tracking-tight"
          >
            Admin
          </span>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
