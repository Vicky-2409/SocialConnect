// import React, { useState, useRef, useEffect } from "react";
// import { useSocket } from "../redux/SocketProvider";
// import {
//   MdCallEnd,
//   MdCall,
//   MdMic,
//   MdMicOff,
//   MdVideocam,
//   MdVideocamOff,
// } from "react-icons/md";
// import { toast } from "react-toastify";
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
//   isIncoming = false,
//   incomingOffer = null,
//   incomingFrom = "",
// }) => {
//   const socket = useSocket();
//   if (!socket || !isOpen) return null;

//   // State Management
//   const [callState, setCallState] = useState({
//     isCalling: false,
//     callEstablished: false,
//     connectionState: "Not Connected" as string,
//   });

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
//         setCallState((prev) => ({ ...prev, isCalling: true }));
//       } catch (error) {
//         console.error("Error handling incoming call:", error);
//         throw error;
//       }
//     },

//     startOutgoingCall: async () => {
//       if (!refs.peer.current) return;

//       setCallState((prev) => ({ ...prev, isCalling: true }));
//       try {
//         await webRTCHandlers.startLocalStream();
//         const offer = await refs.peer.current.createOffer();
//         await refs.peer.current.setLocalDescription(offer);
//         socket.emit("outgoing:call", { fromOffer: offer, to });
//       } catch (error) {
//         console.error("Error starting video call:", error);
//         setCallState((prev) => ({ ...prev, isCalling: false }));
//         onClose();
//       }
//     },

//     cleanup: () => {
//       refs.localStream.current?.getTracks().forEach((track) => track.stop());
//       refs.peer.current?.close();

//       if (refs.localVideo.current) refs.localVideo.current.srcObject = null;
//       if (refs.remoteVideo.current) refs.remoteVideo.current.srcObject = null;

//       setCallState({
//         isCalling: false,
//         callEstablished: false,
//         connectionState: "Not Connected",
//       });
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

//   // Effects
//   useEffect(() => {
//     if (!isOpen) return;

//     const initializeCall = async () => {
//       webRTCHandlers.setupPeerConnection();

//       if (refs.peer.current) {
//         refs.dataChannel.current =
//           refs.peer.current.createDataChannel("mediaState");
//         webRTCHandlers.setupDataChannel(refs.dataChannel.current);

//         refs.peer.current.ondatachannel = (event) => {
//           webRTCHandlers.setupDataChannel(event.channel);
//         };

//         if (isIncoming && incomingOffer && incomingFrom) {
//           try {
//             await callHandlers.handleIncomingCall(incomingOffer, incomingFrom);
//           } catch (error) {
//             console.error("Error handling incoming call:", error);
//             onClose();
//           }
//         } else if (!isIncoming) {
//           callHandlers.startOutgoingCall();
//         }
//       }
//     };

//     initializeCall();
//     return callHandlers.cleanup;
//   }, [isOpen]);

//   // Socket Event Handlers
//   useEffect(() => {
//     if (!socket || !isOpen) return;

//     const socketEvents = {
//       "incoming:answer": async (data: { offer: RTCSessionDescriptionInit }) => {
//         if (
//           !refs.peer.current ||
//           refs.peer.current.signalingState !== "have-local-offer"
//         )
//           return;
//         try {
//           await refs.peer.current.setRemoteDescription(
//             new RTCSessionDescription(data.offer)
//           );
//         } catch (error) {
//           console.error("Error setting remote description:", error);
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
//   }, [socket, isOpen]);

//   // Media State Updates
//   useEffect(() => {
//     if (callState.callEstablished) {
//       webRTCHandlers.sendMediaState();
//     }
//   }, [mediaState.isMuted, mediaState.isVideoOff, callState.callEstablished]);

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
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Signal,
  User,
  Video,
  VideoOff,
} from "lucide-react";
import { toast } from "react-toastify";

// Types and Interfaces
interface VideoCallModalProps {
  to: string;
  isOpen: boolean;
  onClose: () => void;
  isIncoming: boolean;
  incomingOffer: RTCSessionDescriptionInit | null;
  incomingFrom: string;
}

interface MediaState {
  isMuted: boolean;
  isVideoOff: boolean;
  isRemoteMuted: boolean;
  isRemoteVideoOff: boolean;
}

