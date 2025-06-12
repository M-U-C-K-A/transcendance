"use client";
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PublicChat } from "./chat/publicChat/PublicChat";
import { PrivateChat } from "./chat/privateChat/PrivateChat";
import { usePublicMessages } from "./chat/publicChat/usePublicMessages";
import { usePrivateMessages } from "./chat/privateChat/usePrivateMessages";
import { PrivateConversation } from "./chat/privateChat/type";

type Tab = "public" | "private";

interface ChatComponentProps {
	placeholder?: string;
	currentUser: string;
}

interface SendMessageData {
	recipient?: number;
	content: string;
	messageType: string;
}

export function ChatComponent({ placeholder = "Écrivez un message...", currentUser }: ChatComponentProps) {
	const [activeTab, setActiveTab] = useState<Tab>("public");
	const [selectedPrivateUser, setSelectedPrivateUser] = useState<string | null>(null);
	const [newMessage, setNewMessage] = useState("");
	const [newPrivateUser, setNewPrivateUser] = useState("");
	const [privateConversations, setPrivateConversations] = useState<PrivateConversation[]>([]);
	const [sendError, setSendError] = useState<string | null>(null);

	const {
		messages: publicMessages,
		fetchMessages,
		isLoading: loadingPublic,
		error: errorPublic
	} = usePublicMessages();

	const {
		messages: privateMessages,
		fetchPrivateMessages,
		isLoading: loadingPrivate,
		error: errorPrivate
	} = usePrivateMessages(currentUser);

	useEffect(() => {
		const conversationsMap = new Map<string, PrivateConversation>();

		privateMessages.forEach(msg => {
			const isCurrentUserSender = msg.user.name === currentUser;
			const otherUser = isCurrentUserSender ? msg.recipient?.name : msg.user.name;

			if (!otherUser) return;

			const unreadCount = !isCurrentUserSender && !msg.isRead ? 1 : 0;
			const existing = conversationsMap.get(otherUser);

			conversationsMap.set(otherUser, {
				id: isCurrentUserSender ? msg.recipient?.id ?? 0 : msg.user.id,
				userName: otherUser,
				avatar: `/profilepicture/${isCurrentUserSender ? msg.recipient?.id ?? 0 : msg.user.id}.webp`,
				unreadCount: (existing?.unreadCount || 0) + unreadCount,
				lastMessage: msg.text,
				lastMessageTime: msg.timestamp,
			});
		});

		setPrivateConversations(Array.from(conversationsMap.values()));
	}, [privateMessages, currentUser]);

	const sendMessage = useCallback(async () => {
		if (!newMessage.trim()) return;

		setSendError(null);

		const payload: SendMessageData = {
			content: newMessage,
			messageType: activeTab === "public" ? "GENERAL" : "PRIVATE",
		};

		if (activeTab === "private") {
			if (!selectedPrivateUser) {
				setSendError("Aucun destinataire sélectionné.");
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
		}

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
					setSendError("Cet utilisateur vous a bloqué.");
				} else if (responseBody.error === "You blocked this user") {
					setSendError("Vous avez bloqué cet utilisateur.");
				} else {
					setSendError("Échec de l'envoi du message.");
				}
				return;
			}

			setNewMessage("");
			await (activeTab === "public" ? fetchMessages() : fetchPrivateMessages());
		} catch (err) {
			setSendError("Une erreur est survenue lors de l'envoi.");
			console.error("Erreur lors de l'envoi du message :", err);
		}
	}, [
		newMessage,
		activeTab,
		selectedPrivateUser,
		fetchMessages,
		fetchPrivateMessages,
		privateConversations
	]);

	const isLoading = activeTab === "public" ? loadingPublic : loadingPrivate;
	const error = activeTab === "public" ? errorPublic : errorPrivate;

	const handleContactAdded = (contact: { id: number; userName: string }) => {
		setSelectedPrivateUser(contact.userName);

		const alreadyExists = privateConversations.some(
			conv => conv.userName === contact.userName
		);

		if (!alreadyExists) {
			const newConversation: PrivateConversation = {
				id: contact.id,
				userName: contact.userName,
				avatar: `/profilepicture/${contact.id}.webp`,
				unreadCount: 0,
				lastMessage: "",
				lastMessageTime: new Date(),
			};

			setPrivateConversations(prev => [newConversation, ...prev]);
		}
	};

	return isLoading ? (
		<div className="flex h-full justify-center items-center">Chargement...</div>
	) : error ? (
		<div className="text-red-500 text-center">{error}</div>
	) : (
		<Tabs
			defaultValue="public"
			onValueChange={(val) => {
				setActiveTab(val as Tab);
				setNewMessage(""); // Nettoyage du champ message
				if (val === "public") setSelectedPrivateUser(null);
			}}
			className="h-full flex flex-col overflow-y-hidden"
		>
			<TabsList className="grid grid-cols-2 w-full">
				<TabsTrigger value="public">Public</TabsTrigger>
				<TabsTrigger value="private">Privé</TabsTrigger>
			</TabsList>

			<TabsContent value="public" className="flex-1">
				<PublicChat
					messages={publicMessages}
					newMessage={newMessage}
					onNewMessageChange={setNewMessage}
					onSendMessage={e => {
						e.preventDefault();
						sendMessage();
					}}
					placeholder={placeholder}
					currentUser={currentUser}
				/>
			</TabsContent>

			<TabsContent value="private" className="flex-1">
				<PrivateChat
					messages={privateMessages}
					conversations={privateConversations}
					selectedUser={selectedPrivateUser}
					currentUser={currentUser}
					newMessage={newMessage}
					newPrivateUser={newPrivateUser}
					onNewMessageChange={setNewMessage}
					onNewPrivateUserChange={setNewPrivateUser}
					onSendMessage={e => {
						e.preventDefault();
						sendMessage();
					}}
					onAddNewUser={() => setNewPrivateUser("")}
					onSelectUser={setSelectedPrivateUser}
					onBack={() => setSelectedPrivateUser(null)}
					onContactAdded={handleContactAdded}
					sendError={sendError}
				/>
			</TabsContent>
		</Tabs>
	);
}
