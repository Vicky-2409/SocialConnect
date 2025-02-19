"use client";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { FiPaperclip } from "react-icons/fi";
import { FaVideo, FaUserCircle } from "react-icons/fa";
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
import { ArrowLeft, X } from "lucide-react";
import { toast } from "react-toastify";

// Types
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
  postId?: string;
  onDelete: (messageId: string) => void;
}

interface CallState {
  isIncoming: boolean;
  from: string;
  offer: RTCSessionDescriptionInit | null;
}

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];

// Custom hooks
const useMessages = (convoId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (newMessage: Message) => {
    setMessages((prev) => [newMessage, ...prev]);
  };

  const updateDeletedMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId ? { ...msg, isDeleted: true } : msg
      )
    );
  };

  const handleMessageReceived = (latestMessage: Message) => {
    setMessages((prev) => {
      if (latestMessage.isDeleted) {
        return prev.map((msg) =>
          msg._id === latestMessage._id ? { ...msg, isDeleted: true } : msg
        );
      }
      return [latestMessage, ...prev];
    });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!convoId) return;
      try {
        const fetchedMessages = await messageService.getConvoMessages(convoId);
        setMessages(fetchedMessages);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    fetchMessages();
  }, [convoId]);

  return { messages, addMessage, updateDeletedMessage, handleMessageReceived };
};

const useParticipant = (convoId: string | null) => {
  const [senderData, setSenderData] = useState<IUser>();
  const [sender, setSender] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchParticipant = async () => {
      if (!convoId) return;
      try {
        const participants = await messageService.getParticipants(convoId);
        const userData = await userService.getUserData(participants.senderId);
        setSenderData(userData);
        setSender(participants.senderId);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    fetchParticipant();
  }, [convoId]);

  return {
    senderData,
    sender,
    isOnline,
    setIsOnline,
    isTyping,
    setIsTyping,
    typingTimeoutRef,
  };
};

