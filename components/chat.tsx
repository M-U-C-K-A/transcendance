"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PublicChat } from "./chat/PublicChat"
import { PrivateChat } from "./chat/PrivateChat"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

type Message = {
	id: number
	user: {
		name: string
		avatar: string
	}
	text: string
	timestamp: Date
	isPrivate: boolean
	recipient?: string
	isRead: boolean
}

interface ServerMessage {
	id: number
	sender_username: string
	content: string
	sendAt: string
	isGeneral: boolean
	recipient_username?: string
	readStatus: boolean
}

type PrivateConversation = {
	userName: string
	avatar: string
	unreadCount: number
	lastMessage?: string
	lastMessageTime?: Date
}

interface ChatComponentProps {
	placeholder?: string
	currentUser: string
}

export function ChatComponent({ placeholder = "Écrivez un message...", currentUser }: ChatComponentProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [activeTab, setActiveTab] = useState<Tab>("public");
	const [selectedPrivateUser, setSelectedPrivateUser] = useState<string | null>(null);
	const [privateConversations, setPrivateConversations] = useState<PrivateConversation[]>([]);
	const [newPrivateUser, setNewPrivateUser] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchMessages = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/chat/${currentUser}`, {
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (!response.ok) {
				throw new Error(`Erreur ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			const transformedMessages = data.map((msg: ServerMessage) => ({
				id: msg.id,
				user: {
					name: msg.sender_username,
					avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${msg.sender_username}`
				},
				text: msg.content,
				timestamp: new Date(msg.sendAt),
				isPrivate: !msg.isGeneral,
				recipient: msg.recipient_username || undefined,
				isRead: msg.readStatus
			}));

			setMessages(transformedMessages);
		} catch (err) {
			setError("Impossible de se connecter au serveur de chat");
			setMessages([]);
		} finally {
			setIsLoading(false);
		}
	}, [currentUser]);

	useEffect(() => {
		fetchMessages();
	}, [currentUser, fetchMessages]);

	useEffect(() => {
		const privateUsers = Array.from(
			new Set(
				messages
					.filter(msg => msg.isPrivate)
					.map(msg => msg.user.name === currentUser ? msg.recipient : msg.user.name)
					.filter(Boolean)
			)
		);

		const conversations = privateUsers.map(userName => {
			const userMessages = messages.filter(msg =>
				msg.isPrivate &&
				((msg.user.name === userName && msg.recipient === currentUser) ||
				 (msg.user.name === currentUser && msg.recipient === userName))
			);

			return {
				userName: userName as string,
				avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${userName}`,
				unreadCount: userMessages.filter(msg =>
					msg.user.name !== currentUser &&
					!msg.isRead
				).length,
				lastMessage: userMessages[userMessages.length - 1]?.text,
				lastMessageTime: userMessages[userMessages.length - 1]?.timestamp
			};
		});

		setPrivateConversations(conversations);
	}, [messages, currentUser]);

	useEffect(() => {
		if (selectedPrivateUser) {
			setMessages(prev => prev.map(msg =>
				msg.isPrivate &&
				msg.user.name === selectedPrivateUser &&
				msg.recipient === currentUser &&
				!msg.isRead
					? { ...msg, isRead: true }
					: msg
			));
		}
	}, [selectedPrivateUser, currentUser]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim()) return;

		const isPrivate = activeTab === "private" && (selectedPrivateUser || newPrivateUser);
		const recipient = isPrivate ? (selectedPrivateUser || newPrivateUser) : undefined;

		try {
			const response = await fetch(`${BACKEND_URL}/chat/send`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					sender: currentUser,
					recipient,
					content: newMessage,
					isGeneral: !isPrivate
				})
			});

			if (!response.ok) {
				throw new Error("Failed to send message");
			}

			const sentMessage = await response.json();

			const message: Message = {
				id: sentMessage.id,
				user: {
					name: currentUser,
					avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${currentUser}`
				},
				text: newMessage,
				timestamp: new Date(sentMessage.sendAt),
				isPrivate: !!isPrivate,
				recipient,
				isRead: true
			};

			setMessages(prev => [...prev, message]);
			setNewMessage("");
			if (newPrivateUser) {
				setSelectedPrivateUser(newPrivateUser);
				setNewPrivateUser("");
			}
		} catch (err) {
			setError("Échec de l'envoi du message. Veuillez réessayer.");
		}
	};

	const filteredMessages = messages.filter(msg => {
		if (activeTab === "public") return !msg.isPrivate;
		if (!selectedPrivateUser) return false;
		return msg.isPrivate &&
			((msg.user.name === selectedPrivateUser && msg.recipient === currentUser) ||
			 (msg.user.name === currentUser && msg.recipient === selectedPrivateUser));
	});

	if (isLoading) {
		return (
			<div className="flex flex-col h-full justify-center items-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
				<p className="mt-4 text-muted-foreground">Chargement des messages...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col h-full justify-center items-center p-4 text-center">
				<p className="text-destructive mb-4">{error}</p>
				<Button onClick={fetchMessages}>Réessayer</Button>
			</div>
		);
	}

	return (
		<Tabs
			defaultValue="public"
			className="h-full flex flex-col justify-between"
			onValueChange={value => {
				setActiveTab(value as Tab);
				if (value === "public") setSelectedPrivateUser(null);
			}}
		>
			<TabsList className="grid w-full grid-cols-2 mb-4">
				<TabsTrigger value="public">Public</TabsTrigger>
				<TabsTrigger value="private">Privé</TabsTrigger>
			</TabsList>

			<TabsContent value="public" className="flex-1 overflow-hidden">
				<PublicChat
					messages={filteredMessages}
					newMessage={newMessage}
					onNewMessageChange={setNewMessage}
					onSendMessage={handleSendMessage}
					placeholder={placeholder}
				/>
			</TabsContent>

			<TabsContent value="private" className="flex-1 overflow-hidden">
				<PrivateChat
					messages={filteredMessages}
					conversations={privateConversations}
					selectedUser={selectedPrivateUser}
					newMessage={newMessage}
					newPrivateUser={newPrivateUser}
					onNewMessageChange={setNewMessage}
					onNewPrivateUserChange={setNewPrivateUser}
					onSendMessage={handleSendMessage}
					onAddNewUser={() => newPrivateUser.trim() && setSelectedPrivateUser(newPrivateUser.trim())}
					onSelectUser={setSelectedPrivateUser}
					onBack={() => setSelectedPrivateUser(null)}
				/>
			</TabsContent>
		</Tabs>
	);
}
