// "use client";
// import React, { useEffect, useState } from "react";
// import "@/app/globals.css";
// import { toast } from "react-toastify";
// import postService from "@/utils/apiCalls/postService";
// import FeedPost from "./FeedPost";
// import FeedPostSkeleton from "./FeedPostSkeleton";
// import { IPost, IUser } from "@/types/types";
// import userService from "@/utils/apiCalls/userService";
// import adsService from "@/utils/apiCalls/adsService";

// function Feed({ currUserData }: { currUserData?: IUser }) {
//   const [topPostsData, setTopPostsData] = useState<IPost[] | null>(null);
//   const [filteredPosts, setFilteredPosts] = useState<IPost[] | null>(null);
//   const [otherPosts, setOtherPosts] = useState<IPost[] | null>(null);
//   const [promotedPosts, setPromotedPosts] = useState<IPost[] | null>(null);

//   useEffect(() => {
//     (async function () {
//       try {
//         try {
//           let postData  = await adsService.getPosts();

//           postData = postData.map((data: any) => {
//             data.fromAdsService = true;
//             return data;
//           });
//           setPromotedPosts(postData);
//         } catch (error: any) {
//           console.log(error.message);
//         }

//         let { topPostsData }: { topPostsData: IPost[] } =
//           await postService.getFeed();
//         topPostsData = topPostsData.filter((data) => data && data?.userId);

//         const followingUsers = await userService.getFollowingUsers();

//         setTopPostsData(topPostsData);

//         const filteredPosts = topPostsData.filter((post) =>
//           followingUsers.includes(post.userId)
//         );
//         setFilteredPosts(filteredPosts);

//         const otherPosts = topPostsData.filter(
//           (post) => !followingUsers.includes(post.userId)
//         );
//         setOtherPosts(otherPosts);
//       } catch (error: any) {
//         toast.error(error.message || "An error occurred");
//         setTopPostsData(null);
//         setFilteredPosts(null);
//         setOtherPosts(null);
//       }
//     })();
//   }, []);

//   const mergePosts = (posts: IPost[], promotedPosts: IPost[]) => {
//     const mergedPosts = [];
//     let promotedIndex = 0;

//     for (let i = 0; i < posts.length; i++) {
//       mergedPosts.push(posts[i]);
//       if ((i + 1) % 5 === 0 && promotedPosts[promotedIndex]) {
//         mergedPosts.push(promotedPosts[promotedIndex]);
//         promotedIndex++;
//       }
//     }

//     return mergedPosts;
//   };

//   return (
//     <div className="w-full max-w-full bg-gray-100 shadow-md p-4 rounded-lg space-y-4">
//       {topPostsData ? (
//         topPostsData.length === 0 ? (
//           <div className="h-96 w-full flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200">
//             <h1 className="text-gray-700 font-bold">
//               No posts to show from followers!
//             </h1>
//           </div>
//         ) : (
//           <>
//             {filteredPosts && (
//               <>
//                 {mergePosts(filteredPosts, promotedPosts || []).map(
//                   (postData) =>
//                     postData && (
//                       <FeedPost
//                         key={`${postData._id}FromAdsService:${postData?.fromAdsService}`}
//                         postData={postData}
//                         currUserData={currUserData}
//                       />
//                     )
//                 )}
//               </>
//             )}
//             {otherPosts && otherPosts.length > 0 && (
//               <>
//                 <div className="w-full flex items-center justify-center">
//                   <h2 className="text-gray-700 text-2xl font-bold p-4">
//                     Suggested Posts
//                   </h2>
//                 </div>
//                 {mergePosts(otherPosts, promotedPosts || []).map(
//                   (postData) =>
//                     postData && (
//                       <FeedPost
//                         key={`${postData._id}FromAdsService:${postData?.fromAdsService}`}
//                         postData={postData}
//                         currUserData={currUserData}
//                       />
//                     )
//                 )}
//               </>
//             )}
//           </>
//         )
//       ) : (
//         <FeedPostSkeleton />
//       )}
//     </div>
//   );
// }

// export default Feed;














































// "use client";
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import "@/app/globals.css";
// import { toast } from "react-toastify";
// import postService from "@/utils/apiCalls/postService";
// import FeedPost from "./FeedPost";
// import FeedPostSkeleton from "./FeedPostSkeleton";
// import { IPost, IUser } from "@/types/types";
// import userService from "@/utils/apiCalls/userService";
// import adsService from "@/utils/apiCalls/adsService";

// function Feed({ currUserData }: { currUserData?: IUser }) {
//   const [topPostsData, setTopPostsData] = useState<IPost[] | null>(null);
//   const [filteredPosts, setFilteredPosts] = useState<IPost[] | null>(null);
//   const [otherPosts, setOtherPosts] = useState<IPost[] | null>(null);
//   const [promotedPosts, setPromotedPosts] = useState<IPost[] | null>(null);
//   const [visiblePosts, setVisiblePosts] = useState<IPost[]>([]);

