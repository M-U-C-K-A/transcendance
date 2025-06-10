"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { generalMessage, Message } from "./types";

export const usePublicMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

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
    if (socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) {
      console.warn("⛔ WebSocket déjà actif, aucune nouvelle connexion.");
      return () => {};
    }

    const token = localStorage.getItem("token");
    if (!token) return () => {};

    const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_FOR_CHAT || "";

    const newSocket = new WebSocket(wsUrl, [token]);

    newSocket.onopen = () => {
      console.log("✅ WebSocket connected for public chat");
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_PUBLIC_MESSAGE") {
        const newMessage = transformApiMessage(data.message);
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    newSocket.onclose = () => {
      console.log("🔌 WebSocket disconnected, attempting reconnect...");
      setTimeout(() => setupWebSocket(), 3000);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [socket]);

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

      if (!response.ok) throw new Error("Erreur serveur");

      const rawData: generalMessage[] = await response.json();
      const transformedMessages = rawData
        .sort((a, b) => a.id - b.id)
        .map(transformApiMessage);

      setMessages(transformedMessages);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Impossible de charger les messages généraux.";
      setError(errorMessage);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    fetchMessages();
    const cleanupSocket = setupWebSocket();

    return () => {
      cleanupSocket?.();
      hasInitialized.current = false;
    };
  }, []);

  const addTestMessage = useCallback((testMessage: string) => {
    const testMsg: Message = {
      id: Math.random() * 1000000,
      user: {
        id: 999,
        name: "TestUser",
        avatar: "/profilepicture/2.webp",
        win: 0,
        lose: 0,
        elo: 1000,
      },
      text: testMessage,
      timestamp: new Date(),
      isPrivate: false,
      isRead: true,
    };
    setMessages((prev) => [...prev, testMsg]);
  }, []);

  return {
    messages,
    fetchMessages,
    isLoading,
    error,
    addTestMessage,
    socketStatus: socket?.readyState,
  };
};
