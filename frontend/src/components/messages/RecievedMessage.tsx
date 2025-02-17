// import Image from "next/image";
// import React from "react";

// type Props = {
//   username: string; // Sender's name
//   profilePicUrl: string; // Sender's profile picture URL
//   message: string | React.ReactNode; // Can be text or JSX (e.g., images, attachments)
//   timestamp: string; // Timestamp of the message
//   isDeleted: boolean; // Flag to check if the message is deleted
//   messageId: string; // Unique identifier for the message
//   onDelete: (messageId: string) => void; // Function to handle message deletion (not used here)
//   postId?:string
// };

// function RecievedMessage({
//   username,
//   profilePicUrl,
//   message,
//   timestamp,
//   isDeleted,
//   postId
// }: Props) {
//   // Format timestamp to 12-hour format with AM/PM
//   const formattedTimestamp = new Date(timestamp).toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "numeric",
//     hour12: true,
//   });

//   return (
//     <div className="flex items-start mb-4 space-x-4">
//       {/* Profile Picture */}
//       <div className="flex-shrink-0">
//         <Image
//           src={profilePicUrl}
//           alt={`${username}'s profile`}
//           width={36}
//           height={36}
//           className="rounded-full object-cover shadow-sm"
//           unoptimized
//         />
//       </div>

//       {/* Message Bubble */}
//       <div className="flex-1 bg-white text-sm p-3 rounded-2xl shadow-md max-w-[26%]">
//         {/* Sender Name */}
//         <div className="font-semibold text-gray-700">{username}</div>

//         {/* Message or Attachment */}
//         <div
//           className="text-gray-800 mt-2 break-words"
//           style={{
//             maxWidth: "300px", // Dynamically grow up to 300px
//             wordWrap: "break-word", // Ensure long words wrap correctly
//           }}
//         >
//           {isDeleted ? (
//             <p className="italic text-gray-500">This message was deleted</p> // Display a deleted message placeholder
//           ) : typeof message === "string" ? (
//             <p>{message}</p> // Render text message
//           ) : (
//             message // Render attachment (e.g., image or custom JSX)
//           )}
//         </div>

//         {/* Timestamp */}
//         <div className="text-xs text-gray-500 text-right mt-2">
//           {formattedTimestamp}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RecievedMessage;























// "use client"
// import Image from "next/image";
// import React from "react";
// import { useRouter } from "next/navigation";

// type Props = {
//   username: string;
//   profilePicUrl: string;
//   message: string | React.ReactNode;
//   timestamp: string;
//   isDeleted: boolean;
//   messageId: string;
//   onDelete: (messageId: string) => void;
//   postId?: string;
// };

// function ReceivedMessage({
//   username,
//   profilePicUrl,
//   message,
//   timestamp,
//   isDeleted,
//   postId
// }: Props) {
//   const router = useRouter();

//   const handleMessageClick = () => {
//     if (postId) {
//       router.push(`/post/${postId}`);
//     }
//   };

//   // Format timestamp to 12-hour format with AM/PM
//   const formattedTimestamp = new Date(timestamp).toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "numeric",
//     hour12: true,
//   });

//   return (
//     <div className="flex items-start mb-4 space-x-4">
//       {/* Profile Picture */}
//       <div className="flex-shrink-0">
//         <Image
//           src={profilePicUrl}
//           alt={`${username}'s profile`}
//           width={36}
//           height={36}
//           className="rounded-full object-cover shadow-sm"
//           unoptimized
//         />
//       </div>

//       {/* Message Bubble */}
//       <div 
//         className={`flex-1 bg-white text-sm p-3 rounded-2xl shadow-md max-w-[26%] ${postId ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
//         onClick={handleMessageClick}
//       >
//         {/* Sender Name */}
//         <div className="font-semibold text-gray-700">{username}</div>

//         {/* Message or Attachment */}
//         <div
//           className="text-gray-800 mt-2 break-words"
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

//         {/* Timestamp */}
//         <div className="text-xs text-gray-500 text-right mt-2">
//           {formattedTimestamp}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ReceivedMessage;























// "use client"
// import Image from "next/image";
// import React from "react";
// import { useRouter } from "next/navigation";

// type Props = {
//   username: string;
//   profilePicUrl: string;
//   message: string | React.ReactNode;
//   timestamp: string;
//   isDeleted: boolean;
//   messageId: string;
//   onDelete: (messageId: string) => void;
//   postId?: string;
// };

// function ReceivedMessage({
//   username,
//   profilePicUrl,
//   message,
//   timestamp,
//   isDeleted,
//   postId
// }: Props) {
//   const router = useRouter();

