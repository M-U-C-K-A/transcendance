import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/profile/:path*",
        destination: "https://backend/profile/:path*"
      },
      {
        source: "/api/auth/:path*",
        destination: "https://backend/auth/:path*"
      },
      {
        source: "/api/user/me",
        destination: "https://backend/profile/me"
      },
      {
        source: "/api/editprofile",
        destination: "https://backend/editprofile"
      },
      {
        source: "/api/friends/:path*",
        destination: "https://backend/friends/:path*"
      },
      {
        source: "/api/friends/request",
        destination: "https://backend/friends/request"
      },
      {
        source: "/api/friends/pending",
        destination: "https://backend/friends/pending"
      },
      {
        source: "/api/friends/remove",
        destination: "https://backend/friends/remove"
      },
      {
        source: "/api/friends/accept",
        destination: "https://backend/friends/accept"
      },
      {
        source: "/api/chat/receive/general",
        destination: "https://backend/chat/receive/general"
      },
      {
        source: "/api/chat/receive/private",
        destination: "https://backend/chat/receive/private"
      },
      {
        source: "/api/chat/create",
        destination: "https://backend/chat/create"
      },
      {
        source: "/api/match/list",
        destination: "https://backend/match/list"
      },
      {
        source: "/api/match/create",
        destination: "https://backend/match/create"
      },
      {
        source: "/api/chat/send",
        destination: "https://backend/chat/send"
      },
      {
        source: "/api/chat/block",
        destination: "https://backend/chat/block"
      }
    ];
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://localhost:3000" }, // adapter selon ton frontend
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type,Authorization" },
        ],
      },
    ];
  }
};

export default nextConfig;
