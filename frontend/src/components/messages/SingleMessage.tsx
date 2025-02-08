import React from "react";
import OwnMessage from "./OwnMessage";
import RecievedMessage from "./RecievedMessage";
import { IUser } from "@/types/types";

type props = {
  currUser: IUser;
  sender: { _id: string; username: string; profilePicUrl: string };
  message: string;
  timestamp: string;
  isAttachment: boolean;
  attachmentUrl?: string;
  isDeleted: boolean;
  messageId: string;
  onDelete: (messageId: string) => void;
};

function SingleMessage(props: props) {
  const {
    currUser,
    sender,
    message,
    timestamp,
    isAttachment,
    attachmentUrl,
    isDeleted,
    onDelete,
    messageId,
  } = props;

  if (!currUser) return <h1>Loading...</h1>;

  const isOwnMessage = currUser?._id === sender._id;

  // If the current user sent the message
  if (isOwnMessage) {
    // Handle the message gracefully if it's deleted

    if (isDeleted) {
      return (
        <OwnMessage
          message={
            <span className="text-gray-500 italic">
              This message was deleted
            </span>
          }
          timestamp={timestamp}
          isDeleted={true}
          onDelete={onDelete}
          messageId={messageId}
        />
      );
    }

    // If it's an attachment, display the image
    if (isAttachment && attachmentUrl) {
      return (
        <OwnMessage
          message={
            <img
              src={attachmentUrl}
              alt="attachment"
              style={{ maxWidth: "150px", maxHeight: "200px" }}
            />
          }
          timestamp={timestamp}
          isDeleted={false}
          onDelete={onDelete}
          messageId={messageId}
        />
      );
    }

    // If it's just a regular message
    return (
      <OwnMessage
        message={message}
        timestamp={timestamp}
        isDeleted={false}
        onDelete={onDelete}
        messageId={messageId}
      />
    );
  } else {
    // For received messages, handle attachments as well
    const { username, profilePicUrl } = sender;

    // Handle the message gracefully if it's deleted
    if (isDeleted) {
      return (
        <RecievedMessage
          username={username}
          profilePicUrl={profilePicUrl}
          message={
            <span className="text-gray-500 italic">
              This message was deleted
            </span>
          }
          timestamp={timestamp}
          isDeleted={true}
          onDelete={onDelete}
          messageId={messageId}
        />
      );
    }

    // Handle attachment for received message
    if (isAttachment && attachmentUrl) {
      return (
        <RecievedMessage
          username={username}
          profilePicUrl={profilePicUrl}
          message={
            <img
              src={attachmentUrl}
              alt="attachment"
              style={{ maxWidth: "150px", maxHeight: "200px" }}
            />
          }
          timestamp={timestamp}
          isDeleted={false}
          onDelete={onDelete}
          messageId={messageId}
        />
      );
    }

    // If no attachment, just show the regular message
    return (
      <RecievedMessage
        username={username}
        profilePicUrl={profilePicUrl}
        message={message}
        timestamp={timestamp}
        isDeleted={false}
        onDelete={onDelete}
        messageId={messageId}
      />
    );
  }
}

export default SingleMessage;
