// PROD:
export const RABBITMQ_URL  = "amqp://rabbitmq-service:5672"

// DEV:
// export const RABBITMQ_URL  = "amqp://rabbitmq:5672"

// export const RABBITMQ_URL  =  "amqp://localhost:5672/"


export const MESSAGES = {
    DB_CONNECTION_FAILED: 'DB Connection Failed',
    DB_CONNECTION_SUCCESS: 'Notification Service Connected',
    // Add other messages as needed
    NOTIFICATIONS_FETCH_SUCCESS: 'Notifications fetched successfully',
    NOTIFICATIONS_FETCH_FAILED: 'Failed to fetch notifications',
    UNEXPECTED_ERROR: 'An unexpected error occurred',
    JWT_NOT_FOUND: "JWT not found in the cookies",
    JWT_SECRET_NOT_FOUND: "JWT secret not found in the env",
    INVALID_JWT: "Invalid JWT",
    NOTIFICATION_ADDED_TO_USER: "Notification added to user collection",
    NOTIFICATION_ERROR: "An error occurred while handling the notification",
    POST_CREATION_ERROR: "An error occurred while creating the post",
    USER_ADDED_SUCCESS: "User data added successfully",
    USER_NOT_FOUND: "User not found",
    USER_UPDATED_SUCCESS: "User data updated successfully",
    ERROR_UPDATING_USER: "Error occurred while updating user data",
    ERROR_ADDING_USER: "Error occurred while adding user data",
    NOTIFICATION_ADDED_SUCCESS: "Notification added successfully",
    NOTIFICATION_NOT_FOUND: "Notification not found",
    ERROR_ADDING_NOTIFICATION: "Error occurred while adding notification",
    ERROR_GETTING_NOTIFICATIONS: "Error occurred while getting notifications",
    ERROR_SENDING_LIVE_NOTIFICATION: "Error occurred while sending live notification",
    ERROR_ADDING_NOTIFICATION_TO_USER: "Error occurred while adding notification to user",
    POST_ADDED_SUCCESS: "Post added successfully",
    ERROR_ADDING_POST: "Error occurred while adding post",
    ERROR_FETCHING_POST: "Error occurred while fetching post",
    POST_NOT_FOUND: "Post not found",

    USER_FETCHED_SUCCESS: "User fetched successfully",

    ERROR_FETCHING_USER: "Error occurred while fetching user",
  
  };
  