"use client";
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PrivateChat } from "./chat/privateChat/PrivateChat";
import { usePrivateMessages } from "./chat/privateChat/usePrivateMessages";
import { PrivateConversation } from "./chat/privateChat/type";
import { useI18n } from "@/i18n-client";

interface ChatComponentProps {
  placeholder?: string;
  currentUser: string;
}

interface SendMessageData {
  recipient?: number;
  content: string;
  messageType: string;
}

export function ChatComponent({ placeholder = "\u00c9crivez un message...", currentUser }: ChatComponentProps) {
  const [selectedPrivateUser, setSelectedPrivateUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newPrivateUser, setNewPrivateUser] = useState("");
  const [privateConversations, setPrivateConversations] = useState<PrivateConversation[]>([]);
  const [sendError, setSendError] = useState<string | null>(null);

  const t = useI18n();

  const {
    messages: privateMessages,
    fetchPrivateMessages,
    isLoading,
    error: currentError
  } = usePrivateMessages(currentUser);

  useEffect(() => {
    const conversationsMap = new Map<string, PrivateConversation>();

    privateMessages.forEach(msg => {
      const isCurrentUserSender = msg.user.name === currentUser;
      const otherUser = isCurrentUserSender
        ? msg.recipient?.name
        : msg.user.name;

      if (!otherUser) return;

      // Calcul des messages non lus
      const unreadCount = !isCurrentUserSender && !msg.isRead ? 1 : 0;
      const existing = conversationsMap.get(otherUser);

      // Utilisation de l'avatar de l'autre utilisateur
      const avatar = isCurrentUserSender
        ? msg.recipient?.avatar || ''
        : msg.user.avatar || '';

      conversationsMap.set(otherUser, {
        id: isCurrentUserSender ? msg.recipient?.id ?? 0 : msg.user.id,
        userName: otherUser,
        avatar: avatar,
        unreadCount: (existing?.unreadCount || 0) + unreadCount,
        lastMessage: msg.text,
        lastMessageTime: msg.timestamp,
      });
    });

    setPrivateConversations(Array.from(conversationsMap.values()));
  }, [privateMessages, currentUser]);

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim()) {
      setSendError("Le message ne peut pas \u00eatre vide");
      return;
    }

    setSendError(null);

    const payload: SendMessageData = {
      content: newMessage,
      messageType: "PRIVATE",
    };

    if (!selectedPrivateUser) {
      setSendError("Aucun destinataire s\u00e9lectionn\u00e9.");
      return;
    }

    const recipientConversation = privateConversations.find(
      conv => conv.userName === selectedPrivateUser
    );
    const recipientId = recipientConversation?.id;

    if (!recipientId) {
      setSendError("Destinataire introuvable.");
      return;
    }

    payload.recipient = recipientId;

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await res.json();

      if (!res.ok) {
        if (responseBody.error === "This user blocked you") {
          setSendError("Cet utilisateur vous a bloqu\u00e9.");
        } else if (responseBody.error === "You blocked this user") {
          setSendError("Vous avez bloqu\u00e9 cet utilisateur.");
        } else {
          setSendError(responseBody.error || "\u00c9chec de l'envoi du message.");
        }
        return;
      }

      setNewMessage("");
      await fetchPrivateMessages();
    } catch (err) {
      setSendError("Une erreur est survenue lors de l'envoi.");
      console.error("Erreur lors de l'envoi du message :", err);
    }
  }, [newMessage, selectedPrivateUser, fetchPrivateMessages, privateConversations]);

  const handleContactAdded = (contact: { id: number; userName: string }) => {
    setSelectedPrivateUser(contact.userName);

    const alreadyExists = privateConversations.some(
      conv => conv.userName === contact.userName
    );

    if (!alreadyExists) {
      const newConversation: PrivateConversation = {
        id: contact.id,
        userName: contact.userName,
        avatar: '', // Initialement vide, sera rempli par les messages
        unreadCount: 0,
        lastMessage: "",
        lastMessageTime: new Date(),
      };

      setPrivateConversations(prev => [newConversation, ...prev]);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-y-hidden">
      <PrivateChat
        messages={privateMessages}
        conversations={privateConversations}
        selectedUser={selectedPrivateUser}
        currentUser={currentUser}
        newMessage={newMessage}
        newPrivateUser={newPrivateUser}
        onNewMessageChange={setNewMessage}
        onNewPrivateUserChange={setNewPrivateUser}
        onSendMessage={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        onAddNewUser={() => {
          if (newPrivateUser.trim()) {
            setNewPrivateUser("");
          }
        }}
        onSelectUser={setSelectedPrivateUser}
        onBack={() => setSelectedPrivateUser(null)}
        onContactAdded={handleContactAdded}
        sendError={sendError}
      />
    </div>
  );
}
