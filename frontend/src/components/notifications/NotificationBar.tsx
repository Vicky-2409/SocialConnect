"use client";
import React, { useEffect, useState } from "react";
import SingleNotification from "./SingleNotification";
import notificationService from "@/utils/apiCalls/notificationService";
import { useNotificationSocket } from "../redux/notificationSocketProvider";
import { Loader2 } from "lucide-react";

function NotificationBar() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const socket = useNotificationSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data: any) => {
      console.log("new-notification event received:", data);
      setNotifications((prev) => {
        if (!prev) return [data];

        // Prevent duplicate notifications
        const isDuplicate = prev.some(
          (notification) => notification._id === data._id
        );
        if (isDuplicate) return prev;

        return [data, ...prev];
      });
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [socket]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await notificationService.getNotifications();
        setNotifications(data);
      } catch (error: any) {
        setError(error.message || "Failed to fetch notifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-3">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center space-y-3">
          <p className="text-lg text-gray-600">No notifications yet</p>
          <p className="text-sm text-gray-500">
            When you receive notifications, they'll show up here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => {
        const {
          _id,
          doneByUser,
          notificationMessage,
          entityType,
          entityId,
          updatedAt,
        } = notification;
        const { username, firstName, lastName, profilePicUrl } = doneByUser;

        return (
          <div key={_id} className="transition-all duration-300 animate-fadeIn">
            <SingleNotification
              username={username}
              firstName={firstName}
              lastName={lastName}
              profilePicUrl={profilePicUrl}
              notificationMessage={notificationMessage}
              entityType={entityType}
              entityId={entityId}
              updatedAt={updatedAt}
            />
          </div>
        );
      })}
    </div>
  );
}

export default NotificationBar;
