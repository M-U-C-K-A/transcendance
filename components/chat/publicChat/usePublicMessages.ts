import { useState, useEffect, useRef, useCallback } from "react";
import { generalMessage, Message } from "./types";

export const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_FOR_CHAT || "";

export const usePublicMessages = () => {
const [messages, setMessages] = useState<Message[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
const socketRef = useRef<WebSocket | null>(null);
const reconnectTimer = useRef<number | null>(null);
const hasConnected = useRef(false);

const transformApiMessage = useCallback((apiMessage: generalMessage): Message => {
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
	  typeMessage: apiMessage.messageType,
	};
  }, []);

  const fetchMessages = useCallback(async () => {
	setIsLoading(true);
	setError(null);
	try {
	  const response = await fetch(`/api/chat/receive/general`, {
		headers: {
		  "Content-Type": "application/json",
		  Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	  });
	  if (!response.ok) throw new Error(`Erreur serveur ${response.status}`);

	  const rawData: generalMessage[] = await response.json();
	  const sorted = rawData.sort((a, b) => a.id - b.id);
	  setMessages(sorted.map(transformApiMessage));
	} catch (err: unknown) {
	  setError(err instanceof Error ? err.message : "Impossible de charger les messages généraux.");
	  setMessages([]);
	} finally {
	  setIsLoading(false);
	}
  }, [transformApiMessage]);

  useEffect(() => {
	if (hasConnected.current) return;
	hasConnected.current = true;

	const token = localStorage.getItem("token");
	if (!token) return;

	const ws = new WebSocket(WS_URL, [token]);
	socketRef.current = ws;

	ws.onopen = () => {
	  console.log("✅ WebSocket connecté pour le chat public");
	};

	ws.onmessage = (event) => {
	  try {
		const data = JSON.parse(event.data);
		if (data.type === "NEW_PUBLIC_MESSAGE") {
		  const newMsg = transformApiMessage(data.message);
		  setMessages((prev) => [...prev, newMsg]);
		}
	  } catch (e) {
		console.error("Erreur parsing WS message", e);
	  }
	};

	ws.onclose = () => {
	  console.log("🔌 WebSocket déconnecté, tentative de reconnexion dans 3s...");
	  reconnectTimer.current = window.setTimeout(() => {
		hasConnected.current = false;
	  }, 3000);
	};

	return () => {
	  if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
	  ws.close();
	};
  }, [transformApiMessage]);

  useEffect(() => {
	fetchMessages();
  }, [fetchMessages]);

  return {
	messages,
	fetchMessages,
	isLoading,
	error,
	socketStatus: socketRef.current?.readyState,
  };
};
