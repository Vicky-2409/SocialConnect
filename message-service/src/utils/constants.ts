export const ChatEventEnum = Object.freeze({
    CONNECTED_EVENT: "connected",
  
    DISCONNECT_EVENT: "disconnect",
  
    MESSAGE_SENT_EVENT: "messageSent",
    MESSAGE_RECEIVED_EVENT: "messageReceived",
    // ? when there is new one on one chat, new group chat or user gets added in the group
    NEW_CHAT_EVENT: "newChat",
    // ? when there is an error in socket
    SOCKET_ERROR_EVENT: "socketError",
    // ? when participant stops typing
    STOP_TYPING_EVENT: "stopTyping",
    // ? when participant starts typing
    // TYPING_EVENT: "typing",


    TYPING_EVENT: 'TYPING_EVENT',
    USER_ONLINE_EVENT: 'USER_ONLINE_EVENT',
    USER_OFFLINE_EVENT: 'USER_OFFLINE_EVENT',
    CHECK_USER_ONLINE_EVENT: 'CHECK_USER_ONLINE_EVENT'




    
  });

  
  
  export const VideoEventEnum = Object.freeze({
      CONNECTED_EVENT: "connected",
    
      DISCONNECT_EVENT: "disconnect",
    
      MESSAGE_SENT_EVENT: "messageSent",
      MESSAGE_RECEIVED_EVENT: "messageReceived",
      // ? when there is new one on one chat, new group chat or user gets added in the group
      NEW_CHAT_EVENT: "newChat",
      // ? when there is an error in socket
      SOCKET_ERROR_EVENT: "socketError",
      // ? when participant stops typing
      STOP_TYPING_EVENT: "stopTyping",
      // ? when participant starts typing
      TYPING_EVENT: "typing",
    });

    
  // PROD:
  export const RABBITMQ_URL  = "amqp://rabbitmq-service.default.svc.cluster.local:5672"
  // export const RABBITMQ_URL  = "amqp://localhost:5672/"
  // DEV:
  // export const RABBITMQ_URL  = "amqp://rabbitmq:5672"


  export const MESSAGES = {
    SUCCESS: {
      DB_CONNECTED: 'MongoDB Atlas connected',
      CONVO_MESSAGES_RETRIEVED: 'Conversation messages retrieved successfully.',
      PARTICIPANTS_RETRIEVED: 'Participants data retrieved successfully.',
      CONVERSATION_CREATED: 'Conversation created successfully.',
      MESSAGE_SENT: 'Message sent successfully.',
      MESSAGE_DELETED: 'Message deleted successfully.',
      CONVO_LIST_RETRIEVED: 'Conversation list retrieved successfully.',
      UNREAD_COUNT_RETRIEVED: 'Unread count retrieved successfully.',
    },
    ERROR: {
      DB_CONNECTION_FAILED: 'MongoDB connection error',
      CONVO_MESSAGES_RETRIEVAL_FAILED: 'Failed to retrieve conversation messages.',
      PARTICIPANTS_RETRIEVAL_FAILED: 'Failed to retrieve participants data.',
      CONVERSATION_CREATION_FAILED: 'Failed to create conversation.',
      MESSAGE_SEND_FAILED: 'Failed to send message.',
      MESSAGE_DELETION_FAILED: 'Failed to delete message.',
      CONVO_LIST_RETRIEVAL_FAILED: 'Failed to retrieve conversation list.',
      UNREAD_COUNT_RETRIEVAL_FAILED: 'Failed to retrieve unread count.',
      UNEXPECTED_ERROR: 'An unexpected error occurred.',
      JWT_NOT_FOUND: 'JWT not found in the cookies',
      JWT_SECRET_NOT_FOUND: 'JWT secret not found in the env',
      INVALID_JWT: 'Invalid JWT',
    },

    CONVO_NOT_FOUND: "Conversation not found",
    USER_NOT_FOUND: "User not found",
    SENDER_NOT_FOUND: "Sender doesn't exist",
    NO_MESSAGE: "There is no message",
    CONVO_EXISTS: "Conversation doesn't exist",
    MESSAGE_NOT_FOUND: "Message not found",
    INVALID_MESSAGE_ID: "MessageId is required",
    UPLOAD_ERROR: "Error uploading image",
    LAST_MESSAGE_UPDATE_FAILED: "Failed to update last message",
    MESSAGE_DELETE_FAILED: "Message not deleted",
    NO_CONVO_DATA: "No convo data found",
    INVALID_JWT: "Invalid JWT",
    JWT_NOT_FOUND: "JWT not found in the cookies",
    JWT_SECRET_NOT_FOUND: "JWT secret not found in the env",
    CONVO_ERROR: "Error getting conversation data",
    MESSAGE_EMITTED_SUCCESS: "Received message event emitted successfully",
    USER_ADDED_SUCCESS: "User data added successfully",
    USER_UPDATED_SUCCESS: "User data updated successfully",
    FAILED_TO_SAVE_MESSAGE: "Failed to save message data",
    MESSAGE_DELETED: "This message was deleted",
    IMAGE_UPLOAD_FAILED: "Failed to upload image",
    ADD_USER_ERROR: 'Error while adding user.',
    GET_USER_ERROR: 'Error while fetching user data.',
    UPDATE_USER_ERROR: 'Error while updating user data.',

  };