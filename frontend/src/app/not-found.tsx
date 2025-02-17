"use client";

import React from "react";
import Link from "next/link";
import { UserX, Home, RefreshCw } from "lucide-react";

const Custom404 = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="mb-8 flex justify-center">
          <UserX className="h-24 w-24 text-gray-400" />
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Oops! Looks like you've wandered into uncharted territory. The page
          you're looking for doesn't exist or might have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>

          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Custom404;
