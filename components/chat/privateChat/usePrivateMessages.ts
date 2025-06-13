"use client";
import { useState, useEffect, useCallback } from "react";
import { Message } from "../publicChat/types";

interface RawMessage {
	id: number;
	sender?: {
		id: number;
		username: string;
		win?: number;
		lose?: number;
		elo?: number;
	};
	collegue?: {
		id: number;
		username: string;
		win?: number;
		lose?: number;
		elo?: number;
	};
	content: string;
	sendAt: string;
	isRead: boolean;
}

export const usePrivateMessages = (currentUser: string) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [socket, setSocket] = useState<WebSocket | null>(null);

	const transformMessage = useCallback((rawMsg: RawMessage): Message => {
		const isSender = rawMsg.sender?.username === currentUser;
		const sender = isSender ? rawMsg.sender : rawMsg.collegue;
		const recipient = isSender ? rawMsg.collegue : rawMsg.sender;

		return {
			id: rawMsg.id,
			user: {
				id: sender?.id || 0,
				name: sender?.username || "Unknown",
				avatar: `/profilepicture/${sender?.id}.webp`,
				win: sender?.win ?? 0,
				lose: sender?.lose ?? 0,
				elo: sender?.elo ?? 1000,
			},
			recipient: recipient ? {
				id: recipient.id,
				name: recipient.username,
				avatar: `/profilepicture/${recipient.id}.webp`,
				win: recipient.win ?? 0,
				lose: recipient.lose ?? 0,
				elo: recipient.elo ?? 1000,
			} : undefined,
			text: rawMsg.content,
			timestamp: new Date(rawMsg.sendAt),
			isPrivate: true,
			isRead: rawMsg.isRead || false
		};
	}, [currentUser]);

	const setupWebSocket = useCallback(() => {
		const token = localStorage.getItem("token");
		if (!token) return;

		const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_FOR_CHAT || "";

		const newSocket = new WebSocket(wsUrl, [token]);

		newSocket.onopen = () => {
			console.log("WebSocket connected for private chat");
		};

		newSocket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'NEW_PRIVATE_MESSAGE') {
				const rawMessage = {
					id: data.message.id,
					sender: data.message.sender,
					collegue: data.message.recipient,
					content: data.message.content,
					sendAt: data.message.sendAt,
					isRead: false
				};
				const newMessage = transformMessage(rawMessage);
				setMessages(prev => [...prev, newMessage]);
			}
		};

		newSocket.onclose = () => {
			console.log("WebSocket disconnected, attempting reconnect...");
			setTimeout(setupWebSocket, 3000);
		};

		setSocket(newSocket);

		return () => {
			newSocket.close();
		};
	}, [transformMessage]);

	const fetchPrivateMessages = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/chat/receive/private', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				},
				credentials: 'include'
			});

			if (!response.ok) throw new Error("Erreur serveur");

			const rawData: RawMessage[] = await response.json();
			const transformed = rawData.map(transformMessage);
			setMessages(transformed);
		} catch (err: unknown) {
			const errorMessage = err instanceof Error
				? err.message
				: "Erreur de récupération des messages privés.";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [transformMessage]);

	useEffect(() => {
		fetchPrivateMessages();
		setupWebSocket();

		return () => {
			if (socket) {
				socket.close();
			}
		};
	}, [fetchPrivateMessages, setupWebSocket]);

	return {
		messages,
		fetchPrivateMessages,
		isLoading,
		error,
		socketStatus: socket?.readyState
	};
};
