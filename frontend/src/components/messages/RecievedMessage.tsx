import Image from "next/image";
import React from "react";

type Props = {
  username: string; // Sender's name
  profilePicUrl: string; // Sender's profile picture URL
  message: string | React.ReactNode; // Can be text or JSX (e.g., images, attachments)
  timestamp: string; // Timestamp of the message
  isDeleted: boolean; // Flag to check if the message is deleted
  messageId: string; // Unique identifier for the message
  onDelete: (messageId: string) => void; // Function to handle message deletion (not used here)
};

function RecievedMessage({
  username,
  profilePicUrl,
  message,
  timestamp,
  isDeleted,
}: Props) {
  // Format timestamp to 12-hour format with AM/PM
  const formattedTimestamp = new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="flex items-start mb-4 space-x-4">
      {/* Profile Picture */}
      <div className="flex-shrink-0">
        <Image
          src={profilePicUrl}
          alt={`${username}'s profile`}
          width={36}
          height={36}
          className="rounded-full object-cover shadow-sm"
          unoptimized
        />
      </div>

      {/* Message Bubble */}
      <div className="flex-1 bg-white text-sm p-3 rounded-2xl shadow-md max-w-[26%]">
        {/* Sender Name */}
        <div className="font-semibold text-gray-700">{username}</div>

        {/* Message or Attachment */}
        <div
          className="text-gray-800 mt-2 break-words"
          style={{
            maxWidth: "300px", // Dynamically grow up to 300px
            wordWrap: "break-word", // Ensure long words wrap correctly
          }}
        >
          {isDeleted ? (
            <p className="italic text-gray-500">This message was deleted</p> // Display a deleted message placeholder
          ) : typeof message === "string" ? (
            <p>{message}</p> // Render text message
          ) : (
            message // Render attachment (e.g., image or custom JSX)
          )}
        </div>

        {/* Timestamp */}
        <div className="text-xs text-gray-500 text-right mt-2">
          {formattedTimestamp}
        </div>
      </div>
    </div>
  );
}

export default RecievedMessage;
