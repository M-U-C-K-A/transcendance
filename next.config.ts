import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/profile/:path*",
        destination: "http://localhost:3001/profile/:path*"
      },
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:3001/auth/:path*"
      },
      {
        source: "/api/user/me",
        destination: "http://localhost:3001/profile/me"
      },
      {
        source: "/api/editprofile",
        destination: "http://localhost:3001/editprofile"
      },
      {
        source: "/api/friends/:path*",
        destination: "http://localhost:3001/friends/:path*"
      },
      {
        source: "/api/friends/request",
        destination: "http://localhost:3001/friends/request"
      },
      {
        source: "/api/friends/pending",
        destination: "http://localhost:3001/friends/pending"
      },
      {
        source: "/api/friends/remove",
        destination: "http://localhost:3001/friends/remove"
      },
      {
        source: "/api/friends/accept",
        destination: "http://localhost:3001/friends/accept"
      },
      {
        source: "/api/chat/receive",
        destination: "http://localhost:3001/chat/receive"
      },
      {
        source: "/api/chat/create",
        destination: "http://localhost:3001/chat/create"
      },
      {
        source: "/api/match/list",
        destination: "http://localhost:3001/match/list"
      },
      {
        source: "/api/chat/send",
        destination: "http://localhost:3001/chat/send"
      }
    ];
  },
  async headers() {
    return [
      {
        source: "/api/chat/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" }
        ]
      }
    ];
  }
};

export default nextConfig;
