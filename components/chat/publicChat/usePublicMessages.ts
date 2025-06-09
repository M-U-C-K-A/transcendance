"use client";
import { useState, useCallback } from "react";
import { generalMessage, Message } from "./types";

export const usePublicMessages = (currentUser: string) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

const transformApiMessage = (apiMessage: generalMessage): Message => {
	const sender = apiMessage.sender;
	return {
		id: apiMessage.id,
		user: {
			id: sender.id,
			name: sender.username,
			avatar: sender.avatar ?? `/profilepicture/${sender.id}.webp`,
			win: sender.win ?? 0,
			lose: sender.lose ?? 0,
			elo: sender.elo ?? 1000,
		},
		recipient: undefined,
		text: apiMessage.content,
		timestamp: new Date(apiMessage.sendAt),
		isPrivate: false,
		isRead: true,
	};
};

	const fetchMessages = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/chat/receive/general`, {
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${localStorage.getItem("token")}`,
				},
			});
			console.log(response)

			if (!response.ok) throw new Error("Erreur serveur");

			const rawData: generalMessage[] = await response.json();
			const transformedMessages = rawData
				.sort((a, b) => a.id - b.id)
				.map(transformApiMessage);

			setMessages(transformedMessages);
		} catch (err) {
			setError("Impossible de charger les messages généraux.");
			setMessages([]);
		} finally {
			setIsLoading(false);
		}
	}, [currentUser]);

	return { messages, fetchMessages, isLoading, error };
};
