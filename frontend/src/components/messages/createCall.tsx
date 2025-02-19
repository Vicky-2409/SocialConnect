// import React, { useState, useRef, useEffect } from "react";
// import { useSocket } from "../redux/SocketProvider";
// import {
//   Mic,
//   MicOff,
//   Phone,
//   PhoneOff,
//   Signal,
//   User,
//   Video,
//   VideoOff,
// } from "lucide-react";
// import { toast } from "react-toastify";

// // Types and Interfaces
// interface VideoCallModalProps {
//   to: string;
//   isOpen: boolean;
//   onClose: () => void;
//   isIncoming: boolean;
//   incomingOffer: RTCSessionDescriptionInit | null;
//   incomingFrom: string;
// }

// interface MediaState {
//   isMuted: boolean;
//   isVideoOff: boolean;
//   isRemoteMuted: boolean;
//   isRemoteVideoOff: boolean;
// }

// // WebRTC Configuration
// const RTCConfig = {
//   iceServers: [
//     { urls: "stun:stun.stunprotocol.org" },
//     {
//       urls: "turn:your-turn-server.com",
//       username: "your-username",
//       credential: "your-password",
//     },
//   ],
// };

// const VideoCallModal: React.FC<VideoCallModalProps> = ({
//   to,
//   isOpen,
//   onClose,
//   isIncoming,
//   incomingOffer = null,
//   incomingFrom = "",
// }) => {
//   console.log(to, isOpen, onClose, isIncoming, incomingOffer, incomingFrom);
//   console.debug(
//     "Debug Log:",
//     to,
//     isOpen,
//     onClose,
//     isIncoming,
//     incomingOffer,
//     incomingFrom
//   );
//   const socket = useSocket();
//   const callInitializedRef = useRef(false);
//   if (!socket || !isOpen) return null;

//   const initializationRef = useRef(false);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [callState, setCallState] = useState({
//     isCalling: false,
//     callEstablished: false,
//     connectionState: "Not Connected" as string,
//     callInitiated: false,
//     callId: Date.now().toString(), // Add unique call ID
//   });

//   // State Management

//   const [mediaState, setMediaState] = useState<MediaState>({
//     isMuted: false,
//     isVideoOff: false,
//     isRemoteMuted: false,
//     isRemoteVideoOff: false,
//   });

//   // Refs
//   const refs = {
//     localVideo: useRef<HTMLVideoElement>(null),
//     remoteVideo: useRef<HTMLVideoElement>(null),
//     localStream: useRef<MediaStream | null>(null),
//     peer: useRef<RTCPeerConnection | null>(null),
//     dataChannel: useRef<RTCDataChannel | null>(null),
//   };

//   // Media Control Handlers
//   const mediaControls = {
//     toggleMute: () => {
//       if (refs.localStream.current) {
//         const audioTracks = refs.localStream.current.getAudioTracks();
//         const shouldMute = !mediaState.isMuted;

//         audioTracks.forEach((track) => {
//           track.enabled = !shouldMute;
//         });

//         setMediaState((prev) => ({ ...prev, isMuted: shouldMute }));

//         // Notify peer about media state change
//         if (refs.dataChannel.current?.readyState === "open") {
//           refs.dataChannel.current.send(
//             JSON.stringify({
//               type: "mediaState",
//               audio: !shouldMute,
//               video: !mediaState.isVideoOff,
//             })
//           );
//         }
//       }
//     },

//     toggleVideo: () => {
//       if (refs.localStream.current) {
//         const videoTracks = refs.localStream.current.getVideoTracks();
//         const shouldDisableVideo = !mediaState.isVideoOff;

//         videoTracks.forEach((track) => {
//           track.enabled = !shouldDisableVideo;
//         });

//         setMediaState((prev) => ({ ...prev, isVideoOff: shouldDisableVideo }));

//         // Notify peer about media state change
//         if (refs.dataChannel.current?.readyState === "open") {
//           refs.dataChannel.current.send(
//             JSON.stringify({
//               type: "mediaState",
//               audio: !mediaState.isMuted,
//               video: !shouldDisableVideo,
//             })
//           );
//         }
//       }
//     },
//   };

//   // WebRTC Setup and Handlers
//   const webRTCHandlers = {
//     setupPeerConnection: () => {
//       refs.peer.current = new RTCPeerConnection(RTCConfig);

//       refs.peer.current.onconnectionstatechange = () => {
//         if (refs.peer.current) {
//           const state = refs.peer.current.connectionState;
//           setCallState((prev) => ({
//             ...prev,
//             connectionState: state,
//             callEstablished: state === "connected",
//           }));

