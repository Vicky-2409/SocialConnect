import React from "react";
import AdminDashboard from "@/components/admin/dashboard/AdminDashboard";

const dashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <AdminDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default dashboardPage;
