import React from "react";

interface FeedPostSkeletonProps {
  // Optional className for custom styling from parent
  className?: string;
}

const FeedPostSkeleton: React.FC<FeedPostSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`
        w-full max-w-2xl mx-auto bg-white rounded-xl p-6 
        shadow-sm overflow-hidden relative
        before:absolute before:inset-0
        before:-translate-x-full before:animate-[shimmer_1.5s_infinite]
        before:bg-gradient-to-r
        before:from-transparent before:via-gray-100/60 before:to-transparent
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gray-200" />

        {/* User Info */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-32" />
          <div className="h-3 bg-gray-200 rounded-md w-24" />
        </div>

        {/* Options Button */}
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
      </div>

      {/* Content Placeholder */}
      <div className="mt-6 space-y-2">
        <div className="h-4 bg-gray-200 rounded-md w-full" />
        <div className="h-4 bg-gray-200 rounded-md w-5/6" />
        <div className="h-4 bg-gray-200 rounded-md w-4/6" />
      </div>

      {/* Image Placeholder */}
      <div className="mt-6 aspect-video w-full bg-gray-200 rounded-xl" />

      {/* Interaction Bar */}
      <div className="mt-6 flex items-center justify-between">
        {/* Likes */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="h-3 bg-gray-200 rounded-md w-12" />
        </div>

        {/* Comments */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="h-3 bg-gray-200 rounded-md w-12" />
        </div>

        {/* Share */}
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
};

export default FeedPostSkeleton;
