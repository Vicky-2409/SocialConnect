"use client";
import ReportPost from "@/components/post/report/[id]/ReportPost";
import React, { Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function ReportPostPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingFallback />}>
        <ReportPost />
      </Suspense>
    </div>
  );
}

export default ReportPostPage;
