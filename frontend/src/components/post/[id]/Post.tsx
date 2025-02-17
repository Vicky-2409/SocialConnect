"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AlertTriangle } from "lucide-react";
import FeedPostSkeleton from "../../feed/FeedPostSkeleton";
import FeedPost from "../../feed/FeedPost";
import postService from "@/utils/apiCalls/postService";
import { storePostData } from "@/redux/postSlice";
import { IPost, IUser } from "@/types/types";
import { toastOptions } from "@/utils/toastOptions";
import SinglePost from "@/components/feed/SinglePost";

function Post({ currUserData }: { currUserData: IUser }) {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const [postData, setPostData] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async (postId: string) => {
      try {
        setLoading(true);
        setError(null);
        const data = await postService.getSinglePostData(postId);

        if (!data) {
          setError("Post not found");
          return;
        }

        setPostData(data);
        dispatch(storePostData({ postData: data }));
      } catch (error: any) {
        setError(error.message || "Failed to load post");
        toast.error("Error loading post", toastOptions);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost(id);
    }
  }, [id, dispatch]);

  if (loading) {
    return <FeedPostSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-red-500 text-xl font-semibold mb-4">
            <AlertTriangle size={24} />
            <h2>Error</h2>
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (postData?.isDeleted) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-500 mb-4">
            Post Unavailable
          </h2>
          <p className="text-gray-600">
            This post has been deleted by the author.
          </p>
        </div>
      </div>
    );
  }

  return <SinglePost postData={postData} currUserData={currUserData} />;
}

export default Post;
