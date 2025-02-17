"use client";
import React, { useState, useEffect } from "react";
import { MessageSquareOff } from "lucide-react";
import messageService from "@/utils/apiCalls/messageService";

type props = {
  children: React.ReactNode;
};

const MessagesBadge = ({ children }: props) => {
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        setIsLoading(true);
        const unreadCount = await messageService.getUnreadCount();
        setCount(unreadCount);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnreadCount();
  }, []);

  const handleBadgeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (count > 0) {
      setIsAnimatingOut(true);

      try {
        // You might want to call an API to mark messages as read
        // await messageService.markAllAsRead();

        setTimeout(() => {
          setCount(0);
          setIsAnimatingOut(false);
        }, 300);
      } catch (error: any) {
        setError(error.message);
        setIsAnimatingOut(false);
      }
    }
  };

  return (
    <div
      className="relative inline-flex cursor-pointer"
      onClick={handleBadgeClick}
    >
      {error ? (
        <div className="text-red-500 flex items-center gap-2">
          <MessageSquareOff size={16} />
          <span className="text-sm">Unable to load messages</span>
        </div>
      ) : (
        <div
          className={`transition-opacity duration-300 ${
            isLoading ? "opacity-50" : "opacity-100"
          }`}
        >
          {children}
          {count > 0 && (
            <div
              className={`absolute -top-1 -right-1 flex items-center justify-center
                transition-all duration-300 ease-in-out
                ${
                  isAnimatingOut ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`}
            >
              <div className="bg-blue-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {count > 99 ? "99+" : count}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesBadge;