//           if (["failed", "disconnected", "closed"].includes(state)) {
//             onClose();
//           }
//         }
//       };

//       refs.peer.current.ontrack = ({ streams: [stream] }) => {
//         if (refs.remoteVideo.current) {
//           refs.remoteVideo.current.srcObject = stream;
//         }
//       };
//     },

//     setupDataChannel: (dataChannel: RTCDataChannel) => {
//       dataChannel.onopen = () => webRTCHandlers.sendMediaState();

//       dataChannel.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           if (data.type === "mediaState") {
//             setMediaState((prev) => ({
//               ...prev,
//               isRemoteMuted: !data.audio,
//               isRemoteVideoOff: !data.video,
//             }));
//           }
//         } catch (error) {
//           console.error("Error parsing data channel message:", error);
//         }
//       };
//     },

//     sendMediaState: () => {
//       if (refs.dataChannel.current?.readyState === "open") {
//         try {
//           refs.dataChannel.current.send(
//             JSON.stringify({
//               type: "mediaState",
//               audio: !mediaState.isMuted,
//               video: !mediaState.isVideoOff,
//             })
//           );
//         } catch (error) {
//           console.error("Error sending media state:", error);
//         }
//       }
//     },

//     startLocalStream: async () => {
//       try {
//         refs.localStream.current = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });

//         // Set initial track states
//         refs.localStream.current.getAudioTracks().forEach((track) => {
//           track.enabled = !mediaState.isMuted;
//         });

//         refs.localStream.current.getVideoTracks().forEach((track) => {
//           track.enabled = !mediaState.isVideoOff;
//         });

//         if (refs.localVideo.current) {
//           refs.localVideo.current.srcObject = refs.localStream.current;
//         }

//         refs.localStream.current.getTracks().forEach((track) => {
//           if (refs.peer.current && refs.localStream.current) {
//             refs.peer.current.addTrack(track, refs.localStream.current);
//           }
//         });
//       } catch (error) {
//         console.error("Error accessing media devices:", error);
//         toast.error("Failed to access camera or microphone");
//         onClose();
//       }
//     },
//   };

//   // Call Management
//   const callHandlers = {
//     handleIncomingCall: async (
//       offer: RTCSessionDescriptionInit,
//       from: string
//     ) => {
//       if (!refs.peer.current) return;

//       try {
//         await refs.peer.current.setRemoteDescription(
//           new RTCSessionDescription(offer)
//         );
//         await webRTCHandlers.startLocalStream();

//         const answer = await refs.peer.current.createAnswer();
//         await refs.peer.current.setLocalDescription(answer);

//         socket.emit("call:accepted", { answer, to: from });
//         setCallState((prev) => ({
//           ...prev,
//           isCalling: true,
//           callInitiated: true,
//         }));
//       } catch (error) {
//         console.error("Error handling incoming call:", error);
//         throw error;
//       }
//     },

//     startOutgoingCall: async () => {
//       if (!refs.peer.current) return;

//       setCallState((prev) => ({
//         ...prev,
//         isCalling: true,
//         callInitiated: true,
//       }));

//       try {
//         await webRTCHandlers.startLocalStream();
//         const offer = await refs.peer.current.createOffer();
//         await refs.peer.current.setLocalDescription(offer);
//         socket.emit("outgoing:call", { fromOffer: offer, to });
//       } catch (error) {
//         console.error("Error starting video call:", error);
//         setCallState((prev) => ({
//           ...prev,
//           isCalling: false,
//           callInitiated: false,
//         }));
//         onClose();
//       }
//     },

//     cleanup: () => {
//       refs.localStream.current?.getTracks().forEach((track) => track.stop());
//       refs.peer.current?.close();

//       if (refs.localVideo.current) refs.localVideo.current.srcObject = null;
//       if (refs.remoteVideo.current) refs.remoteVideo.current.srcObject = null;

//       initializationRef.current = false;

//       setCallState((prev) => ({
//         ...prev,
//         isCalling: false,
//         callEstablished: false,
//         connectionState: "Not Connected",
//         callInitiated: false,
//       }));

//       setMediaState({
//         isMuted: false,
//         isVideoOff: false,
//         isRemoteMuted: false,
//         isRemoteVideoOff: false,
//       });
//     },

//     handleEndCall: () => {
//       if (callState.callEstablished) {
//         socket.emit("end:call", { to, from: socket.id });
//       } else {
//         socket.emit("call:canceled", {
//           to: isIncoming ? incomingFrom : to,
//           from: socket.id,
//         });
//       }

//       callHandlers.cleanup();
//       onClose();
//     },
//   };

