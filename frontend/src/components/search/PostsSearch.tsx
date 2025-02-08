import React from "react";
import Image from "next/image";
import { Clock } from "lucide-react";

interface IPost {
  _id: string;
  userId: {
    username: string;
    firstName: string;
    lastName: string;
  };
  caption: string;
  imageUrls: string[];
  createdAt: string | Date; // Handle API responses
}

function formatTimeAgo(date: string | Date) {
  const now = new Date();
  const time = new Date(date);
  if (isNaN(time.getTime())) return "Unknown time";

  const seconds = Math.floor((now.getTime() - time.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return time.toLocaleDateString();
}

function PostsSearch({ results }: { results: IPost[] }) {
  return (
    <div className="space-y-3">
      {results.length > 0 ? (
        results.map((post) => (
          <a
            key={post._id}
            href={`/post/${post._id}`}
            className="block w-full transform transition-all duration-200 hover:-translate-y-1"
            aria-label={`View post by ${post.userId.firstName}`}
          >
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
              <div className="flex space-x-4">
                {/* Post Image Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="relative w-16 h-16">
                    <Image
                      src={post.imageUrls[0]}
                      alt="Post thumbnail"
                      fill
                      className="rounded-lg object-cover ring-1 ring-gray-200 dark:ring-gray-600"
                      unoptimized
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src = "/fallback.jpg")
                      }
                    />
                  </div>
                </div>

                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  {/* Caption */}
                  <p
                    className="font-medium text-gray-900 dark:text-white line-clamp-2"
                    title={post.caption}
                  >
                    {post.caption}
                  </p>

                  {/* User Info and Time */}
                  <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">
                      {post.userId.firstName} {post.userId.lastName}
                    </span>
                    <span>•</span>
                    <span className="truncate">@{post.userId.username}</span>
                    <span>•</span>
                    <div className="flex items-center flex-shrink-0">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(post.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No posts found
        </div>
      )}
    </div>
  );
}

export default PostsSearch;
