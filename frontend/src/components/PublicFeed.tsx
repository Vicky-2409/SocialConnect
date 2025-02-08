// "use client";
// import React, { useEffect, useState } from "react";
// import "@/app/globals.css";
// import { toast } from "react-toastify";
// import postService from "@/utils/apiCalls/postService";
// import FeedPost from "@/components/feed/FeedPost";
// import FeedPostSkeleton from "@/components/feed/FeedPostSkeleton";
// import { IPost } from "@/types/types";
// import { TrendingUp, Sparkles, Clock } from "lucide-react";

// function PublicFeed() {
//   const [topPostsData, setTopPostsData] = useState<IPost[] | null>(null);
//   const [activeFilter, setActiveFilter] = useState("trending");
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const fetchPosts = async () => {
//     setIsLoading(true);
//     try {
//       const { topPostsData }: { topPostsData: IPost[] } =
//         await postService.getPublicFeed();
//       setTopPostsData(topPostsData);
//     } catch (error: any) {
//       toast.error(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const FilterButton = ({
//     icon: Icon,
//     label,
//     filter,
//   }: {
//     icon: any;
//     label: string;
//     filter: string;
//   }) => (
//     <button
//       onClick={() => setActiveFilter(filter)}
//       className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
//         activeFilter === filter
//           ? "bg-blue-500 text-white"
//           : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
//       }`}
//     >
//       <Icon className="w-4 h-4" />
//       <span className="text-sm font-medium">{label}</span>
//     </button>
//   );

//   return (
//     <div className="max-w-2xl mx-auto space-y-6">
//       {/* Feed Header */}
//       <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-xl font-bold text-gray-800 dark:text-white">
//             Your Feed
//           </h1>
//           <button
//             onClick={fetchPosts}
//             className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
//           >
//             Refresh
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
//           <FilterButton icon={TrendingUp} label="Trending" filter="trending" />
//         </div>
//       </div>

//       {/* Posts Container */}
//       <div className="space-y-4">
//         {isLoading ? (
//           // Show multiple skeleton loaders
//           Array(3)
//             .fill(null)
//             .map((_, index) => (
//               <div
//                 key={index}
//                 className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
//               >
//                 <FeedPostSkeleton />
//               </div>
//             ))
//         ) : topPostsData && topPostsData.length > 0 ? (
//           topPostsData.map((postData) => (
//             <div
//               key={postData._id}
//               className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden
//                          transform transition-transform hover:scale-[1.02] hover:shadow-md"
//             >
//               <FeedPost postData={postData} />
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl">
//             <p className="text-gray-500 dark:text-gray-400">No posts to show</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PublicFeed;




























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

      setPosts(prev => pageNum === 1 ? topPostsData : [...prev, ...topPostsData]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Intersection Observer callback
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isLoading]);

  // Initial load
  useEffect(() => {
    fetchPosts(1);
  }, []);

  // Set up intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
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
        {posts.map((postData,index) => (
          <FeedPost key={`${postData._id}_${
            postData?.fromAdsService || "noAd"
          }_${index}`}postData={postData} />
          
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
          <div className="text-center py-8 text-gray-500">
            No posts to show
          </div>
        )}

        {/* Intersection observer target */}
        <div ref={loader} className="h-10" />
      </div>
    </div>
  );
}

export default PublicFeed;