



// src/utils/constants.ts

// Prefix with NEXT_PUBLIC_ for client-side access
export const FRONTEND_DOMAIN = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;

// Service domains
export const USER_SERVICE_DOMAIN = process.env.NEXT_PUBLIC_USER_SERVICE_DOMAIN;
export const POSTS_SERVICE_DOMAIN = process.env.NEXT_PUBLIC_POSTS_SERVICE_DOMAIN;
export const MESSAGE_SERVICE_DOMAIN = process.env.NEXT_PUBLIC_MESSAGE_SERVICE_DOMAIN;
export const NOTIFICATION_SERVICE_DOMAIN = process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_DOMAIN;
export const ADS_SERVICE_DOMAIN = process.env.NEXT_PUBLIC_ADS_SERVICE_DOMAIN;


export const USER_SERVICE_URL = `${USER_SERVICE_DOMAIN}/api/user-service`;
export const POSTS_SERVICE_URL = `${POSTS_SERVICE_DOMAIN}/api/posts-service`;
export const MESSAGE_SERVICE_URL = `${MESSAGE_SERVICE_DOMAIN}/api/message-service`;
export const NOTIFICATION_SERVICE_URL = `${NOTIFICATION_SERVICE_DOMAIN}/api/notification-service`;
export const ADS_SERVICE_URL = `${ADS_SERVICE_DOMAIN}/api/ads-service`;

export const SOCKET_URI = MESSAGE_SERVICE_DOMAIN;
export const USER_SOCKET_URI = USER_SERVICE_DOMAIN;
export const NOTIFICATION_SOCKET_URI = NOTIFICATION_SERVICE_DOMAIN;

// Auth related constants
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const PAYU_MERCHANT_KEY = process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY;

// Server-side only secrets (don't prefix with NEXT_PUBLIC_)
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Environment check
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
