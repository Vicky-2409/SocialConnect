import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDate } from "@/utils/formatString";
import postService from "@/utils/apiCalls/postService";
import userService from "@/utils/apiCalls/userService";
import { toastOptions } from "@/utils/toastOptions";
import BasicPopover from "../post/[id]/BasicPopover";
import { IPost, IUser } from "@/types/types";
import PostCommentInput from "./PostCommentInput";
import { useSwipeable } from "react-swipeable";
import { Share } from "lucide-react";
import ShareModal from "./ShareModal";

interface LikedUser {
  _id: string;
  username: string;
  profilePicUrl?: string;
}

interface Props {
  postData: IPost | null;
  currUserData?: IUser;
}

const SinglePost: React.FC<Props> = ({ postData, currUserData }) => {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likedByUsers, setLikedByUsers] = useState<LikedUser[]>([]);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [updatedPostData, setUpdatedPostData] = useState<IPost | null>(
    postData
  );
  const [commentsLength, setCommentsLength] = useState<number>(0);
  const [showShareModal, setShowShareModal] = useState(false);

  const imageUrls = postData?.imageUrls || [postData?.imageUrls || ""];

  if (currUserData) {
    useEffect(() => {
      if (!postData?._id) return;

      const fetchPostData = async () => {
        try {
          const fetchedPost = await postService.getSinglePostData(postData._id);

          setUpdatedPostData(fetchedPost);
        } catch (error) {
          toast.error("Error fetching post data", toastOptions);
        }
      };
      fetchPostData();
    }, [postData?._id]);

    useEffect(() => {
      if (updatedPostData) {
        setLiked(updatedPostData.isLiked);
        setBookmarked(updatedPostData.isBookmarked);
        setLikesCount(updatedPostData.likedBy?.length || 0);
        setLikedByUsers(updatedPostData.likedBy || []);
        setCommentsLength(updatedPostData.comments?.length || 0);
      }
    }, [updatedPostData]);
  }
  useEffect(() => {
    if (postData) {
      setLiked(postData.isLiked);
      setBookmarked(postData.isBookmarked);
      setLikesCount(postData.likedBy?.length || 0);
      setLikedByUsers(postData.likedBy || []);
    }
  }, [postData]);

  useEffect(() => {
    const checkVerification = async () => {
      if (postData?.username) {
        try {
          const hasWenetTick = await userService.hasWenetTick(
            postData.username
          );
          setIsVerified(hasWenetTick);
        } catch (error) {
          console.error("Error checking verification:", error);
        }
      }
    };
    checkVerification();
  }, [postData?.username]);

  const handleNext = () => {
    if (activeImageIndex < imageUrls.length - 1) {
      setActiveImageIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex((prev) => prev - 1);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // ... (keep existing useEffects)

  const handleImageDoubleClick = (e: React.MouseEvent) => {
    // Calculate click position for heart animation
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    handleLike();
  };

  // ... (keep existing handlers)
  if (!postData) {
    return (
      <div className="animate-pulse bg-white rounded-xl p-4 my-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-3 bg-gray-200 rounded w-1/6 mt-2" />
          </div>
        </div>
      </div>
    );
  }

  const handleLike = async () => {
    if (!currUserData) return;

    try {
      setLiked(!liked);
      if (!liked) {
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 2500);
      }
      const updatedLikes = await postService.toggleLike("post", postData._id);
      setLikesCount(updatedLikes.length);
      setLikedByUsers(updatedLikes || []);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBookmark = async () => {
    if (!currUserData) return;

    try {
      await toast.promise(
        postService.toggleBookmark(postData._id),
        {
          pending: "Saving...",
          success: bookmarked ? "Post removed" : "Post saved",
          error: "Failed to save post",
        },
        toastOptions
      );
      setBookmarked(!bookmarked);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCommentAdded = async () => {
    if (!postData?._id) return;
    setCommentsLength((prev) => prev + 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md relative">
      {/* Header */}
      {/* ... (keep existing header) */}
      <div className="flex items-center justify-between p-4">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => router.push(`/profile/${postData.username}`)}
        >
          <div className="relative w-10 h-10">
            <Image
              src={postData.profilePicUrl}
              alt="Profile"
              fill
              className="rounded-full object-cover"
              unoptimized
            />
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-medium text-gray-900">
                {postData.firstName} {postData.lastName}
              </span>
              {isVerified && (
                <Image
                  src="/icons/Verified-tick.png"
                  alt="Verified"
                  width={24}
                  height={24}
                  className="ml-1"
                />
              )}
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(postData.createdAt)}
            </span>
          </div>
        </div>

        {currUserData && (
          <BasicPopover postData={postData} currUserData={currUserData} />
        )}
      </div>

      {/* Caption */}
      {postData.caption && (
        <p className="px-4 pb-3 text-gray-900">{postData.caption}</p>
      )}

      {/* Image Carousel */}
      <div
        className="relative w-full bg-gray-50 overflow-hidden"
        style={{ paddingBottom: "75%" }} // This creates the 4:3 ratio
        {...swipeHandlers}
      >
        {showShareModal && (
          <div className="absolute inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg overflow-hidden">
              <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                post={postData}
              />
            </div>
          </div>
        )}
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <svg
              className="w-24 h-24 text-red-500 animate-scale-up"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        )}

        <div
          className="absolute inset-0 flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
        >
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full relative"
              onDoubleClick={handleImageDoubleClick}
            >
              <Image
                src={typeof url === "string" ? url : ""}
                alt={`Post ${index + 1}`}
                fill
                className={`object-contain transition-opacity duration-300 ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoadingComplete={() => setIsImageLoading(false)}
                onClick={() => router.push(`/post/${postData._id}`)}
              />
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        {imageUrls.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {imageUrls.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === activeImageIndex ? "bg-blue-500" : "bg-gray-300"
                }`}
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {imageUrls.length > 1 && (
          <>
            {activeImageIndex > 0 && (
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            {activeImageIndex < imageUrls.length - 1 && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={currUserData ? handleLike : undefined}
            className={`flex items-center space-x-1 ${
              liked ? "text-red-500" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg
              className={`w-6 h-6 ${
                liked ? "fill-current" : "stroke-current fill-none"
              }`}
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span
              className="text-sm font-medium cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowLikesModal(true);
              }}
            >
              {likesCount}
            </span>
          </button>

          <button
            onClick={() => router.push(`/post/${postData._id}`)}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-6 h-6 stroke-current fill-none"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm font-medium">{commentsLength}</span>
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center text-gray-600 hover:text-gray-900 group transition-transform duration-200 hover:scale-105"
          >
            <svg
              className="w-6 h-6 stroke-current fill-none transform group-hover:rotate-12 transition-transform duration-200"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>

        </div>

        <button
          onClick={handleBookmark}
          className={`${
            bookmarked ? "text-blue-500" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg
            className={`w-6 h-6 ${
              bookmarked ? "fill-current" : "stroke-current fill-none"
            }`}
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>

      {showLikesModal && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowLikesModal(false)}
          />
          <div className="relative bg-white rounded-lg w-[90%] max-w-sm p-4 m-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Liked by</h3>
              <button
                onClick={() => setShowLikesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {likedByUsers.length > 0 ? (
                <div className="space-y-3">
                  {likedByUsers.map((user) => (
                    <div key={user._id} className="flex items-center space-x-3">
                      <Image
                        src={user.profilePicUrl || "/default-profile.png"}
                        alt={user.username}
                        width={40}
                        height={40}
                        className="rounded-full"
                        unoptimized
                      />
                      <span className="font-medium text-gray-900">
                        {user.username}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No likes yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePost;
