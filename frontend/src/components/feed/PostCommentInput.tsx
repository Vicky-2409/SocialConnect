import { IUser } from "@/types/types";
import postService from "@/utils/apiCalls/postService";
import { toastOptions } from "@/utils/toastOptions";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";

interface CommentInputProps {
  postId: string;
  currUserData?: IUser;
  onCommentAdded?: () => void;
}

const PostCommentInput: React.FC<CommentInputProps> = ({
  postId,
  currUserData,
  onCommentAdded,
}) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmitComment = async () => {
    if (!comment.trim() || !currUserData || !onCommentAdded) return;

    setIsSubmitting(true);
    try {
      await postService.addComment(comment.trim(), postId);
      setComment("");
      toast.success("Comment added successfully", toastOptions);
      onCommentAdded();
    } catch (error: any) {
      toast.error(error.message || "Failed to add comment", toastOptions);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEmojiClick = (emojiData: any) => {
    setComment((prevComment) => prevComment + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  if (!currUserData) {
    return null;
  }

  return (
    <div className="px-4 py-3 border-t border-gray-100">
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8">
          <Image
            src={currUserData?.profilePicUrl || "/default-profile.png"}
            alt="Profile"
            fill
            className="rounded-full object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1 flex items-center gap-2 relative">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm text-gray-900 bg-gray-50 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmitComment();
              }
            }}
          />
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            type="button"
          >
            <Smile className="w-5 h-5 text-gray-500" />
          </button>
          <button
            onClick={handleSubmitComment}
            disabled={!comment.trim() || isSubmitting || !currUserData}
            className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors
              ${
                comment.trim() && currUserData
                  ? "text-white bg-blue-500 hover:bg-blue-600"
                  : "text-gray-400 bg-gray-100"
              }`}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2 z-50">
              <div
                className="fixed inset-0"
                onClick={() => setShowEmojiPicker(false)}
              />
              <div className="relative">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  lazyLoadEmojis={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCommentInput;
