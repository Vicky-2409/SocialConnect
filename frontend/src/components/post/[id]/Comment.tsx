// import { IComment } from "@/types/types";
// import { formatDate } from "@/utils/formatString";
// import Image from "next/image";
// import React, { useState } from "react";
// import BasicPopoverComments from "./BasicPopoverComments";

// type Props = {
//   commentData: IComment;
//   currentUserId: string;
//   postId: string;
// };

// function Comment({ commentData, currentUserId, postId }: Props) {
//   const { _id, userId, profilePicUrl, username, updatedAt, replies } =
//     commentData;


//   const [comment, setComment] = useState(commentData.comment);
//   const [showReplies, setShowReplies] = useState(false);
//   const [commentReplies, setCommentReplies] = useState<IComment[]>(
//     replies || []
//   );

//   const timestamp = formatDate(updatedAt);
//   const isOwnComment = userId === currentUserId;

//   const handleAddReply = async (replyText: string) => {
//     try {
//       // Implement reply submission logic
//       // Example:
//       // const newReply = await postService.addReply(postId, _id, replyText);
//       // setCommentReplies([newReply, ...commentReplies]);
//     } catch (error) {
//       console.error("Failed to add reply", error);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col md:flex-row items-start md:items-center bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 mt-3">
//         {/* Profile Image */}
//         <div className="flex-shrink-0">
//           <a href={`/profile/${username}`}>
//             <Image
//               src={profilePicUrl}
//               alt="Profile Pic"
//               width={500}
//               height={500}
//               unoptimized
//               className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-gray-300 hover:border-blue-500 transition-all"
//             />
//           </a>
//         </div>

//         {/* Comment Content */}
//         <div className="flex-grow pl-4">
//           <div className="flex items-center justify-between">
//             {/* Username */}
//             <a
//               href={`/profile/${username}`}
//               className="text-blue-600 font-semibold text-sm md:text-md hover:underline"
//             >
//               @{username}
//             </a>
//             {/* Timestamp */}
//             <span className="text-gray-400 text-xs md:text-sm">
//               {timestamp}
//             </span>
//           </div>

//           {/* Comment Text */}
//           <p className="text-gray-700 text-sm md:text-base mt-2">{comment}</p>

//           {/* Replies Section */}
//           {commentReplies.length > 0 && (
//             <div className="mt-3">
//               <button
//                 onClick={() => setShowReplies(!showReplies)}
//                 className="text-blue-500 text-sm hover:underline"
//               >
//                 {showReplies
//                   ? `Hide ${commentReplies.length} Replies`
//                   : `Show ${commentReplies.length} Replies`}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="mt-2 md:mt-0 md:ml-4 flex-shrink-0">
//           <BasicPopoverComments
//             commentId={_id}
//             isOwnComment={isOwnComment}
//             currComment={comment}
//             setComment={setComment}
//             postId={postId}
//           />
//         </div>
//       </div>

//       {/* Replies Display */}
//       {showReplies && commentReplies.length > 0 && (
//         <div className="pl-12 space-y-2">
//           {commentReplies.map((reply: IComment) => (
//             <Comment
//               key={reply._id}
//               commentData={prepareCommentData(reply)}
//               currentUserId={currentUserId}
//               postId={postId}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Comment;

// function prepareCommentData(singleCommentData: any): IComment {


//   const { _id, userId, comment, updatedAt, createdAt, replies } =
//     singleCommentData;
//   const { profilePicUrl, username } = userId;

//   return {
//     _id,
//     userId: userId._id,
//     profilePicUrl,
//     username,
//     comment,
//     updatedAt,
//     createdAt,
//     replies,
//   };
// }











































// import React, { useState } from "react";
// import Image from "next/image";
// import { IComment } from "@/types/types";
// import { formatDate } from "@/utils/formatString";
// import BasicPopoverComments from "./BasicPopoverComments";

// type Props = {
//   commentData: IComment;
//   currentUserId: string;
//   postId: string;
//   isReply?: boolean;
// };

// function Comment({ commentData, currentUserId, postId, isReply = false }: Props) {
//   const { _id, userId, profilePicUrl, username, updatedAt, replies } = commentData;
//   const [comment, setComment] = useState(commentData.comment);
//   const [showReplies, setShowReplies] = useState(false);
//   const [commentReplies, setCommentReplies] = useState<IComment[]>(replies || []);

//   const timestamp = formatDate(updatedAt);
//   const isOwnComment = userId === currentUserId;

//   const handleAddReply = async (replyText: string) => {
//     try {
//       // Implement reply submission logic
//       // Example:
//       // const newReply = await postService.addReply(postId, _id, replyText);
//       // setCommentReplies([newReply, ...commentReplies]);
//     } catch (error) {
//       console.error("Failed to add reply", error);
//     }
//   };

//   return (
//     <div className={`relative ${isReply ? 'ml-4' : ''}`}>
//       {/* Main Comment Container */}
//       <div className="flex gap-3 relative">
//         {/* Profile Picture */}
//         <div className="flex-shrink-0 relative z-10">
//           <a href={`/profile/${username}`} className="block w-8 h-8">
//             <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-white">
//               <Image
//                 src={profilePicUrl}
//                 alt={username}
//                 fill
//                 className="object-cover"
//                 unoptimized
//               />
//             </div>
//           </a>
//         </div>

//         {/* Comment Content */}
//         <div className="flex-1 min-w-0">
//           <div className="bg-gray-50 rounded-2xl px-4 py-3 hover:bg-gray-100 transition-colors duration-200">
//             {/* Header: Username & Timestamp */}
//             <div className="flex items-center justify-between mb-1">
//               <a
//                 href={`/profile/${username}`}
//                 className="font-medium text-sm text-gray-900 hover:text-blue-600 transition-colors duration-200"
//               >
//                 @{username}
//               </a>
//               <span className="text-xs text-gray-500">{timestamp}</span>
//             </div>

//             {/* Comment Text */}
//             <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">
//               {comment}
//             </p>

//             {/* Actions Bar */}
//             <div className="flex items-center gap-4 mt-2">
//               {commentReplies.length > 0 && (
//                 <button
//                   onClick={() => setShowReplies(!showReplies)}
//                   className="text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
//                 >
//                   <svg
//                     className={`w-4 h-4 transition-transform duration-200 ${
//                       showReplies ? 'rotate-180' : ''
//                     }`}
//                     fill="none"
//                     strokeWidth="2"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M19 9l-7 7-7-7" />
//                   </svg>
//                   {showReplies ? 'Hide' : 'Show'} {commentReplies.length} replies
//                 </button>
//               )}
              
//               <div className="ml-auto">
//                 <BasicPopoverComments
//                   commentId={_id}
//                   isOwnComment={isOwnComment}
//                   currComment={comment}
//                   setComment={setComment}
//                   postId={postId}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Nested Replies */}
//           {showReplies && commentReplies.length > 0 && (
//             <div className="relative mt-2">
//               {/* Vertical Thread Line */}
//               <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
              
//               {/* Replies Container */}
//               <div className="space-y-3">
//                 {commentReplies.map((reply: IComment, index) => (
//                   <div key={reply._id} className="relative">
//                     {/* Horizontal Thread Line */}
//                     <div className="absolute left-4 top-4 w-4 h-px bg-gray-200" />
//                     <Comment
//                       commentData={prepareCommentData(reply)}
//                       currentUserId={currentUserId}
//                       postId={postId}
//                       isReply={true}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Comment;

// function prepareCommentData(singleCommentData: any): IComment {
//   const { _id, userId, comment, updatedAt, createdAt, replies } = singleCommentData;
//   const { profilePicUrl, username } = userId;

//   return {
//     _id,
//     userId: userId._id,
//     profilePicUrl,
//     username,
//     comment,
//     updatedAt,
//     createdAt,
//     replies,
//   };
// }


















// import React, { useState } from "react";
// import Image from "next/image";
// import { IComment } from "@/types/types";
// import { formatDate } from "@/utils/formatString";
// import BasicPopoverComments from "./BasicPopoverComments";

// type Props = {
//   commentData: IComment;
//   currentUserId: string;
//   postId: string;
//   isReply?: boolean;
// };

// function Comment({ commentData, currentUserId, postId, isReply = false }: Props) {
//   const { _id, userId, profilePicUrl, username, updatedAt, replies } = commentData;
//   const [comment, setComment] = useState(commentData.comment);
//   const [showReplies, setShowReplies] = useState(false);
//   const [commentReplies, setCommentReplies] = useState<IComment[]>(replies || []);

//   const timestamp = formatDate(updatedAt);
//   const isOwnComment = userId === currentUserId;

//   const handleAddReply = async (replyText: string) => {
//     try {
//       // Implement reply submission logic
//       // Example:
//       // const newReply = await postService.addReply(postId, _id, replyText);
//       // setCommentReplies([newReply, ...commentReplies]);
//     } catch (error) {
//       console.error("Failed to add reply", error);
//     }
//   };

//   return (
//     <div className="relative">
//       {/* Main Comment Container */}
//       <div className="flex gap-3">
//         {/* Left Thread Line Container */}
//         {isReply && (
//           <div className="absolute left-4 top-0 -bottom-3 w-px bg-gray-200" />
//         )}
        
//         {/* Profile Picture */}
//         <div className="flex-shrink-0 relative z-10">
//           <a href={`/profile/${username}`} className="block w-8 h-8">
//             <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-white">
//               <Image
//                 src={profilePicUrl}
//                 alt={username}
//                 fill
//                 className="object-cover"
//                 unoptimized
//               />
//             </div>
//           </a>
//         </div>

//         {/* Comment Content */}
//         <div className="flex-1 min-w-0">
//           <div className="bg-gray-50 rounded-2xl px-4 py-3 hover:bg-gray-100 transition-colors duration-200">
//             {/* Header: Username & Timestamp */}
//             <div className="flex items-center justify-between mb-1">
//               <a
//                 href={`/profile/${username}`}
//                 className="font-medium text-sm text-gray-900 hover:text-blue-600 transition-colors duration-200"
//               >
//                 @{username}
//               </a>
//               <span className="text-xs text-gray-500">{timestamp}</span>
//             </div>

//             {/* Comment Text */}
//             <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">
//               {comment}
//             </p>

//             {/* Actions Bar */}
//             <div className="flex items-center gap-4 mt-2">
//               {commentReplies.length > 0 && (
//                 <button
//                   onClick={() => setShowReplies(!showReplies)}
//                   className="text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
//                 >
//                   <svg
//                     className={`w-4 h-4 transition-transform duration-200 ${
//                       showReplies ? 'rotate-180' : ''
//                     }`}
//                     fill="none"
//                     strokeWidth="2"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M19 9l-7 7-7-7" />
//                   </svg>
//                   {showReplies ? 'Hide' : 'Show'} {commentReplies.length} replies
//                 </button>
//               )}
              
//               <div className="ml-auto">
//                 <BasicPopoverComments
//                   commentId={_id}
//                   isOwnComment={isOwnComment}
//                   currComment={comment}
//                   setComment={setComment}
//                   postId={postId}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Nested Replies */}
//           {showReplies && commentReplies.length > 0 && (
//             <div className="mt-3 space-y-3">
//               {commentReplies.map((reply: IComment) => (
//                 <div key={reply._id} className="relative">
//                   {/* Horizontal connector for replies */}
//                   <div className="absolute left-4 top-4 w-4 h-px bg-gray-200" />
//                   <Comment
//                     commentData={prepareCommentData(reply)}
//                     currentUserId={currentUserId}
//                     postId={postId}
//                     isReply={true}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Comment;

// function prepareCommentData(singleCommentData: any): IComment {
//   const { _id, userId, comment, updatedAt, createdAt, replies } = singleCommentData;
//   const { profilePicUrl, username } = userId;

//   return {
//     _id,
//     userId: userId._id,
//     profilePicUrl,
//     username,
//     comment,
//     updatedAt,
//     createdAt,
//     replies,
//   };
// }






























import React, { useState } from "react";
import Image from "next/image";
import { IComment } from "@/types/types";
import { formatDate } from "@/utils/formatString";
import BasicPopoverComments from "./BasicPopoverComments";

type Props = {
  commentData: IComment;
  currentUserId: string;
  postId: string;
};

function Comment({ commentData, currentUserId, postId }: Props) {
  const { _id, userId, profilePicUrl, username, updatedAt, replies } = commentData;
  const [isVisible, setIsVisible] = useState(true);
  const [comment, setComment] = useState(commentData.comment);
  const [showReplies, setShowReplies] = useState(false);
  const [commentReplies, setCommentReplies] = useState<IComment[]>(replies || []);
    const [newCommentReplies, setNewCommentReplies] = useState<IComment[]>([]);

  const timestamp = formatDate(updatedAt);
  const isOwnComment = userId === currentUserId;

  const handleDeleteComment = () => {
    setIsVisible(false);
  };

  const handleAddReply = (newReply: IComment) => {
    setNewCommentReplies((prevReplies) => [newReply, ...prevReplies]);
    setShowReplies(true);
  };


  if (!isVisible) return null;

  return (
    <div className="w-full">
      {/* Comment Container */}
      <div className="flex gap-3 bg-white">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <a href={`/profile/${username}`} className="block w-8 h-8">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-white">
              <Image
                src={profilePicUrl}
                alt={username}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </a>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-2xl px-4 py-3 hover:bg-gray-100 transition-colors duration-200">
            {/* Header: Username & Timestamp */}
            <div className="flex items-center justify-between mb-1">
              <a
                href={`/profile/${username}`}
                className="font-medium text-sm text-gray-900 hover:text-blue-600 transition-colors duration-200"
              >
                @{username}
              </a>
              <span className="text-xs text-gray-500">{timestamp}</span>
            </div>

            {/* Comment Text */}
            <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">
              {comment}
            </p>

            {/* Actions Bar */}
            <div className="flex items-center gap-4 mt-2">
              {commentReplies.length > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showReplies ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                  {showReplies ? 'Hide' : 'Show'} {commentReplies.length} replies
                </button>
              )}
              
              <div className="ml-auto">
                <BasicPopoverComments
                  commentId={_id}
                  isOwnComment={isOwnComment}
                  currComment={comment}
                  setComment={setComment}
                  postId={postId}
                  onDelete={handleDeleteComment}
                  onAddReply={handleAddReply}
                />
              </div>
            </div>
          </div>

          {/* Replies */}
          {showReplies && commentReplies.length > 0 && (
            <div className="space-y-3 mt-3">
                      {newCommentReplies.map((comment) => (
                        <Comment
                          key={`new-${comment._id}`}
                          commentData={comment}
                          currentUserId={userId}
                          postId={postId}
                        />
                      ))}
              {commentReplies.map((reply: IComment) => (
                <Comment
                  key={reply._id}
                  commentData={prepareCommentData(reply)}
                  currentUserId={currentUserId}
                  postId={postId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment;

function prepareCommentData(singleCommentData: any): IComment {
  const { _id, userId, comment, updatedAt, createdAt, replies } = singleCommentData;
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