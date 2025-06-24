"use client";
import { useState, useEffect, useCallback } from "react";
import { Message } from "./type";

const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_FOR_CHAT || "";

interface RawMessage {
  id: number;
  sender: {
	id: number;
	username: string;
	avatar: string;
	win?: number;
	lose?: number;
	elo?: number;
  };
  recipient: {
	id: number;
	username: string;
	avatar: string;
	win?: number;
	lose?: number;
	elo?: number;
  };
  user: {
	id: number;
	username: string;
  };
  content: string;
  sendAt: string;
  isRead: boolean;
  messageType: string;
}

export const usePrivateMessages = (currentUser: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

const transformMessage = useCallback(
	(raw: RawMessage): Message => {
	const isSender = raw.sender.username === currentUser;
	const sender = isSender ? raw.sender : raw.recipient;
	const recipient = isSender ? raw.recipient : raw.sender;
	const me = raw.user;

	return {
		id: raw.id,
		user: {
		  id: sender.id,
		  name: sender.username,
		  avatar: `data:image/png;base64,${sender.avatar}`,
		  win: sender.win ?? 0,
		  lose: sender.lose ?? 0,
		  elo: sender.elo ?? 1000,
		},
		recipient: {
		  id: recipient.id,
		  name: recipient.username,
		  avatar: `data:image/png;base64,${recipient.avatar}`,
		  win: recipient.win ?? 0,
		  lose: recipient.lose ?? 0,
		  elo: recipient.elo ?? 1000,
		},
		me: {
			id: me.id,
			username: me.username,
		},
		text: raw.content,
		timestamp: new Date(raw.sendAt),
		isPrivate: true,
		isRead: raw.isRead,
		typeMessage: raw.messageType,
	  };
	},
	[currentUser]
  );

  const setupWebSocket = useCallback(() => {
	const ws = new WebSocket(WS_URL);

	ws.onmessage = (event) => {
	  const data = JSON.parse(event.data);
	  if (data.type === "NEW_PRIVATE_MESSAGE") {
		const raw: RawMessage = {
			id: data.message.id,
			sender: data.message.user,
			recipient: data.message.recipient,
			user: data.message.user,
			content: data.message.content,
			sendAt: data.message.sendAt,
			isRead: false,
			messageType: data.message.messageType,
		};
		setMessages((prev) => [...prev, transformMessage(raw)]);
	  }
	};

	ws.onclose = () => {
	  setTimeout(setupWebSocket, 3000);
	};

	setSocket(ws);
	return () => {
	  ws.close();
	};
  }, [transformMessage]);

  const fetchPrivateMessages = useCallback(async () => {
	setIsLoading(true);
	setError(null);

	try {
	  const res = await fetch("/api/chat/receive/private", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
	  });
	  if (!res.ok) throw new Error("Erreur serveur");

	  const rawData: RawMessage[] = await res.json();
	  setMessages(rawData.map(transformMessage));
	} catch (err: unknown) {
	  setError(
		err instanceof Error
		  ? err.message
		  : "Erreur de récupération des messages privés."
	  );
	} finally {
	  setIsLoading(false);
	}
  }, [transformMessage]);

  useEffect(() => {
	fetchPrivateMessages();
	setupWebSocket();
	return () => {
	  socket?.close();
	};
  }, [fetchPrivateMessages, setupWebSocket]);

  return {
	messages,
	fetchPrivateMessages,
	isLoading,
	error,
	socketStatus: socket?.readyState,
  };
};