//   const handleMessageClick = () => {
//     if (postId) {
//       router.push(`/post/${postId}`);
//     }
//   };

//   const formattedTimestamp = new Date(timestamp).toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "numeric",
//     hour12: true,
//   });

//   return (
//     <div className="flex items-start mb-4 space-x-3 group">
//       {/* Profile Picture with hover effect */}
//       <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
//         <Image
//           src={profilePicUrl}
//           alt={`${username}'s profile`}
//           width={36}
//           height={36}
//           className="rounded-full object-cover shadow-md ring-2 ring-gray-100"
//           unoptimized
//         />
//       </div>

//       {/* Message Container */}
//       <div className="flex flex-col max-w-[300px]">
//         {/* Username */}
//         <span className="text-xs font-medium text-gray-600 mb-1 ml-2">
//           {username}
//         </span>

//         {/* Message Bubble */}
//         <div 
//           onClick={handleMessageClick}
//           className={`
//             relative bg-white text-sm p-3.5 rounded-2xl shadow-sm
//             rounded-tl-none border border-gray-100
//             ${postId ? 'cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:shadow-md' : ''}
//           `}
//         >
//           {/* Message Content */}
//           <div className="text-gray-800 break-words">
//             {isDeleted ? (
//               <p className="italic text-gray-500 flex items-center space-x-1">
//                 <span className="inline-block w-4 h-4">🗑️</span>
//                 <span>This message was deleted</span>
//               </p>
//             ) : typeof message === "string" ? (
//               <p className="leading-relaxed">{message}</p>
//             ) : (
//               message
//             )}
//           </div>

//           {/* Timestamp */}
//           <div className="text-[11px] text-gray-400 text-right mt-1">
//             {formattedTimestamp}
//           </div>

//           {/* Subtle left pointer */}
//           <div className="absolute -left-2 top-0 w-2 h-4 overflow-hidden">
//             <div className="absolute w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45 -translate-x-1/2 -translate-y-1/2">
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ReceivedMessage;































"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";

type Props = {
  username: string;
  profilePicUrl: string;
  message: string | React.ReactNode;
  timestamp: string;
  isDeleted: boolean;
  messageId: string;
  onDelete: (messageId: string) => void;
  postId?: string;
};

const ReceivedMessage = ({
  username,
  profilePicUrl,
  message,
  timestamp,
  isDeleted,
  postId
}: Props) => {
  const router = useRouter();

  const handleMessageClick = () => {
    if (postId) {
      router.push(`/post/${postId}`);
    }
  };

  const formattedTimestamp = new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="flex items-start space-x-3 mb-4 px-2 group">
      {/* Profile Picture Container */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 transform transition-transform duration-300 group-hover:scale-105">
          <Image
            src={profilePicUrl}
            alt={`${username}'s profile`}
            width={40}
            height={40}
            className="rounded-full object-cover ring-2 ring-gray-100 hover:ring-blue-200 
                     transition-all duration-300 shadow-sm hover:shadow-md"
            unoptimized
          />
        </div>
      </div>

      {/* Message Content Container */}
      <div className="flex flex-col max-w-xs md:max-w-sm lg:max-w-md min-w-[200px]">
        {/* Username */}
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
          {username}
        </span>

        {/* Message Bubble */}
        <div
          onClick={handleMessageClick}
          className={`
            relative 
            bg-white dark:bg-gray-800 
            p-4 
            rounded-2xl rounded-tl-sm
            shadow-sm
            border border-gray-100 dark:border-gray-700
            transition-all duration-200
            ${postId ? 'cursor-pointer hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-750' : ''}
          `}
        >
          {/* Message Content */}
          <div className="break-words">
            {isDeleted ? (
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 italic">
                <span className="inline-block w-4 h-4 opacity-70">🗑️</span>
                <span className="text-sm">This message was deleted</span>
              </div>
            ) : typeof message === "string" ? (
              <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                {message}
              </p>
            ) : (
              message
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              {postId && !isDeleted && (
                <span className="text-xs text-blue-500 dark:text-blue-400 flex items-center 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ExternalLink size={12} className="mr-1" />
                  View Post
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formattedTimestamp}
            </span>
          </div>

          {/* Message Tail */}
          <div className="absolute -left-2 top-0 w-4 h-4 overflow-hidden">
            <div className="absolute w-4 h-4 bg-white dark:bg-gray-800 border-l border-t 
                          border-gray-100 dark:border-gray-700 transform rotate-45 
                          -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivedMessage;