"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import postService from "@/utils/apiCalls/postService";
import { toastOptions } from "@/utils/toastOptions";
import Comment from "./Comment";
import { IComment, IUser } from "@/types/types";
import { useSelector } from "react-redux";

interface FormInputs {
  comment: string;
}

interface RootState {
  post: {
    postData: {
      comments: IComment[];
      isDeleted?: boolean;
    };
  };
}

interface CommentFormProps {
  userData: IUser;
  userId: string;
}

const AddCommentForm: React.FC<CommentFormProps> = ({ userData, userId }) => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [newComments, setNewComments] = useState<IComment[]>([]);
  const postData = useSelector((store: RootState) => store?.post?.postData);
  const [existingComments, setExistingComments] = useState<IComment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 140;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<FormInputs>();

  useEffect(() => {
    if (postData?.comments?.length) {
      const sortedComments = [...postData.comments].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setExistingComments(sortedComments);
    }
  }, [postData]);

  useEffect(() => {
    const subscription = watch((value) => {
      setCharCount(value.comment?.length || 0);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const profilePicUrl =
    userData?.profilePicUrl || "/img/DefaultProfilePicMale.png";

  const onSubmit = useCallback(
    async (data: FormInputs) => {
      if (isSubmitting) return;

      try {
        setIsSubmitting(true);

        const newComment: any = await toast.promise(
          postService.addComment(data.comment, id),
          {
            pending: "Adding your comment...",
            success: "Comment added successfully",
            error: "Failed to add comment",
          },
          toastOptions
        );

        if (newComment && newComment._id) {
          setNewComments((comments: IComment[]) => [newComment, ...comments]);
        } else {
          toast.error("Unexpected response structure");
        }

        reset();
        router.refresh();
      } catch (error: any) {
        toast.error(
          error.message || "An error occurred while adding your comment"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [id, reset, router, isSubmitting]
  );

  if (postData && postData.isDeleted) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Comment Form */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row gap-6 p-6"
        >
          {/* Profile Section */}
          <div className="md:w-1/4 flex flex-col items-center justify-center">
            <div className="relative w-16 h-16 md:w-20 md:h-20 group">
              <Image
                src={profilePicUrl}
                alt="Profile"
                fill
                className="rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
            </div>
            {userData?.username && (
              <span className="mt-3 text-sm text-gray-700 font-semibold">
                @{userData.username}
              </span>
            )}
          </div>

          {/* Comment Input Section */}
          <div className="flex-1">
            <textarea
              className="w-full min-h-[140px] p-4 rounded-lg bg-gray-100 border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-800 placeholder-gray-500 resize-none transition-all duration-300"
              placeholder="What are your thoughts on this post?"
              {...register("comment", {
                required: "Comment cannot be empty",
                maxLength: {
                  value: MAX_CHARS,
                  message: `Comment must be within ${MAX_CHARS} characters`,
                },
              })}
            />
            {/* Character Count */}
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>
                {charCount}/{MAX_CHARS}
              </span>
              {errors.comment && (
                <span className="text-red-500">{errors.comment.message}</span>
              )}
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-4 px-6 py-2.5 rounded-full text-white font-semibold transition-all duration-300 
                ${
                  isSubmitting
                    ? "bg-gray-300"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Posting...
                </span>
              ) : (
                "Post Comment"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List with Replies */}
      <div className="space-y-4 mt-6">
        {/* {[...newComments, ...existingComments].map((comment) => (
          <div key={comment._id} className="space-y-4">
            <Comment
              commentData={prepareCommentData(comment)}
              currentUserId={userId}
              postId={id}
            />
          </div>
        ))} */}
        {/* <div className="space-y-4 mt-6"> */}
        {newComments.map((comment) => (
          <Comment
            key={`new-${comment._id}`}
            commentData={comment}
            currentUserId={userId}
            postId={id}
            isReply={false}
          />
        ))}
        {existingComments.map((comment) => (
          <Comment
            key={comment._id}
            commentData={prepareCommentData(comment)}
            currentUserId={userId}
            postId={id}
            isReply={false}
          />
        ))}
        {!newComments.length && !existingComments.length && (
          <div className="text-center py-8 text-gray-500">
            <p>Be the first to comment on this post!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCommentForm;

function prepareCommentData(singleCommentData: any): IComment {
  const { _id, userId, comment, updatedAt, createdAt, replies } =
    singleCommentData;
  const { profilePicUrl, username } = userId;

  return {
    _id,
    userId: userId._id,
    profilePicUrl,
    username,
    comment,
    updatedAt,
    createdAt,
    replies,
  };
}
