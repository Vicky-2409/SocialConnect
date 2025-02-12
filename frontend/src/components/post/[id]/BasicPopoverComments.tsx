import React, { useState } from "react";
import { Popover } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bounce, ToastOptions, toast } from "react-toastify";
import postService from "@/utils/apiCalls/postService";
import "react-toastify/dist/ReactToastify.css";
import EditComment from "./EditComment";
import AlertDialog from "./AlertDialog";
import ReplyCommentModal from "./ReplyCommentModal";

const toastOptions: ToastOptions = {
  position: "top-center",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  transition: Bounce,
};

interface ModernCommentPopoverProps {
  commentId: string;
  postId?: string;
  isOwnComment: boolean;
  currComment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  isReply: boolean;
}

const ModernCommentPopover: React.FC<ModernCommentPopoverProps> = ({
  commentId,
  postId,
  isOwnComment,
  currComment,
  setComment,
  isReply,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      await toast.promise(
        postService.deleteComment(commentId),
        {
          pending: "Deleting comment...",
          success: "Comment deleted successfully",
          error: "Failed to delete comment",
        },
        toastOptions
      );
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.response?.data || "Internal server error";
      toast.error(errorMessage, toastOptions);
    }
  };

  const showReplyModal = () => {
    setIsReplyModalOpen(true);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "modern-popover" : undefined;

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        aria-label="Comment options"
      >
        <Image
          src="/icons/menu.svg"
          alt="Menu"
          width={20}
          height={20}
          className="opacity-60 hover:opacity-100 transition-opacity duration-200"
        />
      </button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          className: "bg-white dark:bg-gray-900 rounded-lg shadow-xl",
        }}
      >
        <div className="py-1 min-w-[160px]">
          {isOwnComment && (
            <>
              <EditComment
                commentId={commentId}
                currComment={currComment}
                setComment={setComment}
                setAnchorEl={setAnchorEl}
              />
              <AlertDialog
                onConfirm={handleDelete}
                alert="Do you really want to delete this comment?"
              >
                <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center gap-2">
                  <span className="text-lg">🗑</span>
                  Delete
                </button>
              </AlertDialog>
            </>
          )}

          {!isOwnComment && !isReply && (
            <button
              onClick={showReplyModal}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2"
            >
              <span className="text-lg">🔗</span>
              Reply
            </button>
          )}
        </div>
      </Popover>

      {isReplyModalOpen && (
        <ReplyCommentModal
          open={isReplyModalOpen}
          onClose={() => setIsReplyModalOpen(false)}
          postId={postId}
          parentCommentId={commentId}
        />
      )}
    </div>
  );
};

export default ModernCommentPopover;
