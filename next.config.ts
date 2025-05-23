import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/chat/:path*",
        destination: "http://localhost:3001/getmessage/:path*"
      },
      {
        source: "/api/chat/send",
        destination: "http://localhost:3001/chat/send"
      },
      {
        source: "/api/profile/:path*",
        destination: "http://localhost:3001/profile/:path*"
      },
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:3001/auth/:path*"
      },
      {
        source: "/api/friends/:path*",
        destination: "http://localhost:3001/friends/list/:path*"
      },
      {
        source: "/api/user/me",
        destination: "http://localhost:3001/profile/me"
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/api/chat/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "http://localhost:3000" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" }
        ]
      }
    ]
  }
};

export default nextConfig;
