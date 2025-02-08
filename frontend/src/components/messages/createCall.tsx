import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "../redux/SocketProvider";
import {
  MdCallEnd,
  MdCall,
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";
import { toastOptions } from "@/utils/toastOptions";
import { toast } from "react-toastify";

interface VideoCallModalProps {
  to: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const configuration = {
  iceServers: [
    { urls: "stun:stun.stunprotocol.org" },
    {
      urls: "turn:your-turn-server.com",
      username: "your-username",
      credential: "your-password",
    },
  ],
};

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  to,
  isOpen,
  onClose,
}) => {
  const socket = useSocket();
  if (!socket || !isOpen) return null;

  const [isCalling, setIsCalling] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const [connectionState, setConnectionState] =
    useState<string>("Not Connected");

  // Initialize peer connection
  useEffect(() => {
    if (isOpen) {
      peerRef.current = new RTCPeerConnection(configuration);

      peerRef.current.onconnectionstatechange = () => {
        if (peerRef.current) {
          setConnectionState(peerRef.current.connectionState);
          if (peerRef.current.connectionState === "failed") {
            handleEndCall();
          }
        }
      };

      peerRef.current.ontrack = ({ streams: [stream] }) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      };
    }

    return () => {
      if (peerRef.current) {
        peerRef.current.close();
      }
    };
  }, [isOpen]);

  // Handle cleanup
  useEffect(() => {
    return () => {
      if (isCalling) {
        handleEndCall();
      }
    };
  }, [isCalling]);

  // Socket event handlers
  useEffect(() => {
    if (!socket || !isOpen) return;

    const handleIncomingCall = async (data: {
      offer: RTCSessionDescriptionInit;
      from: string;
    }) => {
      console.log("Incoming call received");

      if (!peerRef.current || peerRef.current.signalingState !== "stable") {
        console.warn(
          "Cannot handle incoming call in current state:",
          peerRef.current?.signalingState
        );
        return;
      }

      try {
        setIsIncomingCall(true);
        await peerRef.current.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );

        localStreamRef.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }

        localStreamRef.current.getTracks().forEach((track) => {
          if (peerRef.current && localStreamRef.current) {
            peerRef.current.addTrack(track, localStreamRef.current);
          }
        });

        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);

        socket.emit("call:accepted", { answer, to: data.from });
      } catch (error) {
        console.error("Error handling incoming call:", error);
        handleEndCall();
      }
    };

    const handleIncomingAnswer = async (data: {
      offer: RTCSessionDescriptionInit;
    }) => {
      if (
        !peerRef.current ||
        peerRef.current.signalingState !== "have-local-offer"
      ) {
        console.warn(
          "Cannot process answer in current state:",
          peerRef.current?.signalingState
        );
        return;
      }

      try {
        await peerRef.current.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
      } catch (error) {
        console.error("Error setting remote description:", error);
        handleEndCall();
      }
    };

    socket.on("incoming:call", handleIncomingCall);
    socket.on("incoming:answer", handleIncomingAnswer);
    socket.on("call:error", (data: { message: string; code: string }) => {
      if (data.code === "USER_OFFLINE") {
        handleEndCall();
      }
    });

    // Add handler for when remote peer ends call
    socket.on("call:ended", () => {
      handleEndCall();
    });

    return () => {
      socket.off("incoming:call", handleIncomingCall);
      socket.off("incoming:answer", handleIncomingAnswer);
      socket.off("call:error");
      socket.off("call:ended");
    };
  }, [socket, isOpen]);

  const startVideoCall = async () => {
    if (!peerRef.current) return;

    setIsCalling(true);
    try {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }

      localStreamRef.current.getTracks().forEach((track) => {
        if (peerRef.current && localStreamRef.current) {
          peerRef.current.addTrack(track, localStreamRef.current);
        }
      });

      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);
      socket.emit("outgoing:call", { fromOffer: offer, to });
    } catch (error) {
      console.error("Error starting video call:", error);
      setIsCalling(false);
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff((prev) => !prev);
    }
  };

  const handleEndCall = () => {
    // Notify other peer that call has ended
    socket.emit("end:call", {
      to,
      from: socket.id, // Add sender's ID to help recipient identify who ended the call
    });

    // Stop all tracks
    localStreamRef.current?.getTracks().forEach((track) => track.stop());

    // Close peer connection
    if (peerRef.current) {
      peerRef.current.close();
    }

    // Reset video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Reset all states
    setIsCalling(false);
    setIsIncomingCall(false);
    setIsMuted(false);
    setIsVideoOff(false);

    // Close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-900 rounded-lg shadow-lg p-4 w-full max-w-4xl aspect-video relative">
        <video
          ref={remoteVideoRef}
          autoPlay
          className="w-full h-full rounded-lg object-cover"
        />
        <div className="absolute top-4 right-4 w-32 h-32">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className={`w-full h-full rounded-lg object-cover border-2 ${
              isVideoOff ? "border-red-500 bg-gray-800" : "border-blue-500"
            }`}
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              Video Off
            </div>
          )}
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            onClick={handleEndCall}
          >
            <MdCallEnd className="h-5 w-5" />
          </button>
          <button
            className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              isMuted
                ? "bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-500"
                : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
            }`}
            onClick={toggleMute}
          >
            {isMuted ? (
              <MdMicOff className="h-5 w-5" />
            ) : (
              <MdMic className="h-5 w-5" />
            )}
          </button>
          <button
            className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              isVideoOff
                ? "bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-500"
                : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
            }`}
            onClick={toggleVideo}
          >
            {isVideoOff ? (
              <MdVideocamOff className="h-5 w-5" />
            ) : (
              <MdVideocam className="h-5 w-5" />
            )}
          </button>
          <button
            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={startVideoCall}
            disabled={isCalling}
          >
            <MdCall className="h-5 w-5" />
          </button>
        </div>
        {isIncomingCall && !isCalling && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg animate-pulse">
            Incoming Call...
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallModal;