// WebRTC Configuration
const RTCConfig = {
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
  isIncoming,
  incomingOffer = null,
  incomingFrom = "",
}) => {
  console.log(to, isOpen, onClose, isIncoming, incomingOffer, incomingFrom);
  console.debug(
    "Debug Log:",
    to,
    isOpen,
    onClose,
    isIncoming,
    incomingOffer,
    incomingFrom
  );
  const socket = useSocket();
  if (!socket || !isOpen) return null;

  const initializationRef = useRef(false);

  const [callState, setCallState] = useState({
    isCalling: false,
    callEstablished: false,
    connectionState: "Not Connected" as string,
    callInitiated: false,
    callId: Date.now().toString(), // Add unique call ID
  });

  // State Management

  const [mediaState, setMediaState] = useState<MediaState>({
    isMuted: false,
    isVideoOff: false,
    isRemoteMuted: false,
    isRemoteVideoOff: false,
  });

  // Refs
  const refs = {
    localVideo: useRef<HTMLVideoElement>(null),
    remoteVideo: useRef<HTMLVideoElement>(null),
    localStream: useRef<MediaStream | null>(null),
    peer: useRef<RTCPeerConnection | null>(null),
    dataChannel: useRef<RTCDataChannel | null>(null),
  };

  // Media Control Handlers
  const mediaControls = {
    toggleMute: () => {
      if (refs.localStream.current) {
        const audioTracks = refs.localStream.current.getAudioTracks();
        const shouldMute = !mediaState.isMuted;

        audioTracks.forEach((track) => {
          track.enabled = !shouldMute;
        });

        setMediaState((prev) => ({ ...prev, isMuted: shouldMute }));

        // Notify peer about media state change
        if (refs.dataChannel.current?.readyState === "open") {
          refs.dataChannel.current.send(
            JSON.stringify({
              type: "mediaState",
              audio: !shouldMute,
              video: !mediaState.isVideoOff,
            })
          );
        }
      }
    },

    toggleVideo: () => {
      if (refs.localStream.current) {
        const videoTracks = refs.localStream.current.getVideoTracks();
        const shouldDisableVideo = !mediaState.isVideoOff;

        videoTracks.forEach((track) => {
          track.enabled = !shouldDisableVideo;
        });

        setMediaState((prev) => ({ ...prev, isVideoOff: shouldDisableVideo }));

        // Notify peer about media state change
        if (refs.dataChannel.current?.readyState === "open") {
          refs.dataChannel.current.send(
            JSON.stringify({
              type: "mediaState",
              audio: !mediaState.isMuted,
              video: !shouldDisableVideo,
            })
          );
        }
      }
    },
  };

  // WebRTC Setup and Handlers
  const webRTCHandlers = {
    setupPeerConnection: () => {
      refs.peer.current = new RTCPeerConnection(RTCConfig);

      refs.peer.current.onconnectionstatechange = () => {
        if (refs.peer.current) {
          const state = refs.peer.current.connectionState;
          setCallState((prev) => ({
            ...prev,
            connectionState: state,
            callEstablished: state === "connected",
          }));

          if (["failed", "disconnected", "closed"].includes(state)) {
            onClose();
          }
        }
      };

      refs.peer.current.ontrack = ({ streams: [stream] }) => {
        if (refs.remoteVideo.current) {
          refs.remoteVideo.current.srcObject = stream;
        }
      };
    },

    setupDataChannel: (dataChannel: RTCDataChannel) => {
      dataChannel.onopen = () => webRTCHandlers.sendMediaState();

      dataChannel.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "mediaState") {
            setMediaState((prev) => ({
              ...prev,
              isRemoteMuted: !data.audio,
              isRemoteVideoOff: !data.video,
            }));
          }
        } catch (error) {
          console.error("Error parsing data channel message:", error);
        }
      };
    },

    sendMediaState: () => {
      if (refs.dataChannel.current?.readyState === "open") {
        try {
          refs.dataChannel.current.send(
            JSON.stringify({
              type: "mediaState",
              audio: !mediaState.isMuted,
              video: !mediaState.isVideoOff,
            })
          );
        } catch (error) {
          console.error("Error sending media state:", error);
        }
      }
    },

    startLocalStream: async () => {
      try {
        refs.localStream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // Set initial track states
        refs.localStream.current.getAudioTracks().forEach((track) => {
          track.enabled = !mediaState.isMuted;
        });

        refs.localStream.current.getVideoTracks().forEach((track) => {
          track.enabled = !mediaState.isVideoOff;
        });

        if (refs.localVideo.current) {
          refs.localVideo.current.srcObject = refs.localStream.current;
        }

        refs.localStream.current.getTracks().forEach((track) => {
          if (refs.peer.current && refs.localStream.current) {
            refs.peer.current.addTrack(track, refs.localStream.current);
          }
        });
      } catch (error) {
        console.error("Error accessing media devices:", error);
        toast.error("Failed to access camera or microphone");
        onClose();
      }
    },
  };

  // Call Management
  const callHandlers = {
    handleIncomingCall: async (
      offer: RTCSessionDescriptionInit,
      from: string
    ) => {
      if (!refs.peer.current) return;

      try {
        await refs.peer.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        await webRTCHandlers.startLocalStream();

        const answer = await refs.peer.current.createAnswer();
        await refs.peer.current.setLocalDescription(answer);

        socket.emit("call:accepted", { answer, to: from });
        setCallState((prev) => ({
          ...prev,
          isCalling: true,
          callInitiated: true,
        }));
      } catch (error) {
        console.error("Error handling incoming call:", error);
        throw error;
      }
    },

    startOutgoingCall: async () => {
      if (!refs.peer.current) return;

      setCallState((prev) => ({
        ...prev,
        isCalling: true,
        callInitiated: true,
      }));

      try {
        await webRTCHandlers.startLocalStream();
        const offer = await refs.peer.current.createOffer();
        await refs.peer.current.setLocalDescription(offer);
        socket.emit("outgoing:call", { fromOffer: offer, to });
      } catch (error) {
        console.error("Error starting video call:", error);
        setCallState((prev) => ({
          ...prev,
          isCalling: false,
          callInitiated: false,
        }));
        onClose();
      }
    },

    cleanup: () => {
      refs.localStream.current?.getTracks().forEach((track) => track.stop());
      refs.peer.current?.close();

      if (refs.localVideo.current) refs.localVideo.current.srcObject = null;
      if (refs.remoteVideo.current) refs.remoteVideo.current.srcObject = null;

      initializationRef.current = false;

      setCallState((prev) => ({
        ...prev,
        isCalling: false,
        callEstablished: false,
        connectionState: "Not Connected",
        callInitiated: false,
      }));

      setMediaState({
        isMuted: false,
        isVideoOff: false,
        isRemoteMuted: false,
        isRemoteVideoOff: false,
      });
    },

    handleEndCall: () => {
      if (callState.callEstablished) {
        socket.emit("end:call", { to, from: socket.id });
      } else {
        socket.emit("call:canceled", {
          to: isIncoming ? incomingFrom : to,
          from: socket.id,
        });
      }

      callHandlers.cleanup();
      onClose();
    },
  };

  // Socket Events Effect - Register this first
  useEffect(() => {
    if (!socket || !isOpen) return;

    const socketEvents = {
      "incoming:answer": async (data: { offer: RTCSessionDescriptionInit }) => {
        if (
          !refs.peer.current ||
          refs.peer.current.signalingState !== "have-local-offer"
        )
          return;

        console.log(`Received answer for call ID: ${callState.callId}`);
        try {
          await refs.peer.current.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
        } catch (error) {
          console.error("Error setting remote description:", error);
          initializationRef.current = false;
          onClose();
        }
      },
      "call:error": (data: { message: string; code: string }) => {
        if (data.code === "USER_OFFLINE") {
          toast.error("User is offline");
          onClose();
        }
      },
      "call:rejected": (data: { reason?: string }) => {
        toast.info(data.reason || "Call was rejected");
        callHandlers.cleanup();
        onClose();
      },
      "call:canceled": () => {
        toast.info("Call was canceled");
        callHandlers.cleanup();
        onClose();
      },
      "call:ended": () => {
        toast.info("Call ended by the other user");
        callHandlers.cleanup();
        onClose();
      },
    };

    // Register all event listeners
    Object.entries(socketEvents).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Cleanup listeners
    return () => {
      Object.keys(socketEvents).forEach((event) => {
        socket.off(event);
      });
    };
  }, [socket, isOpen, callState.callId]);

  // Initialize Call Effect - Register this after socket events
