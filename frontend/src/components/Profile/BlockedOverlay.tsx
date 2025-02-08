"use client";
import { useRouter } from "next/navigation";
import React from "react";

export const BlockedOverlay: React.FC = () => {
  const router = useRouter();

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex items-center justify-center"
      style={{ backdropFilter: "blur(8px)" }}
    >
      <div
        className="bg-gray-800 text-center rounded-lg shadow-lg p-6 w-[90%] max-w-md"
        style={{
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.4)",
          border: "1px solid #444",
        }}
      >
        <h2 className="text-white text-2xl font-semibold mb-4">
          Profile Blocked
        </h2>
        <p className="text-gray-300 text-sm mb-6">
          You have blocked this user. To view or interact, please unblock the
          profile.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            className="w-full max-w-[150px] py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-transform transform hover:scale-105"
            onClick={() => router.push("/")}
            style={{
              boxShadow: "0px 4px 8px rgba(0, 123, 255, 0.3)",
            }}
          >
            Go to Feed
          </button>
          <button
            className="w-full max-w-[150px] py-2 px-4 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-500 focus:ring-2 focus:ring-red-400 focus:outline-none transition-transform transform hover:scale-105"
            onClick={() =>
              router.push("/settings?settingNameQuery=blockedUsers")
            }
            style={{
              boxShadow: "0px 4px 8px rgba(255, 65, 54, 0.3)",
            }}
          >
            Unblock User
          </button>
        </div>
      </div>
    </div>
  );
};