const useAttachment = () => {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.warning("Please select an image file (JPEG, PNG, or GIF)");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.warning("File size should be less than 5MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setAttachment(file);
  };

  const removeAttachment = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setAttachment(null);
    setPreviewUrl(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  return { attachment, previewUrl, handleAttachmentChange, removeAttachment };
};

function SingleConvo({
  currUser,
  showBack = false,
}: {
  currUser: IUser;
  showBack: boolean;
}) {
  const searchParams = useSearchParams();
  const socket = useSocket();
  const convoId = searchParams.get("convoId");

  const [message, setMessage] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [callState, setCallState] = useState<CallState>({
    isIncoming: false,
    from: "",
    offer: null,
  });
  const activeCallRef = useRef<{
    isIncoming: boolean;
    offer: RTCSessionDescriptionInit | null;
    from: string;
  } | null>(null);

  const { messages, addMessage, updateDeletedMessage, handleMessageReceived } =
    useMessages(convoId);
  const {
    senderData,
    sender,
    isOnline,
    setIsOnline,
    isTyping,
    setIsTyping,
    typingTimeoutRef,
  } = useParticipant(convoId);
  const { attachment, previewUrl, handleAttachmentChange, removeAttachment } =
    useAttachment();

  useEffect(() => {
    if (!socket || !convoId || !sender) return;

    socket.on(`${ChatEventEnum.TYPING_EVENT}-${convoId}`, (userId: string) => {
      if (userId === sender) {
        setIsTyping(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    });

    socket.on(ChatEventEnum.USER_ONLINE_EVENT, (userId: string) => {
      if (userId === sender) setIsOnline(true);
    });

    socket.on(ChatEventEnum.USER_OFFLINE_EVENT, (userId: string) => {
      if (userId === sender) setIsOnline(false);
    });

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

    socket.on("incoming:call", ({ offer, from }) => {
      // Store the call state immediately
      const callData = {
        isIncoming: true,
        offer,
        from
      };
      
      activeCallRef.current = callData;
      setCallState(callData);
    });

    socket.on("call:canceled", () => {
      toast.info("Call was canceled");
      activeCallRef.current = null;
      setCallState({ isIncoming: false, from: "", offer: null });
      setShowVideoCallModal(false);
    });

    return () => {
      socket.off("incoming:call");
      socket.off("call:canceled");
    };
  }, [socket]);

  if (!convoId) return <AddConversation />;

  const handleSubmitMessageSend = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (!convoId) return toast.info("Select a conversation");

      const formData = new FormData();
      formData.append("message", message);
      if (attachment) {
        formData.append("attachment", attachment);
      }

      const latestMessage = await messageService.sendMessage(convoId, formData);
      addMessage(latestMessage);
      setMessage("");
      removeAttachment();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleOnMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (socket && convoId) {
      socket.emit(ChatEventEnum.TYPING_EVENT, {
        convoId,
        userId: currUser._id,
      });
    }
  };

  const handleAcceptCall = () => {
    if (!activeCallRef.current) return;
    
    // Use the stored call state when opening the modal
    setShowVideoCallModal(true);
  };

  const handleDelete = async (messageId: string) => {
    await messageService.deleteMessage(convoId, messageId);
    updateDeletedMessage(messageId);
  };

  const handleStartVideoCall = () => {
    if (!isOnline) {
      toast.warning("User is offline");
      return;
    }
    setShowVideoCallModal(true);
  };

  const handleRejectCall = () => {
    if (socket && callState.from) {
      socket.emit("call:rejected", {
        to: sender,
        reason: "Call was declined by the recipient",
      });
      cleanupCall();
    }
  };

  const cleanupCall = () => {
    activeCallRef.current = null;
    setCallState({ isIncoming: false, from: "", offer: null });
    setShowVideoCallModal(false);
  };

  function handleOnEmojiClick(emojiObject: any) {
    setMessage((str) => str + emojiObject.emoji);
  }
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="flex-shrink-0 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showBack && (
                <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}

              <div className="flex items-center gap-3">
                <div className="relative">
                  {senderData?.profilePicUrl ? (
                    <Image
                      src={senderData.profilePicUrl}
                      alt={`${senderData.firstName} ${senderData.lastName}`}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
                      unoptimized
                    />
                  ) : (
                    <FaUserCircle className="w-12 h-12 text-gray-300" />
                  )}
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      isOnline ? "bg-green-400" : "bg-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <h2 className="text-base font-medium text-gray-900">
                    {senderData?.username}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isTyping ? "typing..." : isOnline ? "online" : "offline"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartVideoCall}
              className="p-2.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-all duration-200"
              disabled={!isOnline}
            >
              <FaVideo className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Incoming Call Alert */}
      {callState.isIncoming && !showVideoCallModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-4 max-w-sm w-full mx-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-medium text-gray-900">
                Incoming Call
              </h3>
              <button
                onClick={handleRejectCall}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {senderData?.username || "User"} is calling you
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleRejectCall}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => setShowVideoCallModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {showVideoCallModal && (
        <VideoCallModal
          to={sender}
          isOpen={showVideoCallModal}
          onClose={() => {
            setShowVideoCallModal(false);
            activeCallRef.current = null; 
            cleanupCall();
          }}
          isIncoming={callState.isIncoming}
          incomingOffer={callState.offer}
          incomingFrom={callState.from}
        />
      )}

      {/* Messages */}
      <div className="h-[90%] flex flex-col-reverse overflow-y-auto no-scrollbar px-4 py-6">
        {messages.map((msg) => (
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
            postId={msg.postId}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 py-4">
        <div className="max-w-screen-xl  relative mb-12">
          {emojiOpen && (
            <div className="absolute bottom-full mb-2 left-0 z-10">
              <EmojiPicker onEmojiClick={handleOnEmojiClick} />
            </div>
          )}

          {previewUrl && (
            <div className="absolute bottom-full mb-3 left-0 bg-gray-50 p-2 rounded-xl border border-gray-100">
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="attachment preview"
                  className="max-h-32 rounded-lg"
                />
                <button
                  onClick={removeAttachment}
                  className="absolute -top-2 -right-2 p-1.5 bg-gray-900/80 backdrop-blur-sm text-white rounded-full hover:bg-gray-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          <form
            className="flex items-center gap-3"
            onSubmit={handleSubmitMessageSend}
            encType="multipart/form-data"
          >
            <button
              type="button"
              onClick={() => setEmojiOpen((prev) => !prev)}
              className="p-2.5 text-xl text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
            >
              😊
            </button>

            <input
              type="text"
              placeholder="Type your message..."
              name="message"
              value={message}
              onChange={handleOnMessageChange}
              className="flex-1 p-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400"
            />

            <label
              htmlFor="file-input"
              className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full cursor-pointer transition-colors"
            >
              <FiPaperclip className="w-5 h-5" />
            </label>
            <input
              type="file"
              id="file-input"
              onChange={handleAttachmentChange}
              accept="image/*"
              className="hidden"
            />

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-500 text-white font-medium rounded-xl hover:bg-indigo-600 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SingleConvo;
