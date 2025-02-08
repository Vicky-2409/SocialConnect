import { IUser } from "@/types/types";
import Image from "next/image";
import React from "react";

function UserSearch({ results }: { results: IUser[] }) {
  return (
    <div className="space-y-2">
      {results.map((result) => {
        const { _id, username, firstName, lastName, profilePicUrl } = result;

        return (
          <a
            key={_id}
            href={`/profile/${username}`}
            className="block w-full transform transition-all duration-200 hover:-translate-y-1"
          >
            <div
              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 hover:bg-gray-100 
                          dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="relative w-12 h-12">
                    <Image
                      src={profilePicUrl}
                      alt={`${firstName}'s profile picture`}
                      fill
                      className="rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                      unoptimized
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {`${firstName} ${lastName}`}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    @{username}
                  </p>
                </div>
                <div
                  className="inline-flex items-center text-sm font-semibold text-gray-900 
                              dark:text-white"
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}

export default UserSearch;
