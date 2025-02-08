export const ChatEventEnum = Object.freeze({
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  SOCKET_ERROR_EVENT: "socketError",
  MESSAGE_SENT_EVENT: "messageSent",

  TYPING_EVENT: "TYPING_EVENT",
  USER_ONLINE_EVENT: "USER_ONLINE_EVENT",
  USER_OFFLINE_EVENT: "USER_OFFLINE_EVENT",
  CHECK_USER_ONLINE_EVENT: "CHECK_USER_ONLINE_EVENT",
});

export const SocketEventEnum = Object.freeze({
  CONNECTED_EVENT: "connected",

  DISCONNECT_EVENT: "disconnect",

  FOLLOW_EVENT: "followed",

  SOCKET_ERROR_EVENT: "socketError",
});
