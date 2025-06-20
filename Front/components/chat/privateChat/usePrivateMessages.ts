"use client";
import { useState, useEffect, useCallback } from "react";
import { Message } from "./type";

const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_FOR_CHAT || '';

interface RawMessage {
  id: number;
  content: string;
  sendAt: string;
  messageType: string;
  isRead: boolean;
  user?: {
    id: number;
    username: string;
    avatar?: string;
    win?: number;
    lose?: number;
    elo?: number;
  };
  collegue?: {
    id: number;
    username: string;
    avatar?: string;
    win?: number;
    lose?: number;
    elo?: number;
  };
  sender?: {
    id: number;
    username: string;
    avatar?: string;
    win?: number;
    lose?: number;
    elo?: number;
  };
}

export const usePrivateMessages = (currentUser: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const transformMessage = useCallback((rawMsg: RawMessage): Message => {
    // Déterminer qui est l'expéditeur et le destinataire
    const isCurrentUserSender = rawMsg.sender?.username === currentUser;
    const sender = rawMsg.sender;
    const recipient = isCurrentUserSender ? rawMsg.collegue : rawMsg.user;

    const buildDataUri = (b64: string | undefined) =>
      b64 ? `data:image/webp;base64,${b64}` : '';

    return {
      id: rawMsg.id,
      user: {
        id: sender?.id || 0,
        name: sender?.username || "Unknown",
        avatar: buildDataUri(sender?.avatar),
        win: sender?.win ?? 0,
        lose: sender?.lose ?? 0,
        elo: sender?.elo ?? 1000,
      },
      recipient: recipient ? {
        id: recipient.id,
        name: recipient.username,
        avatar: buildDataUri(recipient.avatar),
        win: recipient.win ?? 0,
        lose: recipient.lose ?? 0,
        elo: recipient.elo ?? 1000,
      } : undefined,
      text: rawMsg.content,
      timestamp: new Date(rawMsg.sendAt),
      isPrivate: true,
      isRead: rawMsg.isRead || false,
      typeMessage: rawMsg.messageType,
    };
  }, [currentUser]);

  const setupWebSocket = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = new WebSocket(WS_URL, [token]);

    newSocket.onopen = () => {};

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_PRIVATE_MESSAGE') {
        const rawMessage = {
          id: data.message.id,
          content: data.message.content,
          sendAt: data.message.sendAt,
          isRead: false,
          messageType: data.message.messageType,
          sender: data.message.sender,
          collegue: data.message.recipient,
        };
        const newMessage = transformMessage(rawMessage);
        setMessages(prev => [...prev, newMessage]);
      }
    };

    newSocket.onclose = () => {
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
