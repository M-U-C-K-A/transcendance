import { useState } from "react";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n-client";

const AddContactSchema = z.object({
	username: z.string()
		.min(3, "Le nom doit contenir au moins 3 caractères")
		.max(20, "Le nom ne peut pas dépasser 20 caractères")
		.regex(/^[a-zA-Z0-9_]+$/, "Caractères alphanumériques seulement"),
});

type PrivateConversation = {
	id: number;
	userName: string;
	avatar: string;
	unreadCount: number;
	lastMessage?: string;
	lastMessageTime?: Date;
};

type PrivateConversationListProps = {
	conversations: PrivateConversation[];
	newPrivateUser: string;
	onNewPrivateUserChange: (value: string) => void;
	onAddNewUser: () => void;
	onSelectUser: (userName: string) => void;
	onContactAdded: (contact: { id: number; userName: string }) => void;
};

export function PrivateConversationList({
	conversations,
	newPrivateUser,
	onNewPrivateUserChange,
	onAddNewUser,
	onSelectUser,
	onContactAdded,
}: PrivateConversationListProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const handleAddContact = async () => {
		try {
			setError(null);
			if (!newPrivateUser.trim()) {
				setError("Le nom d'utilisateur ne peut pas être vide");
				return;
			}

			const validatedUsername = AddContactSchema.parse({
				username: newPrivateUser.trim(),
			}).username;

			setIsLoading(true);

			const response = await fetch('/api/chat/create', {
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({ username: validatedUsername }),
			});

			const data = await response.json();

			if (!response.ok) {
				if (data.error === "This user blocked you") {
					setError("Cet utilisateur vous a bloqué.");
				} else if (data.error === "You blocked this user") {
					setError("Vous avez bloqué cet utilisateur");
				} else {
					setError(data.error || "Erreur lors de l'ajout du contact");
				}
				return;
			}

			onContactAdded({
				id: data.id,
				userName: data.username,
			});
			onAddNewUser();

		} catch (err) {
			if (err instanceof z.ZodError) {
				setError(err.errors[0].message);
			} else {
				setError("Erreur lors de l'ajout du contact");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const t = useI18n();
	return (
		<div className="flex-1 overflow-y-auto max-h-[600px]">
			<div className="p-4">
				<div className="flex gap-2 mb-4">
					<Input
						placeholder="Nom d'utilisateur"
						value={newPrivateUser}
						onChange={(e) => {
							onNewPrivateUserChange(e.target.value);
							setError(null);
						}}
						className="flex-1"
						onKeyDown={(e) => e.key === 'Enter' && handleAddContact()}
					/>
					<Button
						onClick={handleAddContact}
						disabled={!newPrivateUser.trim() || isLoading}
					>
						{isLoading ? "Ajout..." : "Ajouter"}
					</Button>
				</div>

				{error && (
					<p className="text-red-500 text-sm mb-4">{error}</p>
				)}

				<h3 className="text-lg font-medium mb-4">Conversations</h3>

				{conversations.length > 0 ? (
					<div className="space-y-2">
						{[...conversations]
							.sort((a, b) => {
								const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
								const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
								return timeB - timeA;
							})
							.map((conversation) => (
								<div
									key={conversation.userName}
									className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors relative"
									onClick={() => onSelectUser(conversation.userName)}
								>
									<Avatar className="h-10 w-10">
										<AvatarImage
											src={`/profilepicture/${conversation.id}.webp`}
											alt={"conversation"}
										/>
										<AvatarFallback>
										{conversation.userName && conversation.userName.length > 0
											? conversation.userName.charAt(0).toUpperCase()
											: "?"}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<div className="flex justify-between items-center">
											<span className="font-medium truncate">
												{conversation.userName}
											</span>
											{conversation.lastMessageTime && (
												<span className="text-xs text-muted-foreground">
													{formatTime(new Date(conversation.lastMessageTime))}
												</span>
											)}
										</div>
										<p className="text-sm text-muted-foreground truncate">
											{conversation.lastMessage}
										</p>
									</div>
								</div>
							))}
					</div>
				) : (
					<p className="text-muted-foreground text-center py-8">
						{t('chat.noPrivateConversation')}
					</p>
				)}
			</div>
		</div>
	);
}