//   // Socket Events Effect - Register this first
//   useEffect(() => {
//     if (!socket || !isOpen) return;

//     const socketEvents = {
//       "incoming:answer": async (data: { offer: RTCSessionDescriptionInit }) => {
//         if (
//           !refs.peer.current ||
//           refs.peer.current.signalingState !== "have-local-offer"
//         )
//           return;

//         console.log(`Received answer for call ID: ${callState.callId}`);
//         try {
//           await refs.peer.current.setRemoteDescription(
//             new RTCSessionDescription(data.offer)
//           );
//         } catch (error) {
//           console.error("Error setting remote description:", error);
//           initializationRef.current = false;
//           onClose();
//         }
//       },
//       "call:error": (data: { message: string; code: string }) => {
//         if (data.code === "USER_OFFLINE") {
//           toast.error("User is offline");
//           onClose();
//         }
//       },
//       "call:rejected": (data: { reason?: string }) => {
//         toast.info(data.reason || "Call was rejected");
//         callHandlers.cleanup();
//         onClose();
//       },
//       "call:canceled": () => {
//         toast.info("Call was canceled");
//         callHandlers.cleanup();
//         onClose();
//       },
//       "call:ended": () => {
//         toast.info("Call ended by the other user");
//         callHandlers.cleanup();
//         onClose();
//       },
//     };

//     // Register all event listeners
//     Object.entries(socketEvents).forEach(([event, handler]) => {
//       socket.on(event, handler);
//     });

//     // Cleanup listeners
//     return () => {
//       Object.keys(socketEvents).forEach((event) => {
//         socket.off(event);
//       });
//     };
//   }, [socket, isOpen, callState.callId]);

//   // Initialize Call Effect - Register this after socket events
//   // In VideoCallModal.tsx
//   useEffect(() => {
//     if (!isOpen || !socket || callInitializedRef.current) return;

//     const initializeCall = async () => {
//       try {
//         // Setup peer connection first
//         webRTCHandlers.setupPeerConnection();

//         if (!refs.peer.current) return;

//         // Setup data channel
//         refs.dataChannel.current =
//           refs.peer.current.createDataChannel("mediaState");
//         webRTCHandlers.setupDataChannel(refs.dataChannel.current);

//         refs.peer.current.ondatachannel = (event) => {
//           webRTCHandlers.setupDataChannel(event.channel);
//         };

//         if (isIncoming && incomingOffer) {
//           console.log("Handling incoming call", {
//             incomingFrom,
//             hasOffer: !!incomingOffer,
//           });

//           // For incoming calls, set remote description first
//           await refs.peer.current.setRemoteDescription(
//             new RTCSessionDescription(incomingOffer)
//           );

//           // Start local stream
//           await webRTCHandlers.startLocalStream();

//           // Create and set answer
//           const answer = await refs.peer.current.createAnswer();
//           await refs.peer.current.setLocalDescription(answer);

//           // Send answer to caller
//           socket.emit("call:accepted", { answer, to: incomingFrom });
//         } else if (!isIncoming) {
//           // For outgoing calls, start local stream first
//           await webRTCHandlers.startLocalStream();

//           // Then create and send offer
//           const offer = await refs.peer.current.createOffer();
//           await refs.peer.current.setLocalDescription(offer);
//           socket.emit("outgoing:call", { fromOffer: offer, to });
//         }

//         setCallState((prev) => ({
//           ...prev,
//           isCalling: true,
//           callInitiated: true,
//         }));

//         callInitializedRef.current = true;
//         setIsInitialized(true);
//       } catch (error) {
//         console.error("Error initializing call:", error);
//         onClose();
//       }
//     };

//     initializeCall();

//     return () => {
//       // Only cleanup if the call wasn't established
//       if (!callState.callEstablished) {
//         callHandlers.cleanup();
//       }
//     };
//   }, [isOpen, socket, isIncoming, incomingOffer, incomingFrom]);

//   // Add state synchronization effect
//   useEffect(() => {
//     if (isInitialized && socket) {
//       // Synchronize media state
//       webRTCHandlers.sendMediaState();
//     }
//   }, [isInitialized, mediaState.isMuted, mediaState.isVideoOff]);

//   // UI Render
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50">
//       <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-5xl aspect-video relative overflow-hidden">
//         {/* Connection Quality Indicator */}
//         <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1.5">
//           <Signal
//             className={`w-4 h-4 ${
//               callState.connectionState === "connected"
//                 ? "text-green-500"
//                 : "text-yellow-500"
//             }`}
//           />
//           <span className="text-white text-sm">
//             {callState.connectionState === "connected"
//               ? "Good Connection"
//               : "Connecting..."}
//           </span>
//         </div>

//         {/* Remote Video Container */}
//         <div className="relative w-full h-full rounded-xl overflow-hidden">
//           <video
//             ref={refs.remoteVideo}
//             autoPlay
//             playsInline
//             className={`w-full h-full object-cover ${
//               mediaState.isRemoteVideoOff ? "hidden" : "block"
//             }`}
//           />
//           {mediaState.isRemoteVideoOff && (
//             <div className="absolute inset-0 flex items-center justify-center bg-gray-800/95">
//               <div className="flex flex-col items-center text-gray-300">
//                 <User className="w-20 h-20 mb-4" />
//                 <span className="text-xl font-medium">Camera Off</span>
//               </div>
//             </div>
//           )}
//           {mediaState.isRemoteMuted && callState.callEstablished && (
//             <div className="absolute top-4 right-auto z-20 bg-red-500/90 text-white px-4 py-2 rounded-full flex items-center gap-2">
//               <MicOff className="w-4 h-4" />
//               <span className="text-sm font-medium">Muted</span>
//             </div>
//           )}
//         </div>

//         {/* Local Video */}
//         <div className="absolute top-4 right-4 w-48 transition-all duration-300 hover:scale-105">
//           <div className="relative aspect-video">
//             <video
//               ref={refs.localVideo}
//               autoPlay
//               playsInline
//               muted
//               className={`w-full h-full rounded-xl object-cover border-2 ${
//                 mediaState.isVideoOff ? "hidden" : "block border-blue-500/50"
//               }`}
//             />
//             {mediaState.isVideoOff && (
//               <div className="absolute inset-0 flex items-center justify-center bg-gray-800/95 border-2 border-red-500/50 rounded-xl">
//                 <div className="flex flex-col items-center text-gray-300">
//                   <User className="w-8 h-8 mb-2" />
//                   <span className="text-sm font-medium">Camera Off</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Controls Bar */}
//         <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-6 bg-gray-800/90 backdrop-blur-sm rounded-full py-3 px-8 shadow-lg">
//           <button
//             onClick={mediaControls.toggleMute}
//             className={`p-4 rounded-full transition-all duration-200 ${
//               mediaState.isMuted
//                 ? "bg-red-500/90 hover:bg-red-600"
//                 : "bg-gray-700/90 hover:bg-gray-600"
//             }`}
//           >
//             {mediaState.isMuted ? (
//               <MicOff className="w-6 h-6 text-white" />
//             ) : (
//               <Mic className="w-6 h-6 text-white" />
//             )}
//           </button>

//           <button
//             onClick={callHandlers.handleEndCall}
//             className="p-4 bg-red-500/90 rounded-full text-white transition-all duration-200 hover:bg-red-600 hover:scale-110"
//           >
//             {callState.callEstablished ? (
//               <PhoneOff className="w-6 h-6" />
//             ) : (
//               <Phone className="w-6 h-6" />
//             )}
//           </button>

//           <button
//             onClick={mediaControls.toggleVideo}
//             className={`p-4 rounded-full transition-all duration-200 ${
//               mediaState.isVideoOff
//                 ? "bg-red-500/90 hover:bg-red-600"
//                 : "bg-gray-700/90 hover:bg-gray-600"
//             }`}
//           >
//             {mediaState.isVideoOff ? (
//               <VideoOff className="w-6 h-6 text-white" />
//             ) : (
//               <Video className="w-6 h-6 text-white" />
//             )}
//           </button>
//         </div>

//         {/* Loading/Connecting State */}
//         {callState.connectionState !== "connected" && callState.isCalling && (
//           <div className="absolute inset-0 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm z-10">
//             <div className="text-center">
//               <div className="mb-8">
//                 <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
//               </div>
//               <h3 className="text-2xl font-semibold text-white mb-2">
//                 {isIncoming ? "Connecting to Call" : "Calling..."}
//               </h3>
//               <p className="text-gray-400 mb-8">
//                 {callState.connectionState === "checking"
//                   ? "Establishing secure connection..."
//                   : callState.connectionState === "connecting"
//                   ? "Almost connected..."
//                   : "Waiting for response..."}
//               </p>
//               <button
//                 onClick={callHandlers.handleEndCall}
//                 className="px-8 py-3 bg-red-500/90 rounded-full text-white font-medium transition-all duration-200 hover:bg-red-600 flex items-center mx-auto gap-2"
//               >
//                 <PhoneOff className="w-5 h-5" />
//                 {callState.callEstablished ? "End Call" : "Cancel"}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VideoCallModal;







































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
