import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Bounce, ToastOptions, toast } from "react-toastify";
import postService from "@/utils/apiCalls/postService";

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

interface ReplyCommentModalProps {
  open: boolean;
  onClose: () => void;
  postId?: string;
  parentCommentId: string;
}

const ReplyCommentModal: React.FC<ReplyCommentModalProps> = ({
  open,
  onClose,
  postId,
  parentCommentId,
}) => {
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty", toastOptions);
      return;
    }

    setIsSubmitting(true);
    try {
      await toast.promise(
        postService.createReply({
          postId,
          parentCommentId,
          content: replyText,
        }),
        {
          pending: "Submitting reply...",
          success: "Reply submitted successfully",
          error: "Failed to submit reply",
        },
        toastOptions
      );

      // Reset form and close modal
      setReplyText("");
      onClose();
      window.location.reload(); // Optional: refresh to show new comment
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.response?.data?.length
        ? error.response.data
        : "Internal server error";
      toast.error(errorMessage, toastOptions);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reply to Comment</DialogTitle>
      <DialogContent>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write your reply..."
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 min-h-[100px]"
          disabled={isSubmitting}
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitReply}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={isSubmitting || !replyText.trim()}
          >
            {isSubmitting ? "Submitting..." : "Submit Reply"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyCommentModal;
