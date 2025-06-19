import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/profile/:path*",
				destination: "http://backend:3001/profile/:path*"
			},
			{
				source: "/api/auth/:path*",
				destination: "http://backend:3001/auth/:path*"
			},
			{
				source: "/api/profile/me",
				destination: "http://backend:3001/profile/me"
			},
			{
				source: "/api/editprofile",
				destination: "http://backend:3001/editprofile"
			},
			{
				source: "/api/friends/:path*",
				destination: "http://backend:3001/friends/:path*"
			},
			{
				source: "/api/friends/request",
				destination: "http://backend:3001/friends/request"
			},
			{
				source: "/api/friends/pending",
				destination: "http://backend:3001/friends/pending"
			},
			{
				source: "/api/friends/remove",
				destination: "http://backend:3001/friends/remove"
			},
			{
				source: "/api/friends/accept",
				destination: "http://backend:3001/friends/accept"
			},
			{
				source: "/api/chat/receive/general",
				destination: "http://backend:3001/chat/receive/general"
			},
			{
				source: "/api/chat/receive/private",
				destination: "http://backend:3001/chat/receive/private"
			},
			{
				source: "/api/chat/create",
				destination: "http://backend:3001/chat/create"
			},
			{
				source: "/api/match/list",
				destination: "http://backend:3001/match/list"
			},
			{
				source: "/api/match/create",
				destination: "http://backend:3001/match/create"
			},
			{
				source: "/api/chat/send",
				destination: "http://backend:3001/chat/send"
			},
			{
				source: "/api/chat/block",
				destination: "http://backend:3001/chat/block"
			},
			{
				source: "/api/game/custom",
				destination: "http://backend:3001/game/custom"
			},
			{
				source: "/api/game/travel",
				destination: "http://backend:3001/game/travel"
			},
			{
				source: "/api/game/result",
				destination: "http://backend:3001/game/result"
			},
			{
				source: "/api/gdpr/verify",
				destination: "http://backend:3001/gdpr/verify"
			},
			{
				source: "/api/gdpr/delete",
				destination: "http://backend:3001/gdpr/delete"
			},
			{
				source: "/api/gdpr/getdata",
				destination: "http://backend:3001/gdpr/getdata"
			},
		];
	},
	async headers() {
		return [
			{
				source: "/api/:path*",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{ key: "Access-Control-Allow-Origin", value: "*" },
					{ key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
					{ key: "Access-Control-Allow-Headers", value: "Content-Type,Authorization" },
				],
			},
		];
	}
};

export default nextConfig;
