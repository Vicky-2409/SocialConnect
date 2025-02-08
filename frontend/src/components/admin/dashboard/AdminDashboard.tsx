import React from "react";
import { LineChart } from "./LineChart";
import DashboardCardSection from "./DashboardCardSection";
import { PieChart } from "./PieChart";
import { ArrowUpRight } from "lucide-react";

function AdminDashboard() {
  return (
    <div className="min-h-screen">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Welcome back, Admin! Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-primary">
            <span>Real-time</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Metrics Cards Section */}
      <div className="mb-8">
        <DashboardCardSection />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Growth Trends
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              User activity over time
            </p>
          </div>
          <div className="aspect-[4/3]">
            <LineChart />
          </div>
        </div>

        {/* Pie Chart Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Distribution Analysis
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Breakdown of key metrics
            </p>
          </div>
          <div className="aspect-[4/3]">
            <PieChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
