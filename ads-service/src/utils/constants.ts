import dotenv from "dotenv";
dotenv.config();

export const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY;
export const PAYU_SALT = process.env.PAYU_SALT;

export const POST_PROMOTION_PERIOD = 30;

// PROD:
export const RABBITMQ_URL  = "amqp://rabbitmq-service.default.svc.cluster.local:5672"

// DEV:
// export const RABBITMQ_URL  = "amqp://rabbitmq:5672"

// export const RABBITMQ_URL =
//   process.env.RABBITMQ_URL || "amqp://localhost:5672/";

// constants.ts
export const MESSAGES = {
  MONGO_CONNECTED: "MongoDB Connected to Ads Service",
  MONGO_CONNECTION_ERROR: "MongoDB connection error:",
  TOGGLE_STATUS_SUCCESS: "Status toggled successfully",
  DATA_RETRIEVED: "Ads management data retrieved successfully",
  TRANSACTION_ADDED: "Transaction added successfully",
  POSTS_RETRIEVED: "Posts retrieved successfully",
  MANDATORY_FIELDS_MISSING: "Mandatory fields are missing",
  HASH_GENERATED: "Hash generated successfully",
  INTERNAL_SERVER_ERROR: "Internal server error",
  DATA_SAVED: "Data saved successfully",
  DATA_SAVE_ERROR: "MongoDB could not save the data",
  UNEXPECTED_ERROR: "An unexpected error occurred",
  ADMIN_JWT_NOT_FOUND: "Admin JWT not found in the cookies",
  JWT_SECRET_NOT_FOUND: "JWT secret not found in the environment",
  INVALID_ADMIN_JWT: "Invalid admin JWT",
  JWT_NOT_FOUND: "JWT not found in the cookies",
  INVALID_JWT: "Invalid JWT",
  USER_NOT_FOUND: "User not found",
  USER_RESTRICTED: "User is restricted and cannot perform this action",
  INVALID_PAYMENT: "Invalid payment details provided.",
  TRANSACTION_FAILED: "Transaction has failed.",
  TRANSACTION_SUCCESS: "Transaction completed successfully.",
  SUCCESS: {
    USER_ADDED: "User data added successfully",
    USER_UPDATED: "User data updated successfully",
    AD_STATUS_TOGGLED: "Ad status toggled successfully",
    TRANSACTION_ADDED: "Transaction added successfully",
    AD_DATA_ADDED: "Ad data added to post successfully",
  },
  ERRORS: {
    POST_NOT_FOUND: "Post not found",
    TRANSACTION_CREATION_FAILED: "Failed to create transaction",
    AD_CREATION_FAILED: "Failed to create ad",
    PUBLISH_MESSAGE_FAILED: "Failed to publish message to MQ",
    USER_NOT_FOUND: "User not found",
    USER_DATA_NOT_FOUND: "User data not found",
    FAILED_TO_SEND_MQ: "Failed to send data to MQ",
    PAYU_ORDER_NOT_FOUND: "PayU Order Data not found",
    TRANSACTION_DATA_NOT_FOUND: "Transaction Data not found",
    MQ_SEND_FAILED: "Failed to send ad data to MQ",
  },
};

export enum Role {
  Admin = "wenet-admin",
  User = "wenet-user",
}

