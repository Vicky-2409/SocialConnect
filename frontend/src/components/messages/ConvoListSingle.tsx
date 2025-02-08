"use client";
import { formatDate, formatLastMessage } from "@/utils/formatString";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSocket } from "../redux/SocketProvider";
import { ChatEventEnum } from "@/redux/constants";

type Props = {
  convoId: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicUrl: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
};

interface Message {
  _id: string;
  convoId: string;
  sender: any;
  message: string;
  isAttachment: boolean;
  attachmentUrl?: string;
  updatedAt: string;
  isDeleted: boolean;
  messageId: string;
  onDelete: (messageId: string) => void;
}

function ConvoListSingle(props: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    convoId,
    username,
    firstName,
    lastName,
    profilePicUrl,
    unreadCount: initialUnreadCount,
    timestamp: rawTimestamp,
    lastMessage: rawLastMessage,
  } = props;

  const [unreadCounts, setUnreadCounts] = useState(initialUnreadCount);
  const [lastMessage, setLastMessage] = useState(
    formatLastMessage(rawLastMessage)
  );

  // Format timestamp and last message
  const timestamp = formatDate(rawTimestamp);

  const currentConvoId = searchParams.get("convoId");
  const isSelected = currentConvoId === convoId;

  useEffect(() => {
    setUnreadCounts(initialUnreadCount); // Update unread counts when props change
  }, [initialUnreadCount]);

  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    function onMessageReceived(latestMessage: Message) {
      if (convoId === latestMessage.convoId) {
        setLastMessage(formatLastMessage(latestMessage.message));
      }
    }

    socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, onMessageReceived);
    socket.on(ChatEventEnum.MESSAGE_SENT_EVENT, onMessageReceived);

    return () => {
      socket.off(ChatEventEnum.MESSAGE_SENT_EVENT, onMessageReceived);
      socket.off(ChatEventEnum.MESSAGE_RECEIVED_EVENT, onMessageReceived);
    };
  }, [socket]);

  function handleButtonClick() {
    setUnreadCounts(0); // Clear unread count on click
    router.push(`/messages?convoId=${convoId}`);
  }

  return (
    <div
      className={`w-full flex p-4 rounded-xl transition-all duration-200 cursor-pointer ${
        isSelected
          ? "bg-white shadow-lg transform scale-105 border-2 border-blue-500"
          : "bg-gray-100 hover:shadow-md"
      }`}
      onClick={handleButtonClick}
    >
      {/* Profile Picture */}
      <div className="flex-shrink-0">
        <Image
          src={profilePicUrl}
          alt={`${firstName} ${lastName}`}
          width={56}
          height={56}
          className="h-14 w-14 rounded-full object-cover"
          unoptimized
        />
      </div>

      {/* Conversation Details */}
      <div className="ml-4 flex-grow flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-gray-800 text-base">{`${firstName} ${lastName}`}</h2>
            <p className="text-sm text-gray-600">@{username}</p>
          </div>
          <div className="text-xs text-gray-500">{timestamp}</div>
        </div>

        {/* Last Message */}
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-700 truncate max-w-[80%]">
            {lastMessage}
          </p>
          {unreadCounts > 0 && (
            <div className="flex items-center justify-center h-6 w-6 bg-blue-500 text-white text-xs font-semibold rounded-full">
              {unreadCounts}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConvoListSingle;
