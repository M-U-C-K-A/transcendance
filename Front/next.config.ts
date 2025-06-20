import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/profile/:path*",
				destination: "https://backend:3001/profile/:path*"
			},
			{
				source: "/api/auth/:path*",
				destination: "https://backend:3001/auth/:path*"
			},
			{
				source: "/api/profile/me",
				destination: "https://backend:3001/profile/me"
			},
			{
				source: "/api/editprofile",
				destination: "https://backend:3001/editprofile"
			},
			{
				source: "/api/friends/:path*",
				destination: "https://backend:3001/friends/:path*"
			},
			{
				source: "/api/friends/request",
				destination: "https://backend:3001/friends/request"
			},
			{
				source: "/api/friends/pending",
				destination: "https://backend:3001/friends/pending"
			},
			{
				source: "/api/friends/remove",
				destination: "https://backend:3001/friends/remove"
			},
			{
				source: "/api/friends/accept",
				destination: "https://backend:3001/friends/accept"
			},
			{
				source: "/api/chat/receive/general",
				destination: "https://backend:3001/chat/receive/general"
			},
			{
				source: "/api/chat/receive/private",
				destination: "https://backend:3001/chat/receive/private"
			},
			{
				source: "/api/chat/create",
				destination: "https://backend:3001/chat/create"
			},
			{
				source: "/api/match/list",
				destination: "https://backend:3001/match/list"
			},
			{
				source: "/api/match/create",
				destination: "https://backend:3001/match/create"
			},
			{
				source: "/api/chat/send",
				destination: "https://backend:3001/chat/send"
			},
			{
				source: "/api/chat/block",
				destination: "https://backend:3001/chat/block"
			},
			{
				source: "/api/game/custom",
				destination: "https://backend:3001/game/custom"
			},
			{
				source: "/api/game/travel",
				destination: "https://backend:3001/game/travel"
			},
			{
				source: "/api/game/result",
				destination: "https://backend:3001/game/result"
			},
			{
				source: "/api/gdpr/verify",
				destination: "https://backend:3001/gdpr/verify"
			},
			{
				source: "/api/gdpr/delete",
				destination: "https://backend:3001/gdpr/delete"
			},
			{
				source: "/api/gdpr/getdata",
				destination: "https://backend:3001/gdpr/getdata"
			},
			{
				source: "/api/gdpr/twofa",
				destination: "https://backend:3001/gdpr/twofa"
			},
			{
				source: "/api/tournament/join",
				destination: "https://backend:3001/tournament/join"
			},
			{
				source: "/profilepicture/:path*",
				destination: "/Shared/public/profilepicture/:path*"
			},
			{
				source: "/game/:path*",
				destination: "/Shared/public/game/:path*"
			},
			{
				source: "/sounds/:path*",
				destination: "/Shared/public/sounds/:path*"
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
