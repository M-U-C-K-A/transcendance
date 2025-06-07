"use client"
import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PublicChat } from "./chat/PublicChat"
import { PrivateChat } from "./chat/PrivateChat"

/*****************************************************************
 * TYPES ET INTERFACES
 *****************************************************************/
type Tab = "public" | "private";

// Format interne des messages utilisé dans l'application
type Message = {
	id: number
	user: {
		id: number
		name: string
		avatar: string
	}
	text: string
	timestamp: Date
	isPrivate: boolean
	recipient?: string  // seulement pour les messages privés
	isRead: boolean
}

// Format des messages reçus de l'API
interface ServerMessage {
  id: number
  text: string
  timestamp: string
  isRead: boolean
  isGeneral: boolean
  messageType: string
  sender_id: number
  sender_name: string
  sender_avatar: string
  sender_win: number
  sender_lose: number
  sender_elo: number
  recipient_id: number | null
  recipient_name: string | null
  recipient_avatar: string | null
  recipient_win: number | null
  recipient_lose: number | null
  recipient_elo: number | null
}

// Format des conversations privées
type PrivateConversation = {
	id: number
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

/*****************************************************************
 * COMPOSANT PRINCIPAL
 *****************************************************************/
export function ChatComponent({ placeholder = "Écrivez un message...", currentUser }: ChatComponentProps) {
	/*****************************************************************
	 * ÉTATS
	 *****************************************************************/
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [activeTab, setActiveTab] = useState<Tab>("public");
	const [selectedPrivateUser, setSelectedPrivateUser] = useState<string | null>(null);
	const [privateConversations, setPrivateConversations] = useState<PrivateConversation[]>([]);
	const [newPrivateUser, setNewPrivateUser] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	/*****************************************************************
	 * FONCTIONS UTILITAIRES
	 *****************************************************************/
	const getAuthHeaders = () => ({
		"Content-Type": "application/json",
		"Authorization": `Bearer ${localStorage.getItem("token")}`
	});

	/**
	 * Transforme un message de l'API vers le format interne
	 */
const transformApiMessage = (apiMessage: any, currentUser: string): Message => {
  // Fallback values for missing data
  const sender = {
    id: apiMessage.sender_id ?? apiMessage.user?.id ?? 0,
    name: apiMessage.sender_name ?? apiMessage.user?.name ?? 'Unknown',
    avatar: apiMessage.sender_avatar ?? `/profilepicture/${apiMessage.sender_id}.webp`,
    win: apiMessage.sender_win ?? 0,
    lose: apiMessage.sender_lose ?? 0,
    elo: apiMessage.sender_elo ?? 0
  };

  const recipient = apiMessage.recipient_id ? {
    id: apiMessage.recipient_id,
    name: apiMessage.recipient_name ?? 'Unknown',
    avatar: apiMessage.recipient_avatar ?? `/profilepicture/${apiMessage.recipient_id}.webp`,
    win: apiMessage.recipient_win ?? 0,
    lose: apiMessage.recipient_lose ?? 0,
    elo: apiMessage.recipient_elo ?? 0
  } : null;

  return {
    id: apiMessage.id,
    user: sender,
    recipient: recipient,
    text: apiMessage.text ?? apiMessage.content ?? '',
    timestamp: new Date(apiMessage.timestamp ?? apiMessage.sendAt ?? Date.now()),
    isPrivate: !!apiMessage.isPrivate ?? !apiMessage.isGeneral,
    isRead: !!apiMessage.isRead
  };
};

	/*****************************************************************
	 * GESTION DES MESSAGES
	 *****************************************************************/
	/**
	 * Récupère les messages depuis l'API et les transforme
	 */
const fetchMessages = useCallback(async () => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch(`/api/chat/receive`, {
      headers: getAuthHeaders()
    });

    const rawData = await response.json();
    console.log("RAW BACKEND RESPONSE:", rawData); // <-- Ajoutez ce log

    const transformedMessages = rawData.map(msg => transformApiMessage(msg, currentUser));
    console.log("TRANSFORMED MESSAGES:", transformedMessages);

    setMessages(transformedMessages);
  } catch (err) {
    console.error("Fetch messages error:", err);
    setError("Impossible de se connecter au serveur de chat");
    setMessages([]);
  } finally {
    setIsLoading(false);
  }
}, [currentUser]);

	/**
	 * Envoie un nouveau message
	 */
	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim()) return;

		const isPrivate = activeTab === "private" && (selectedPrivateUser || newPrivateUser);
		const recipientUsername = isPrivate ? (selectedPrivateUser || newPrivateUser) : undefined;

		try {
			let recipientId;
			if (isPrivate && recipientUsername) {
				// Récupère l'ID du destinataire
				const createResponse = await fetch('/api/chat/create', {
					method: 'POST',
					headers: getAuthHeaders(),
					body: JSON.stringify({ username: recipientUsername }),
				});

				if (!createResponse.ok) throw new Error("Utilisateur non trouvé");
				recipientId = (await createResponse.json()).id;
			}

			// Envoie le message
			const response = await fetch(`/api/chat/send`, {
				method: "POST",
				headers: getAuthHeaders(),
				body: JSON.stringify({
					content: newMessage,
					recipient: recipientId,
					messageType: "text",
					isGeneral: !isPrivate
				})
			});

			if (!response.ok) throw new Error("Échec de l'envoi du message");

			// Réinitialise et rafraîchit
			setNewMessage("");
			if (newPrivateUser) {
				setSelectedPrivateUser(newPrivateUser);
				setNewPrivateUser("");
			}
			await fetchMessages();
		} catch (err) {
			console.error("Erreur envoi message:", err);
			setError("Échec de l'envoi. Veuillez réessayer.");
		}
	};

	/*****************************************************************
	 * EFFETS
	 *****************************************************************/
	// Charge les messages au montage et quand currentUser change
	useEffect(() => {
		fetchMessages();
	}, [currentUser, fetchMessages]);

	// Met à jour la liste des conversations privées
	useEffect(() => {
		const privateUsers = Array.from(
			new Set(
				messages
					.filter(msg => msg.isPrivate)
					.map(msg => msg.user.name === currentUser ? msg.recipient : msg.user.name)
					.filter(name => name && name !== currentUser)
			)
		);

		const conversations = privateUsers.map(userName => {
			const userMessages = messages.filter(msg =>
				msg.isPrivate &&
				((msg.user.name === userName && msg.recipient === currentUser) ||
				(msg.user.name === currentUser && msg.recipient === userName))
			);

			const otherUserMessage = userMessages.find(msg => msg.user.name === userName);
			const userId = otherUserMessage?.user.id || 0;

			return {
				id: userId,
				userName: userName as string,
				avatar: `/profilepicture/${userId}.webp`,
				unreadCount: userMessages.filter(msg =>
					msg.user.name !== currentUser && !msg.isRead
				).length,
				lastMessage: userMessages[userMessages.length - 1]?.text,
				lastMessageTime: userMessages[userMessages.length - 1]?.timestamp
			};
		});

		setPrivateConversations(conversations);
	}, [messages, currentUser]);

	// Marque les messages comme lus quand une conversation est sélectionnée
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

	/*****************************************************************
	 * FILTRAGE DES MESSAGES
	 *****************************************************************/
	const filteredMessages = messages.filter(msg => {
		if (activeTab === "public") return !msg.isPrivate;

		if (!selectedPrivateUser) return false;
		return msg.isPrivate &&
			((msg.user.name === currentUser && msg.recipient === selectedPrivateUser) ||
			 (msg.user.name === selectedPrivateUser && msg.recipient === currentUser));
	});

	/*****************************************************************
	 * RENDU CONDITIONNEL (CHARGEMENT/ERREUR)
	 *****************************************************************/
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

	/*****************************************************************
	 * RENDU PRINCIPAL
	 *****************************************************************/
	return (
		<Tabs
			defaultValue="public"
			className="h-full flex flex-col justify-between"
			onValueChange={value => {
				setActiveTab(value as Tab);
				if (value === "public") setSelectedPrivateUser(null);
			}}
		>
			{/* Onglets Public/Privé */}
			<TabsList className="grid w-full grid-cols-2 mb-4">
				<TabsTrigger value="public">Public</TabsTrigger>
				<TabsTrigger value="private">Privé</TabsTrigger>
			</TabsList>

			{/* Chat Public */}
			<TabsContent value="public" className="flex-1 overflow-hidden">
				<PublicChat
					messages={filteredMessages}
					newMessage={newMessage}
					onNewMessageChange={setNewMessage}
					onSendMessage={handleSendMessage}
					placeholder={placeholder}
				/>
			</TabsContent>

			{/* Chat Privé */}
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
