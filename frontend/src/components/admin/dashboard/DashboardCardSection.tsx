"use client";
import React, { useEffect, useState } from "react";
import userService from "@/utils/apiCalls/admin/userService";
import postService from "@/utils/apiCalls/admin/postService";
import {
  Users,
  FileText,
  AlertTriangle,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";

interface DashboardData {
  totalUsers: number | null;
  totalPosts: number | null;
  totalReports: number | null;
  totalVerifiedAccounts: number | null;
}

const DASHBOARD_ITEMS = [
  {
    id: "users",
    text: "Total Users",
    href: "/admin/usermanagement",
    icon: Users,
    getValue: (data: DashboardData) => data.totalUsers,
    bgGradient: "from-blue-500 to-blue-600",
  },
  {
    id: "posts",
    text: "Total Posts",
    href: "",
    icon: FileText,
    getValue: (data: DashboardData) => data.totalPosts,
    bgGradient: "from-green-500 to-green-600",
  },
  {
    id: "reports",
    text: "Total Reports",
    href: "/admin/reportManagement",
    icon: AlertTriangle,
    getValue: (data: DashboardData) => data.totalReports,
    bgGradient: "from-orange-500 to-orange-600",
  },
  {
    id: "verified",
    text: "Total Verified Accounts",
    href: "/admin/VerifiedTickManagement",
    icon: BadgeCheck,
    getValue: (data: DashboardData) => data.totalVerifiedAccounts,
    bgGradient: "from-purple-500 to-purple-600",
  },
];

function DashboardCardSection() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalUsers: null,
    totalPosts: null,
    totalReports: null,
    totalVerifiedAccounts: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      setError("");

      try {
        const [totalUsers, totalVerifiedAccounts] =
          await userService.getDashboardCardData();
        const [totalPosts, totalReports] =
          await postService.getDashboardCardData();

        setDashboardData({
          totalUsers,
          totalPosts,
          totalReports,
          totalVerifiedAccounts,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setError(errorMessage);
        console.error("Dashboard data fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="flex items-center space-x-3 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">Error loading dashboard data</p>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {DASHBOARD_ITEMS.map((item) => (
        <div
          key={item.id}
          className="transition-all duration-300 hover:transform hover:translate-y-[-4px]"
        >
          {isLoading ? (
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm">
              <div className="animate-pulse space-y-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-2">
                  <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          ) : (
            <a
              href={item.href}
              className="block rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm
                       hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {item.text}
                  </p>
                  <div className="mt-2">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat().format(
                        item.getValue(dashboardData) ?? 0
                      )}
                    </h3>
                  </div>
                </div>
                <div
                  className={`rounded-lg bg-gradient-to-r ${item.bgGradient} p-3`}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

export default DashboardCardSection;
