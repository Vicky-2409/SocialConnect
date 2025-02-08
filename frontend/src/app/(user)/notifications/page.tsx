import NotificationBar from "@/components/notifications/NotificationBar";
import React from "react";

function NotificationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 mb-4 py-3 px-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Notifications
              </h1>
            </div>
          </div>

          {/* Notifications Content */}
          <div className="max-w-3xl mx-auto space-y-2">
            <NotificationBar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