//   const observerRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     (async function () {
//       try {
//         try {
//           let postData = await adsService.getPosts();
//           postData = postData.map((data: any) => ({
//             ...data,
//             fromAdsService: true,
//           }));
//           setPromotedPosts(postData);
//         } catch (error: any) {
//           console.log(error.message);
//         }

//         let { topPostsData }: { topPostsData: IPost[] } =
//           await postService.getFeed();
//         topPostsData = topPostsData.filter((data) => data && data?.userId);

//         const followingUsers = await userService.getFollowingUsers();
//         setTopPostsData(topPostsData);

//         const filteredPosts = topPostsData.filter((post) =>
//           followingUsers.includes(post.userId)
//         );
//         setFilteredPosts(filteredPosts);

//         const otherPosts = topPostsData.filter(
//           (post) => !followingUsers.includes(post.userId)
//         );
//         setOtherPosts(otherPosts);
//         setVisiblePosts(otherPosts.slice(0, 5)); // Initially show only 5 posts
//       } catch (error: any) {
//         toast.error(error.message || "An error occurred");
//         setTopPostsData(null);
//         setFilteredPosts(null);
//         setOtherPosts(null);
//       }
//     })();
//   }, []);

//   const mergePosts = (posts: IPost[], promotedPosts: IPost[]) => {
//     const mergedPosts = [];
//     let promotedIndex = 0;

//     for (let i = 0; i < posts.length; i++) {
//       mergedPosts.push(posts[i]);
//       if ((i + 1) % 5 === 0 && promotedPosts[promotedIndex]) {
//         mergedPosts.push(promotedPosts[promotedIndex]);
//         promotedIndex++;
//       }
//     }

//     return mergedPosts;
//   };

//   const loadMorePosts = useCallback(() => {
//     setVisiblePosts((prev) => {
//       if (!otherPosts) return prev;
//       return [...prev, ...otherPosts.slice(0, 5)]; // Append more posts cyclically
//     });
//   }, [otherPosts]);

//   useEffect(() => {
//     if (!observerRef.current) return;
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           loadMorePosts();
//         }
//       },
//       { threshold: 1.0 }
//     );

//     observer.observe(observerRef.current);
//     return () => observer.disconnect();
//   }, [loadMorePosts]);

//   return (
//     <div className="w-full max-w-full bg-gray-100 shadow-md p-4 rounded-lg space-y-4">
//       {topPostsData ? (
//         topPostsData.length === 0 ? (
//           <div className="h-96 w-full flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200">
//             <h1 className="text-gray-700 font-bold">
//               No posts to show from followers!
//             </h1>
//           </div>
//         ) : (
//           <>
//             {filteredPosts && (
//               <>
//                 {mergePosts(filteredPosts, promotedPosts || []).map(
//                   (postData, index) =>
//                     postData && (
//                       <FeedPost
//                         key={`${postData._id}_${
//                           postData?.fromAdsService || "noAd"
//                         }_${index}`}
//                         postData={postData}
//                         currUserData={currUserData}
//                       />
//                     )
//                 )}
//               </>
//             )}
//             {otherPosts && otherPosts.length > 0 && (
//               <>
//                 <div className="w-full flex items-center justify-center">
//                   <h2 className="text-gray-700 text-2xl font-bold p-4">
//                     Suggested Posts
//                   </h2>
//                 </div>
//                 {mergePosts(visiblePosts, promotedPosts || []).map(
//                   (postData, index) =>
//                     postData && (
//                       <FeedPost
//                         key={`${postData._id}_${
//                           postData?.fromAdsService || "noAd"
//                         }_${index}`}
//                         postData={postData}
//                         currUserData={currUserData}
//                       />
//                     )
//                 )}
//                 <div ref={observerRef} className="h-10 w-full"></div>
//               </>
//             )}
//           </>
//         )
//       ) : (
//         <FeedPostSkeleton />
//       )}
//     </div>
//   );
// }

// export default Feed;





















"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import "@/app/globals.css";
import { toast } from "react-toastify";
import postService from "@/utils/apiCalls/postService";
import FeedPost from "./FeedPost";
import FeedPostSkeleton from "./FeedPostSkeleton";
import { IPost, IUser } from "@/types/types";
import userService from "@/utils/apiCalls/userService";
import adsService from "@/utils/apiCalls/adsService";

