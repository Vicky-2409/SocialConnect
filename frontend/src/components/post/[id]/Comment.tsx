import { IComment } from "@/types/types";
import { formatDate } from "@/utils/formatString";
import Image from "next/image";
import React, { useState } from "react";
import BasicPopoverComments from "./BasicPopoverComments";

type Props = {
  commentData: IComment;
  currentUserId: string;
  postId: string;
  isReply: boolean;
};

function Comment({ commentData, currentUserId, postId, isReply }: Props) {
  const { _id, userId, profilePicUrl, username, updatedAt, replies } =
    commentData;
  console.log(replies);

  const [comment, setComment] = useState(commentData.comment);
  const [showReplies, setShowReplies] = useState(false);
  const [commentReplies, setCommentReplies] = useState<IComment[]>(
    replies || []
  );

  const timestamp = formatDate(updatedAt);
  const isOwnComment = userId === currentUserId;

  const handleAddReply = async (replyText: string) => {
    try {
      // Implement reply submission logic
      // Example:
      // const newReply = await postService.addReply(postId, _id, replyText);
      // setCommentReplies([newReply, ...commentReplies]);
    } catch (error) {
      console.error("Failed to add reply", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 mt-3">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <a href={`/profile/${username}`}>
            <Image
              src={profilePicUrl}
              alt="Profile Pic"
              width={500}
              height={500}
              unoptimized
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-gray-300 hover:border-blue-500 transition-all"
            />
          </a>
        </div>

        {/* Comment Content */}
        <div className="flex-grow pl-4">
          <div className="flex items-center justify-between">
            {/* Username */}
            <a
              href={`/profile/${username}`}
              className="text-blue-600 font-semibold text-sm md:text-md hover:underline"
            >
              @{username}
            </a>
            {/* Timestamp */}
            <span className="text-gray-400 text-xs md:text-sm">
              {timestamp}
            </span>
          </div>

          {/* Comment Text */}
          <p className="text-gray-700 text-sm md:text-base mt-2">{comment}</p>

          {/* Replies Section */}
          {commentReplies.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-blue-500 text-sm hover:underline"
              >
                {showReplies
                  ? `Hide ${commentReplies.length} Replies`
                  : `Show ${commentReplies.length} Replies`}
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-2 md:mt-0 md:ml-4 flex-shrink-0">
          <BasicPopoverComments
            commentId={_id}
            isOwnComment={isOwnComment}
            currComment={comment}
            setComment={setComment}
            postId={postId}
            isReply={isReply}
          />
        </div>
      </div>

      {/* Replies Display */}
      {showReplies && commentReplies.length > 0 && (
        <div className="pl-12 space-y-2">
          {commentReplies.map((reply: IComment) => (
            <Comment
              key={reply._id}
              commentData={prepareCommentData(reply)}
              currentUserId={currentUserId}
              postId={postId}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Comment;

function prepareCommentData(singleCommentData: any): IComment {
  console.log(
    singleCommentData,
    "singleCommentData////////////////////////////////////"
  );

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
