"use client";
import { useState, useCallback } from "react";
import { Message } from "../publicChat/types";

export const usePrivateMessages = (currentUser: string) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchPrivateMessages = useCallback(async (withUser?: string) => {
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

			const rawData = await response.json();
			const transformed = rawData.map((msg: any): Message => {
				const isSender = msg.sender?.username === currentUser;

				const sender = isSender ? msg.sender : msg.collegue;
				const recipient = isSender ? msg.collegue : msg.sender;

				return {
					id: msg.id,
					user: {
						id: sender.id,
						name: sender.username,
						avatar: `/profilepicture/${sender.id}.webp`,
						win: sender.win ?? 0,
						lose: sender.lose ?? 0,
						elo: sender.elo ?? 1000,
					},
					recipient: recipient
						? {
								id: recipient.id,
								name: recipient.username,
								avatar: `/profilepicture/${recipient.id}.webp`,
								win: recipient.win ?? 0,
								lose: recipient.lose ?? 0,
								elo: recipient.elo ?? 1000,
						  }
						: undefined,
					text: msg.content,
					timestamp: new Date(msg.sendAt),
					isPrivate: true,
					isRead: msg.isRead || false
				};
			});

			setMessages(transformed);
		} catch (err) {
			setError("Erreur de récupération des messages privés.");
		} finally {
			setIsLoading(false);
		}
	}, [currentUser]);

	return { messages, fetchPrivateMessages, isLoading, error };
};

