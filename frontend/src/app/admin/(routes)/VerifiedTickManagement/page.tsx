import React from "react";
import { Zap } from "lucide-react";
import WeNetTickManagementTable from "@/components/admin/weNetTickManagement/WeNetTickManagementTable";

const TickManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl shadow-sm">
              <Zap className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Verified Tick Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Efficiently manage and monitor your network tickets
              </p>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <WeNetTickManagementTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TickManagement;