function Feed({ currUserData }: { currUserData?: IUser }) {
  const [topPostsData, setTopPostsData] = useState<IPost[] | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<IPost[] | null>(null);
  const [otherPosts, setOtherPosts] = useState<IPost[] | null>(null);
  const [promotedPosts, setPromotedPosts] = useState<IPost[] | null>(null);
  const [displayPosts, setDisplayPosts] = useState<IPost[]>([]);
  const [displayOtherPosts, setDisplayOtherPosts] = useState<IPost[]>([]);
  
  // Refs for infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);
  
  // Track how many times we've repeated the posts
  const repeatCount = useRef(1);
  const POSTS_PER_PAGE = 5;

  useEffect(() => {
    (async function () {
      try {
        try {
          let postData = await adsService.getPosts();
          postData = postData.map((data: any) => {
            data.fromAdsService = true;
            return data;
          });
          setPromotedPosts(postData);
        } catch (error: any) {
          console.log(error.message);
        }

        let { topPostsData }: { topPostsData: IPost[] } =
          await postService.getFeed();
        topPostsData = topPostsData.filter((data) => data && data?.userId);

        const followingUsers = await userService.getFollowingUsers();

        setTopPostsData(topPostsData);

        const filteredPosts = topPostsData.filter((post) =>
          followingUsers.includes(post.userId)
        );
        setFilteredPosts(filteredPosts);
        setDisplayPosts(mergePosts(filteredPosts.slice(0, POSTS_PER_PAGE), promotedPosts || []));

        const otherPosts = topPostsData.filter(
          (post) => !followingUsers.includes(post.userId)
        );
        setOtherPosts(otherPosts);
        setDisplayOtherPosts(mergePosts(otherPosts.slice(0, POSTS_PER_PAGE), promotedPosts || []));

      } catch (error: any) {
        toast.error(error.message || "An error occurred");
        setTopPostsData(null);
        setFilteredPosts(null);
        setOtherPosts(null);
      }
    })();
  }, []);

  const loadMorePosts = useCallback(() => {
    if (filteredPosts) {
      const startIndex = (repeatCount.current * POSTS_PER_PAGE) % filteredPosts.length;
      let newPosts = [];
      
      // If we're near the end of the array, we might need to wrap around
      if (startIndex + POSTS_PER_PAGE > filteredPosts.length) {
        newPosts = [
          ...filteredPosts.slice(startIndex),
          ...filteredPosts.slice(0, POSTS_PER_PAGE - (filteredPosts.length - startIndex))
        ];
      } else {
        newPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
      }
      
      setDisplayPosts(prev => [...prev, ...mergePosts(newPosts, promotedPosts || [])]);
      repeatCount.current += 1;
    }
  }, [filteredPosts, promotedPosts]);

  const loadMoreOtherPosts = useCallback(() => {
    if (otherPosts) {
      const startIndex = (repeatCount.current * POSTS_PER_PAGE) % otherPosts.length;
      let newPosts = [];
      
      if (startIndex + POSTS_PER_PAGE > otherPosts.length) {
        newPosts = [
          ...otherPosts.slice(startIndex),
          ...otherPosts.slice(0, POSTS_PER_PAGE - (otherPosts.length - startIndex))
        ];
      } else {
        newPosts = otherPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
      }
      
      setDisplayOtherPosts(prev => [...prev, ...mergePosts(newPosts, promotedPosts || [])]);
    }
  }, [otherPosts, promotedPosts]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMorePosts();
        loadMoreOtherPosts();
      }
    }, options);

    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadMorePosts, loadMoreOtherPosts]);

  const mergePosts = (posts: IPost[], promotedPosts: IPost[]) => {
    const mergedPosts = [];
    let promotedIndex = 0;

    for (let i = 0; i < posts.length; i++) {
      mergedPosts.push(posts[i]);
      if ((i + 1) % 5 === 0 && promotedPosts[promotedIndex]) {
        mergedPosts.push(promotedPosts[promotedIndex]);
        promotedIndex++;
      }
    }

    return mergedPosts;
  };

  return (
    <div className="w-full max-w-full bg-gray-100 shadow-md p-4 rounded-lg space-y-4">
      {topPostsData ? (
        topPostsData.length === 0 ? (
          <div className="h-96 w-full flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200">
            <h1 className="text-gray-700 font-bold">
              No posts to show from followers!
            </h1>
          </div>
        ) : (
          <>
            {displayPosts.map((postData, index) => (
              <FeedPost
                key={`${postData._id}FromAdsService:${postData?.fromAdsService}-${index}`}
                postData={postData}
                currUserData={currUserData}
              />
            ))}
            
            {displayOtherPosts.length > 0 && (
              <>
                <div className="w-full flex items-center justify-center">
                  <h2 className="text-gray-700 text-2xl font-bold p-4">
                    Suggested Posts
                  </h2>
                </div>
                {displayOtherPosts.map((postData, index) => (
                  <FeedPost
                    key={`${postData._id}FromAdsService:${postData?.fromAdsService}-${index}`}
                    postData={postData}
                    currUserData={currUserData}
                  />
                ))}
              </>
            )}
            
            <div ref={lastPostElementRef} className="h-4" />
          </>
        )
      ) : (
        <FeedPostSkeleton />
      )}
    </div>
  );
}

export default Feed;
