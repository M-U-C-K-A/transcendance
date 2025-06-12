"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { generalMessage, Message } from "./types";

export const usePublicMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);

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

  const setupWebSocket = useCallback(() => {
    const current = socketRef.current;
    if (current && (current.readyState === WebSocket.OPEN || current.readyState === WebSocket.CONNECTING)) {
      console.warn("⛔ WebSocket déjà actif, aucune nouvelle connexion.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) return;

    const wsUrl = `wss://c1r3p11.42lehavre.fr:3001/wss/chat`;
    const newSocket = new WebSocket(wsUrl, [token]);

    newSocket.onopen = () => {
      console.log("✅ WebSocket connected for public chat");
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_PUBLIC_MESSAGE") {
        const newMessage = transformApiMessage(data.message);
        setMessages(prev => {
          if (prev.some(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      }
    };

    newSocket.onclose = () => {
      console.log("🔌 WebSocket disconnected, attempting reconnect...");
      reconnectTimer.current = setTimeout(() => setupWebSocket(), 3000);
    };

    socketRef.current = newSocket;
  }, []);

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
      if (!response.ok) throw new Error("Erreur serveur");
      const rawData: generalMessage[] = await response.json();
      const transformed = rawData
        .sort((a, b) => a.id - b.id)
        .map(transformApiMessage);
      setMessages(transformed);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Impossible de charger les messages généraux.");
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    fetchMessages();
    setupWebSocket();

    return () => {
      hasInitialized.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      socketRef.current?.close();
    };
  }, [fetchMessages, setupWebSocket]);

  return {
    messages,
    fetchMessages,
    isLoading,
    error,
    socketStatus: socketRef.current?.readyState,
  };
};