// In VideoCallModal.tsx
useEffect(() => {
  if (!isOpen || initializationRef.current) return;

  const initializeCall = async () => {
    // Set initialization flag
    initializationRef.current = true;
    
    webRTCHandlers.setupPeerConnection();
    
    if (refs.peer.current) {
      refs.dataChannel.current = refs.peer.current.createDataChannel("mediaState");
      webRTCHandlers.setupDataChannel(refs.dataChannel.current);
      
      refs.peer.current.ondatachannel = (event) => {
        webRTCHandlers.setupDataChannel(event.channel);
      };
      
      // Check if this is an incoming call with valid offer
      if (isIncoming && incomingOffer && incomingFrom) {
        console.log(`Handling incoming call with ID: ${callState.callId}`);
        try {
          await callHandlers.handleIncomingCall(incomingOffer, incomingFrom);
        } catch (error) {
          console.error("Error handling incoming call:", error);
          initializationRef.current = false; // Reset on error
          onClose();
        }
      } else if (!isIncoming && !callState.callInitiated) {
        // Only start outgoing call if not already initiated
        console.log(`Starting outgoing call with ID: ${callState.callId}`);
        callHandlers.startOutgoingCall();
      }
    }
  };

  initializeCall();

  return () => {
    if (!callState.callEstablished) {
      callHandlers.cleanup();
    }
    initializationRef.current = false;
  };
}, [isOpen, incomingOffer, incomingFrom, isIncoming]);

  // Media State Updates
  useEffect(() => {
    if (callState.callEstablished) {
      webRTCHandlers.sendMediaState();
    }
  }, [mediaState.isMuted, mediaState.isVideoOff, callState.callEstablished]);

  // UI Render
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-5xl aspect-video relative overflow-hidden">
        {/* Connection Quality Indicator */}
        <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1.5">
          <Signal
            className={`w-4 h-4 ${
              callState.connectionState === "connected"
                ? "text-green-500"
                : "text-yellow-500"
            }`}
          />
          <span className="text-white text-sm">
            {callState.connectionState === "connected"
              ? "Good Connection"
              : "Connecting..."}
          </span>
        </div>

        {/* Remote Video Container */}
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <video
            ref={refs.remoteVideo}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${
              mediaState.isRemoteVideoOff ? "hidden" : "block"
            }`}
          />
          {mediaState.isRemoteVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/95">
              <div className="flex flex-col items-center text-gray-300">
                <User className="w-20 h-20 mb-4" />
                <span className="text-xl font-medium">Camera Off</span>
              </div>
            </div>
          )}
          {mediaState.isRemoteMuted && callState.callEstablished && (
            <div className="absolute top-4 right-auto z-20 bg-red-500/90 text-white px-4 py-2 rounded-full flex items-center gap-2">
              <MicOff className="w-4 h-4" />
              <span className="text-sm font-medium">Muted</span>
            </div>
          )}
        </div>

        {/* Local Video */}
        <div className="absolute top-4 right-4 w-48 transition-all duration-300 hover:scale-105">
          <div className="relative aspect-video">
            <video
              ref={refs.localVideo}
              autoPlay
              playsInline
              muted
              className={`w-full h-full rounded-xl object-cover border-2 ${
                mediaState.isVideoOff ? "hidden" : "block border-blue-500/50"
              }`}
            />
            {mediaState.isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800/95 border-2 border-red-500/50 rounded-xl">
                <div className="flex flex-col items-center text-gray-300">
                  <User className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Camera Off</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls Bar */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-6 bg-gray-800/90 backdrop-blur-sm rounded-full py-3 px-8 shadow-lg">
          <button
            onClick={mediaControls.toggleMute}
            className={`p-4 rounded-full transition-all duration-200 ${
              mediaState.isMuted
                ? "bg-red-500/90 hover:bg-red-600"
                : "bg-gray-700/90 hover:bg-gray-600"
            }`}
          >
            {mediaState.isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          <button
            onClick={callHandlers.handleEndCall}
            className="p-4 bg-red-500/90 rounded-full text-white transition-all duration-200 hover:bg-red-600 hover:scale-110"
          >
            {callState.callEstablished ? (
              <PhoneOff className="w-6 h-6" />
            ) : (
              <Phone className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={mediaControls.toggleVideo}
            className={`p-4 rounded-full transition-all duration-200 ${
              mediaState.isVideoOff
                ? "bg-red-500/90 hover:bg-red-600"
                : "bg-gray-700/90 hover:bg-gray-600"
            }`}
          >
            {mediaState.isVideoOff ? (
              <VideoOff className="w-6 h-6 text-white" />
            ) : (
              <Video className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Loading/Connecting State */}
        {callState.connectionState !== "connected" && callState.isCalling && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm z-10">
            <div className="text-center">
              <div className="mb-8">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                {isIncoming ? "Connecting to Call" : "Calling..."}
              </h3>
              <p className="text-gray-400 mb-8">
                {callState.connectionState === "checking"
                  ? "Establishing secure connection..."
                  : callState.connectionState === "connecting"
                  ? "Almost connected..."
                  : "Waiting for response..."}
              </p>
              <button
                onClick={callHandlers.handleEndCall}
                className="px-8 py-3 bg-red-500/90 rounded-full text-white font-medium transition-all duration-200 hover:bg-red-600 flex items-center mx-auto gap-2"
              >
                <PhoneOff className="w-5 h-5" />
                {callState.callEstablished ? "End Call" : "Cancel"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallModal;
