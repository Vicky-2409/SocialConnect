export const PayU = {
  merchantKey: "O5ouUQ",
};

// DEV:
// export const FRONTEND_DOMAIN = "http://localhost:3000";

// const USER_SERVICE_DOMAIN = "http://localhost:5001";
// const POSTS_SERVICE_DOMAIN = "http://localhost:5002";
// const MESSAGE_SERVICE_DOMAIN = "http://localhost:5003";
// const NOTIFICATION_SERVICE_DOMAIN = "http://localhost:5004";
// const ADS_SERVICE_DOMAIN = "http://localhost:5005";

// PROD:

export const FRONTEND_DOMAIN = "https://socialconnect.site";

const DOMAIN = "https://socialconnect.site";

const USER_SERVICE_DOMAIN = DOMAIN;
const POSTS_SERVICE_DOMAIN = DOMAIN;
const MESSAGE_SERVICE_DOMAIN = DOMAIN;
const NOTIFICATION_SERVICE_DOMAIN = DOMAIN;
const ADS_SERVICE_DOMAIN = DOMAIN;

export const USER_SERVICE_URL = `${USER_SERVICE_DOMAIN}/api/user-service`;
export const POSTS_SERVICE_URL = `${POSTS_SERVICE_DOMAIN}/api/posts-service`;
export const MESSAGE_SERVICE_URL = `${MESSAGE_SERVICE_DOMAIN}/api/message-service`;
export const NOTIFICATION_SERVICE_URL = `${NOTIFICATION_SERVICE_DOMAIN}/api/notification-service`;
export const ADS_SERVICE_URL = `${ADS_SERVICE_DOMAIN}/api/ads-service`;

export const SOCKET_URI = MESSAGE_SERVICE_DOMAIN;
export const USER_SOCKET_URI = USER_SERVICE_DOMAIN;
export const NOTIFICATION_SOCKET_URI = NOTIFICATION_SERVICE_DOMAIN;

export const GOOGLE_CLIENT_ID =
  "317927446358-jdmtckvmtcoig73is4ms4obffi1ii1vj.apps.googleusercontent.com";

export const JWT_SECRET = process.env.JWT_SECRET;
