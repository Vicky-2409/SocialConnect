// import postService from "@/utils/apiCalls/postService";
// import { toastOptions } from "@/utils/toastOptions";
// import React, { ReactNode, useState } from "react";
// import { toast } from "react-toastify";

// type Props = {
//   commentId: string;
//   currComment: string;
//   setComment: React.Dispatch<React.SetStateAction<string>>;
//   setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
// };

// const EditComment = ({
//   commentId,
//   currComment,
//   setComment,
//   setAnchorEl,
// }: Props) => {
//   const [open, setOpen] = useState<boolean>(false);
//   const [commentText, setCommentText] = useState<string>(currComment);

//   const handleSubmitEditComment = async (
//     e: React.FormEvent<HTMLFormElement>
//   ) => {
//     try {
//       e.preventDefault();
//       const response = await toast.promise(
//         postService.editComment(commentId, commentText),
//         {
//           pending: "Editing comment...",
//           success: "Comment updated successfully",
//           error: "Failed to edit comment",
//         },
//         toastOptions
//       );

//       setComment(commentText);
//       setAnchorEl(null);
//       setOpen(false);
//     } catch (error) {}
//   };

//   return (
//     <>
//       <button
//         onClick={() => setOpen(true)}
//         className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2"
//       >
//         <span className="text-lg">✏️</span>
//         Edit
//       </button>

//       {open && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div
//             className="bg-white rounded-lg w-full max-w-md transform transition-all"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Edit Comment
//                 </h3>
//                 <button
//                   onClick={() => setOpen(false)}
//                   className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>
//               </div>

//               <form onSubmit={handleSubmitEditComment} className="space-y-4">
//                 <div className="relative">
//                   <textarea
//                     autoFocus
//                     required
//                     value={commentText}
//                     onChange={(e) => setCommentText(e.target.value)}
//                     className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition duration-200"
//                     placeholder="Edit your comment..."
//                   />
//                 </div>

//                 <div className="flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => setOpen(false)}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default EditComment;































import React, { ReactNode, useState } from "react";
import { X, Save, XCircle } from 'lucide-react';
import { toast } from "react-toastify";
import postService from "@/utils/apiCalls/postService";
import { toastOptions } from "@/utils/toastOptions";

type Props = {
  commentId: string;
  currComment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  children: ReactNode;
};

const EditComment = ({
  commentId,
  currComment,
  setComment,
  setAnchorEl,
  children
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>(currComment);

  const handleSubmitEditComment = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await toast.promise(
        postService.editComment(commentId, commentText),
        {
          pending: "Editing comment...",
          success: "Comment updated successfully",
          error: "Failed to edit comment",
        },
        toastOptions
      );

      setComment(commentText);
      setAnchorEl(null);
      setOpen(false);
    } catch (error) {
      console.error("Edit comment error:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCommentText(currComment); // Reset to original comment if canceled
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {children}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-200">
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md transform transition-all duration-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Edit Comment
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <form onSubmit={handleSubmitEditComment} className="space-y-4">
                <div className="relative">
                  <textarea
                    autoFocus
                    required
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full min-h-[120px] p-4 border border-gray-200 dark:border-gray-700 rounded-xl
                    bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    outline-none resize-none transition duration-200
                    placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Edit your comment..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200
                    bg-gray-100 dark:bg-gray-700 rounded-lg
                    hover:bg-gray-200 dark:hover:bg-gray-600
                    focus:outline-none focus:ring-2 focus:ring-gray-400
                    transition duration-200 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" strokeWidth={1.5} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white
                    bg-blue-600 rounded-lg hover:bg-blue-700
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:ring-offset-2 transition duration-200
                    flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" strokeWidth={1.5} />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditComment;