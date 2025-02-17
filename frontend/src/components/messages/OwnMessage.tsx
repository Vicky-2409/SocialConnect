// import React from "react";

// type Props = {
//   message: string | React.ReactNode; // Can be text or JSX (e.g., images, attachments)
//   timestamp: string; // Timestamp of the message
//   messageId: string; // Unique identifier for the message
//   isDeleted: boolean; // Flag to check if the message is deleted
//   onDelete: (messageId: string) => void; // Function to handle message deletion
//   postId?:string
// };

// function OwnMessage({
//   message,
//   timestamp,
//   messageId,
//   isDeleted,
//   postId,
//   onDelete,
// }: Props) {
//   // Format timestamp to 12-hour format with AM/PM
//   const formattedTimestamp = new Date(timestamp).toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "numeric",
//     hour12: true,
//   });

//   const handleDelete = () => {
//     // Only allow deletion if the message is not already deleted
//     if (!isDeleted) {
//       onDelete(messageId);
//     }
//   };

//   return (
//     <div className="flex items-start justify-end mb-4 space-x-4">
//       {/* Message Bubble */}
//       <div className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm p-4 rounded-2xl shadow-md max-w-[26%]">
//         {/* Message or Attachment */}
//         <div
//           className="mt-2 break-words"
//           style={{
//             maxWidth: "300px", // Dynamically grow up to 300px
//             wordWrap: "break-word", // Ensure long words wrap correctly
//           }}
//         >
//           {/* Check if the message is deleted */}
//           {isDeleted ? (
//             <p className="italic text-gray-500">This message was deleted</p> // Display a deleted message placeholder
//           ) : typeof message === "string" ? (
//             <p>{message}</p> // Render text message
//           ) : (
//             message // Render attachment (e.g., image or custom JSX)
//           )}
//         </div>

//         {/* Timestamp */}
//         <div className="text-xs text-gray-200 text-right mt-2">
//           {formattedTimestamp}
//         </div>
//         {/* Delete Button */}
//         {!isDeleted && (
//           <button
//             onClick={handleDelete}
//             className="text-xs text-red-500 mt-2 hover:text-red-700"
//           >
//             Delete
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default OwnMessage;





























// import React from "react";

// type Props = {
//   message: string | React.ReactNode;
//   timestamp: string;
//   messageId: string;
//   isDeleted: boolean;
//   onDelete: (messageId: string) => void;
//   postId?: string;
// };

// function OwnMessage({
//   message,
//   timestamp,
//   messageId,
//   isDeleted,
//   postId,
//   onDelete,
// }: Props) {
//   // Format timestamp to 12-hour format with AM/PM
//   const formattedTimestamp = new Date(timestamp).toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "numeric",
//     hour12: true,
//   });

//   const handleDelete = (e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent triggering navigation when clicking delete
//     if (!isDeleted) {
//       onDelete(messageId);
//     }
//   };

//   const handleClick = () => {
//     if (postId) {
//       window.location.href = `/post/${postId}`;
//     }
//   };

//   return (
//     <div className="flex items-start justify-end mb-4 space-x-4">
//       <div 
//         className={`flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm p-4 rounded-2xl shadow-md max-w-[26%] ${postId ? 'cursor-pointer hover:opacity-90' : ''}`}
//         onClick={handleClick}
//       >
//         <div
//           className="mt-2 break-words"
//           style={{
//             maxWidth: "300px",
//             wordWrap: "break-word",
//           }}
//         >
//           {isDeleted ? (
//             <p className="italic text-gray-500">This message was deleted</p>
//           ) : typeof message === "string" ? (
//             <p>{message}</p>
//           ) : (
//             message
//           )}
//         </div>

//         <div className="text-xs text-gray-200 text-right mt-2">
//           {formattedTimestamp}
//         </div>
        
//         {!isDeleted && (
//           <button
//             onClick={handleDelete}
//             className="text-xs text-red-500 mt-2 hover:text-red-700"
//           >
//             Delete
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default OwnMessage;





















import React from 'react';
import { Trash2, ExternalLink } from 'lucide-react';

type Props = {
  message: string | React.ReactNode;
  timestamp: string;
  messageId: string;
  isDeleted: boolean;
  onDelete: (messageId: string) => void;
  postId?: string;
};

const OwnMessage = ({
  message,
  timestamp,
  messageId,
  isDeleted,
  postId,
  onDelete,
}: Props) => {
  const formattedTimestamp = new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDeleted) {
      onDelete(messageId);
    }
  };

  const handleClick = () => {
    if (postId) {
      window.location.href = `/post/${postId}`;
    }
  };

  return (
    <div className="flex justify-end mb-4 px-4">
      <div 
        className={`
          relative
          group
          max-w-xs md:max-w-sm lg:max-w-md
          ${postId ? 'cursor-pointer' : ''}
        `}
        onClick={handleClick}
      >
        <div className={`
          relative
          p-4
          rounded-2xl rounded-tr-sm
          shadow-sm
          transition-all duration-200
          ${isDeleted 
            ? 'bg-gray-100 dark:bg-gray-800' 
            : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
          }
          ${postId ? 'hover:shadow-md' : ''}
        `}>
          {/* Message Content */}
          <div className="break-words">
            {isDeleted ? (
              <p className="text-gray-500 dark:text-gray-400 italic text-sm">
                This message was deleted
              </p>
            ) : typeof message === "string" ? (
              <p className="text-white text-sm leading-relaxed">
                {message}
              </p>
            ) : (
              message
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              {!isDeleted && (
                <button
                  onClick={handleDelete}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 
                           hover:bg-red-500/20 rounded-full"
                  aria-label="Delete message"
                >
                  <Trash2 size={14} className="text-red-200 hover:text-red-300" />
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {postId && !isDeleted && (
                <span className="text-xs text-blue-100 flex items-center opacity-0 group-hover:opacity-100 
                               transition-opacity duration-200">
                  <ExternalLink size={12} className="mr-1" />
                  View Post
                </span>
              )}
              <span className="text-xs text-gray-200">
                {formattedTimestamp}
              </span>
            </div>
          </div>

          {/* Message Tail */}
          {/* <div className="absolute -right-2 top-0 w-4 h-4 overflow-hidden">
            <div className={`
              w-4 h-4 origin-bottom-left rotate-45 transform
              ${isDeleted 
                ? 'bg-gray-100 dark:bg-gray-800' 
                : 'bg-blue-500'
              }
            `} />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default OwnMessage;