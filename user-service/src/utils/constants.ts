export const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://rabbitmq-service.default.svc.cluster.local:5672"

export const SocketEventEnum = Object.freeze({
    CONNECTED_EVENT: "connected",
  
    DISCONNECT_EVENT: "disconnect",
  
    FOLLOW_EVENT : "followed",

    SOCKET_ERROR_EVENT: "socketError",
  });

export const MongoDB = {
  SUCCESS: "MongoDB connected",
  ERROR: "MongoDB connection error",
};

export const ResponseMsg = {
  USER_DATA_EDITED: "User data edited successfully",
  ADMIN_LOGGED_IN: "Admin logged in successfully",
  USER_LOGGED_IN: "User logged in successfully",
  OTP_SUCCESS: "OTP sent successfully",
  OTP_VERIFIED: "OTP verified successfully",
  LOGGED_IN: "Logged in successfully",
  ACCOUNT_TYPE_UPDATED: "Account type updated successfully",
  CREDENTIAL_EXIST: "Credentials already exist",
};

export const UserErrorMsg = {
  NO_USER_ID: "No user id found",
  NO_USER: "No user found",
  NO_USER_DATA: "User data not found",
  NO_USERNAME: "Username not found",
};

export const GeneralErrorMsg = {
  INVALID_TICK_REQUEST: "Invalid status for the tick request",
  NO_IMAGE_FILE: "Image File not found",
  NO_IMAGE_TYPE: "Image type not found",
  UNEXPECTED_ERROR: "An unexpected error occurred",
  DUPLICATE_KEY: "Duplicate key error",
  DUPLICATE_KEY_INDEX: "E11000",
  TICK_REQUEST_NOT_FOUND: "Tick request data not found.",
  OTP_ERROR: "Error getting the OTP from database",
  TIME_LIMIT_EXCEED: "Time limit exceeded",
  INVALID_OTP: "Invalid OTP",
  USER_RESTRICTED: "Sorry this user is restricted",
  SIGN_UP_AGAIN: "Please SignUp again..",
};

export const JwtErrorMsg = {
  JWT_NOT_FOUND: "JWT not found in the cookies",
  INVALID_JWT: "Invalid JWT",
  JWT_EXPIRATION: "1h",
  JWT_REFRESH_EXPIRATION: "6h",
};

export enum Role {
  Admin = "wenet-admin",
  User = "wenet-user",
}

export const ImageType = {
  WENET_TICK: "wenet-tick-request",
};

export const EnvErrorMsg = {
  CONST_ENV: "",
  JWT_NOT_FOUND: "JWT secret not found in the env",
  NOT_FOUND: "Env not found",
  ADMIN_NOT_FOUND: "Environment variables for admin credentials not found",
};

export enum TickRequestStatus {
  APPROVED = "approved",
  REJECTED = "rejected",
}

// OTP and Profile Constants
export const OTP_TIME_LIMIT = 60; // in seconds
export const OTP_EXPIRY_TIME = 60 * 1000; // OTP expiry time in milliseconds
export const TEMP_PASSWORD = "tempPassword"; // temporary password for Google sign-in

// Default Profile Pictures
export const DEFAULT_PROFILE_PIC_MALE = "/img/DefaultProfilePicMale.png";
export const DEFAULT_PROFILE_PIC_FEMALE = "/img/DefaultProfilePicFemale.png";

// Email and Password Reset Constants
export const PASSWORD_RESET_SUBJECT = "Password Reset";
export const PASSWORD_RESET_EMAIL_TEMPLATE = "newPassword"; // Replace with actual template

// Error Messages
export const RESTRICTED_USER_ERROR_MSG = "Sorry, this user is restricted";
export const INVALID_CREDENTIALS_MSG = "Please enter valid credentials";
export const PASSWORD_CHANGED_MSG = "Password changed successfully";
export const EMAIL_NOT_FOUND_MSG = "Email not found";
export const OTP_SENT_MSG = "OTP sent successfully";
