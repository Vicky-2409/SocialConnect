"use client";
import React, { useEffect, useState } from "react";
import "@/app/globals.css";
import { toast } from "react-toastify";
import postService from "@/utils/apiCalls/postService";
import { IPost, IUser } from "@/types/types";
import FeedPost from "@/components/feed/FeedPost";
import FeedPostSkeleton from "@/components/feed/FeedPostSkeleton";
import userService from "@/utils/apiCalls/userService";

function Bookmarks() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<any>(null);
  const [currUserData, setCurrUserData] = useState<IUser>();

  useEffect(() => {
    (async function () {
      try {
        const bookmarkedPosts: IPost[] = await postService.getBookmarkedPosts();
        const userData: IUser = await userService.getCurrUserData();
        setCurrUserData(userData);
        setBookmarkedPosts(bookmarkedPosts);
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, []);

  if (bookmarkedPosts?.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <div className="w-full flex justify-center py-10">
          <h1 className="text-xl font-medium tracking-tight">
            Your Bookmarked Posts
          </h1>
        </div>
        <div className="h-96 w-full flex flex-col items-center justify-center">
          <h2 className="text-lg font-normal">No bookmarks yet!</h2>
          <p className="text-gray-600 mt-1 text-center text-sm">
            Save posts to see them here later.
          </p>
          <div className="mt-4">
            <a href="/">
              <button className="px-6 py-2 rounded-md border border-gray-400 bg-white hover:bg-gray-100 transition-all">
                Explore Feed
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="w-full flex justify-center py-10">
        <h1 className="text-xl font-medium tracking-tight">
          Your Bookmarked Posts
        </h1>
      </div>
      <div className="flex flex-col items-center space-y-6 px-4">
        {bookmarkedPosts ? (
          bookmarkedPosts.map((postData: any) => (
            <div
              key={postData._id}
              className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <FeedPost postData={postData} currUserData={currUserData} />
            </div>
          ))
        ) : (
          <FeedPostSkeleton />
        )}
      </div>
    </div>
  );
}

export default Bookmarks;
