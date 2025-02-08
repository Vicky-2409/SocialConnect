"use client";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { FiPaperclip } from "react-icons/fi";
import {
  FaPaperPlane,
  FaEllipsisV,
  FaSmile,
  FaVideo,
  FaTimes,
  FaImage,
  FaUserCircle,
  FaPhoneAlt,
} from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "../redux/SocketProvider";
import EmojiPicker from "emoji-picker-react";
import SingleMessage from "./SingleMessage";
import AddConversation from "./AddConversation";
import messageService from "@/utils/apiCalls/messageService";
import { IUser } from "@/types/types";
import VideoCallModal from "./createCall";
import { ChatEventEnum } from "@/redux/constants";
import userService from "@/utils/apiCalls/userService";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

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

function SingleConvo({
  currUser,
  showBack = false,
}: {
  currUser: IUser;
  showBack: boolean;
}) {
  const searchParams = useSearchParams();
  const socket = useSocket();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [sender, setsender] = useState("");
  const [currUserId, setCurrUserId] = useState("");
  const [senderData, setSenderData] = useState<IUser>();
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const convoId = searchParams.get("convoId");

  useEffect(() => {
    (async function () {
      try {
        if (convoId) {
          const messages = await messageService.getConvoMessages(convoId);
          const participants = await messageService.getParticipants(convoId);
          const senderDataa = await userService.getUserData(
            participants.senderId
          );

          setSenderData(senderDataa);

          setsender(participants.senderId);
          setCurrUserId(participants);

          setMessages(messages);
        }
      } catch (error: any) {
        alert(error.message);
      }
    })();
  }, [convoId]);

  useEffect(() => {
    if (!socket || !convoId || !sender) return;

    // Listen for typing events
    socket.on(`${ChatEventEnum.TYPING_EVENT}-${convoId}`, (userId: string) => {
      if (userId === sender) {
        setIsTyping(true);
        // Clear typing status after 3 seconds of no typing events
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    });

    // Listen for online status changes
    socket.on(ChatEventEnum.USER_ONLINE_EVENT, (userId: string) => {
      if (userId === sender) {
        setIsOnline(true);
      }
    });

    socket.on(ChatEventEnum.USER_OFFLINE_EVENT, (userId: string) => {
      if (userId === sender) {
        setIsOnline(false);
      }
    });

    // Check initial online status
    socket.emit(ChatEventEnum.CHECK_USER_ONLINE_EVENT, sender);

    return () => {
      socket.off(`${ChatEventEnum.TYPING_EVENT}-${convoId}`);
      socket.off(ChatEventEnum.USER_ONLINE_EVENT);
      socket.off(ChatEventEnum.USER_OFFLINE_EVENT);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, convoId, sender]);

  useEffect(() => {
    if (!socket) return;

    socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, onMessageReceived);

    return () => {
      socket.off(ChatEventEnum.MESSAGE_RECEIVED_EVENT, onMessageReceived);
    };
  }, [socket]);

  if (!convoId) return <AddConversation />;

  async function handleSubmitMessageSend(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      if (!convoId) return alert("Select a conversation");

      const formData = new FormData();
      formData.append("message", message);
      if (attachment) {
        formData.append("attachment", attachment);
      }

      const latestMessage = await messageService.sendMessage(convoId, formData);
      setMessages((messages) => [latestMessage, ...messages]);
      setMessage("");
      setAttachment(null); // Clear the attachment after sending
    } catch (error: any) {
      alert(error.message);
    }
  }

  function handleOnMessageChange(e: ChangeEvent<HTMLInputElement>) {
    setMessage(e.target.value);
    if (socket && convoId) {
      socket.emit(ChatEventEnum.TYPING_EVENT, {
        convoId,
        userId: currUser._id,
      });
    }
  }

  function handleOnEmojiClick(emojiObject: any) {
    setMessage((str) => str + emojiObject.emoji);
  }

  function handleAttachmentChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  }

  function onMessageReceived(latestMessage: Message) {
    setMessages((messages) => {
      // If the incoming message matches an existing one, update it as deleted
      if (latestMessage.isDeleted) {
        return messages.map(
          (msg) =>
            msg._id === latestMessage._id
              ? { ...msg, isDeleted: true } // Mark as deleted
              : msg // Leave other messages unchanged
        );
      } else {
        return [latestMessage, ...messages];
      }
    });
  }

  // Handle message deletion by marking it as deleted (not removing it)
  const handleDelete = async (messageId: string) => {
    const messages = await messageService.deleteMessage(convoId, messageId);

    setMessages((messages) => {
      const updatedMessages = messages.map((msg) =>
        msg._id === messageId
          ? { ...msg, isDeleted: true } // Mark the message as deleted
          : msg
      );

      console.log(
        updatedMessages,
        "Log the updated messages to see the change"
      ); // Log the updated messages to see the change

      return updatedMessages;
    });
  };

  const handleOpenCallModal = () => {
    console.log("open call modal");
    setShowVideoCallModal(true); // Show the modal when the video call button is clicked
  };

  const handleCloseCallModal = () => {
    console.log("close call modal");
    setShowVideoCallModal(false); // Close the modal if call is canceled
  };

  return (
    <div className="flex flex-col h-screen bg-white shadow-md">
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
        <div className="flex items-center space-x-4">
          {showBack && (
            <a href="/messages" className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </a>
          )}
          <div className="relative">
            {senderData?.profilePicUrl ? (
              <Image
                src={senderData.profilePicUrl}
                alt={`${senderData.firstName} ${senderData.lastName}`}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <FaUserCircle className="w-14 h-14 text-gray-400" />
            )}
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {senderData?.username}
            </h2>
            {isTyping && (
              <p className="text-sm text-gray-500 animate-pulse">typing...</p>
            )}
            {!isTyping && (
              <p className="text-sm text-gray-500">
                {isOnline ? "online" : "offline"}
              </p>
            )}
          </div>
        </div>
        {showVideoCallModal && (
          <VideoCallModal
            to={sender}
            isOpen={showVideoCallModal}
            onClose={() => setShowVideoCallModal(false)}
          />
        )}

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenCallModal}
            className="p-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 group"
          >
            <FaVideo className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="h-[90%] flex flex-col-reverse overflow-y-auto no-scrollbar px-4">
        {messages.length > 0 &&
          messages.map((msg) => (
            <SingleMessage
              key={msg._id}
              currUser={currUser}
              sender={msg.sender}
              message={msg.isDeleted ? "This message was deleted" : msg.message}
              timestamp={msg.updatedAt}
              isAttachment={msg.isAttachment}
              attachmentUrl={msg.attachmentUrl}
              isDeleted={msg.isDeleted}
              messageId={msg._id}
              onDelete={handleDelete}
            />
          ))}
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 relative border-t border-gray-200 bg-white px-6 py-4 mb-12">
        {emojiOpen && (
          <div className="absolute bottom-full mb-2 left-0 z-10">
            <EmojiPicker onEmojiClick={handleOnEmojiClick} />
          </div>
        )}

        <form
          className="flex items-center w-full space-x-3"
          onSubmit={handleSubmitMessageSend}
          encType="multipart/form-data"
        >
          <button
            type="button"
            onClick={() => setEmojiOpen((prev) => !prev)}
            className="flex-shrink-0 text-2xl text-gray-700 hover:text-blue-500 transition-colors"
          >
            😃
          </button>

          <input
            type="text"
            placeholder="Type a message..."
            name="message"
            value={message}
            onChange={handleOnMessageChange}
            className="flex-1 p-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />

          <label
            htmlFor="file-input"
            className="flex-shrink-0 p-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
          >
            <FiPaperclip className="text-xl" />
          </label>
          <input
            type="file"
            id="file-input"
            onChange={handleAttachmentChange}
            className="hidden"
          />

          <button
            type="submit"
            className="flex-shrink-0 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default SingleConvo;
