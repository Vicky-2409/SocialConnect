"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import "@/app/globals.css";
import { toast } from "react-toastify";
import postService from "@/utils/apiCalls/postService";
import FeedPost from "@/components/feed/FeedPost";
import FeedPostSkeleton from "@/components/feed/FeedPostSkeleton";
import { IPost } from "@/types/types";
import { TrendingUp, Sparkles, Clock } from "lucide-react";

function PublicFeed() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [activeFilter, setActiveFilter] = useState("trending");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const fetchPosts = async (pageNum: number) => {
    try {
      setIsLoading(true);
      const { topPostsData }: { topPostsData: IPost[] } =
        await postService.getPublicFeed();

      if (topPostsData.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) =>
        pageNum === 1 ? topPostsData : [...prev, ...topPostsData]
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Intersection Observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isLoading]
  );

  // Initial load
  useEffect(() => {
    fetchPosts(1);
  }, []);

  // Set up intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  // Fetch more posts when page changes
  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  const refreshFeed = () => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  };

  const FilterButton = ({
    icon: Icon,
    label,
    filter,
  }: {
    icon: any;
    label: string;
    filter: string;
  }) => (
    <button
      onClick={() => setActiveFilter(filter)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
        activeFilter === filter
          ? "bg-blue-500 text-white"
          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Feed Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Feed</h1>
        <button
          onClick={refreshFeed}
          className="text-blue-500 hover:text-blue-600"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <FilterButton icon={TrendingUp} label="Trending" filter="trending" />
        <FilterButton icon={Sparkles} label="Latest" filter="latest" />
        <FilterButton icon={Clock} label="Past Week" filter="past-week" />
      </div>

      {/* Posts Container */}
      <div className="space-y-4">
        {posts.map((postData, index) => (
          <FeedPost
            key={`${postData._id}_${
              postData?.fromAdsService || "noAd"
            }_${index}`}
            postData={postData}
          />
        ))}

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-4">
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <FeedPostSkeleton key={index} />
              ))}
          </div>
        )}

        {/* No posts state */}
        {!isLoading && posts.length === 0 && (
          <div className="text-center py-8 text-gray-500">No posts to show</div>
        )}

        {/* Intersection observer target */}
        <div ref={loader} className="h-10" />
      </div>
    </div>
  );
}

export default PublicFeed;
