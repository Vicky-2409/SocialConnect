"use client";
import React, { useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSideBar from "@/components/admin/AdminSideBar";
import { Menu, X } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar with Blur Effect */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
        <AdminNavbar />
      </div>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        <div
          className={`
          fixed inset-0 z-50 md:hidden
          transition-opacity duration-300 ease-in-out
          ${isMobileNavOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-800/60 backdrop-blur-sm"
            onClick={() => setIsMobileNavOpen(false)}
          />

          {/* Mobile Sidebar */}
          <div
            className={`
            absolute left-0 top-0 bottom-0 w-64
            bg-white dark:bg-gray-900 
            border-r border-gray-200 dark:border-gray-800
            transform transition-transform duration-300 ease-in-out
            ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          >
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <AdminSideBar />
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 h-[calc(100vh-4rem)] sticky top-16">
          <div className="h-full overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg scrollbar-hide">
            <AdminSideBar />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="md:hidden fixed bottom-6 right-6 p-3 bg-primary rounded-full shadow-lg z-40 
                     text-white hover:bg-primary/90 transition-all duration-200 
                     active:transform active:scale-95"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="p-6">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
