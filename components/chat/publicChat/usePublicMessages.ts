"use client";
import { useState, useEffect, useRef } from "react";
import { generalMessage, Message } from "./types";

export const usePublicMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
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

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chat/receive/general`, {
        credentials: 'include',
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
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    fetchMessages();

    const wssUrl = process.env.NEXT_PUBLIC_WEBSOCKET_FOR_CHAT;
    if (!wssUrl) {
      console.error("❌ WebSocket URL non définie");
      return;
    }

    const socket = new WebSocket(wssUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connecté pour le chat public");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_PUBLIC_MESSAGE") {
        const newMessage = transformApiMessage(data.message);
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket déconnecté, tentative de reconnexion...");
      setTimeout(() => {
        hasInitialized.current = false;
      }, 3000);
    };

    return () => {
      socket.close();
    };
  }, []);

  return {
    messages,
    fetchMessages,
    isLoading,
    error,
    socketStatus: socketRef.current?.readyState,
  };
};
