import React from "react";

type Props = {
  message: string | React.ReactNode; // Can be text or JSX (e.g., images, attachments)
  timestamp: string; // Timestamp of the message
  messageId: string; // Unique identifier for the message
  isDeleted: boolean; // Flag to check if the message is deleted
  onDelete: (messageId: string) => void; // Function to handle message deletion
};

function OwnMessage({
  message,
  timestamp,
  messageId,
  isDeleted,
  onDelete,
}: Props) {
  // Format timestamp to 12-hour format with AM/PM
  const formattedTimestamp = new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const handleDelete = () => {
    // Only allow deletion if the message is not already deleted
    if (!isDeleted) {
      onDelete(messageId);
    }
  };

  return (
    <div className="flex items-start justify-end mb-4 space-x-4">
      {/* Message Bubble */}
      <div className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm p-4 rounded-2xl shadow-md max-w-[26%]">
        {/* Message or Attachment */}
        <div
          className="mt-2 break-words"
          style={{
            maxWidth: "300px", // Dynamically grow up to 300px
            wordWrap: "break-word", // Ensure long words wrap correctly
          }}
        >
          {/* Check if the message is deleted */}
          {isDeleted ? (
            <p className="italic text-gray-500">This message was deleted</p> // Display a deleted message placeholder
          ) : typeof message === "string" ? (
            <p>{message}</p> // Render text message
          ) : (
            message // Render attachment (e.g., image or custom JSX)
          )}
        </div>

        {/* Timestamp */}
        <div className="text-xs text-gray-200 text-right mt-2">
          {formattedTimestamp}
        </div>

        {/* Delete Button */}
        {!isDeleted && (
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 mt-2 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default OwnMessage;
