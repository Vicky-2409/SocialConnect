import React from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/feed/BottomNav";
import SideBar from "@/components/feed/SideBar";
import { Loader2 } from "lucide-react";

const UserLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50">
        <div className="bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-100">
          <Navbar />
        </div>
      </div>

      {/* Main Content */}
      {/* <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> */}
      <div className="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="sticky top-20 hidden h-[calc(100vh-2rem)] w-72 md:block overflow-y-auto">
            <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg shadow-gray-100/50 transition-all duration-300 hover:shadow-xl">
              <SideBar />
            </div>
          </aside>

          {/* Main Feed */}
          <main className="flex-grow space-y-6">
            <div className="min-h-[calc(100vh-8rem)] rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg shadow-gray-100/50 transition-all duration-300">
              <React.Suspense
                fallback={
                  <div className="flex h-96 items-center justify-center">
                    <div className="relative">
                      <div className="absolute -inset-4 rounded-full bg-blue-50 animate-pulse"></div>
                      <Loader2 className="relative h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  </div>
                }
              >
                {children}
              </React.Suspense>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-80 space-y-6 lg:block"></aside>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white/70 backdrop-blur-md border-t border-gray-100 shadow-lg shadow-gray-100/50">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
