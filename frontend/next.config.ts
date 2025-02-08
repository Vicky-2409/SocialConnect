import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "social-connect-store.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: 'https',
        hostname: "lh3.googleusercontent.com",
      }
    ],
  },

  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint checks
  },

  // experimental: {
  //   optimizeCss: true,
  // },
};

export default nextConfig;
