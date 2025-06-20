import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Swords } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { sendMessageData } from "@/types/chat";

type MessageInputProps = {
	value: string;
	onChange: (value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
	placeholder?: string;
	recipientId: number;
};

export function MessageInput({
	value,
	onChange,
	onSubmit,
	placeholder = "Écrivez un message...",
	recipientId,
}: MessageInputProps) {
	const [hasGame, setHasGame] = useState(false);
	const [gameData, setGameData] = useState({ id: '', name: '' });

	useEffect(() => {
		const gameID = localStorage.getItem('currentGameId');
		const gameNAME = localStorage.getItem('currentGameName');

		if (gameID && gameNAME) {
			setHasGame(true);
			setGameData({ id: gameID, name: gameNAME });
		}
	}, []);

	const handleGameClick = async (e: React.MouseEvent) => {
		e.preventDefault();

		if (!recipientId) {
			alert("Aucun destinataire sélectionné !");
			return;
		}

		const payload = {
			content: gameData.id,
			messageType: 'INVITATION',
			recipient: recipientId,
		};

		const data = sendMessageData.safeParse(payload)

		const token = localStorage.getItem('token');

		try {
			const response = await fetch('/api/chat/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: "include",
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				console.error("Erreur lors de l'envoi du message de jeu", response.statusText);
			} else {
				onChange('');
			}
		} catch (error) {
			console.error("Erreur réseau lors de l'envoi du message de jeu", error);
		}
	};

	return (
		<form onSubmit={onSubmit} className="flex gap-2 p-2 items-center border-t-1 w-full">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={handleGameClick}
							aria-label="Partager une partie"
							type="button"
							disabled={!recipientId || !hasGame}
							className={`${(!recipientId || !hasGame) ? "opacity-50 cursor-not-allowed" : ""}`}
						>
							<Swords className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						{hasGame ? "Partager une partie" : "Lancer une partie"}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<Input
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="flex-1"
			/>
			<Button type="submit" aria-label="Send message">
				<Send className="h-4 w-4" />
			</Button>
		</form>
	);
}
