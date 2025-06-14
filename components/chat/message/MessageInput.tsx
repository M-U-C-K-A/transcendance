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
import { sendMessageData } from "@/server/request/chat/interface";

type MessageInputProps = {
	value: string;
	onChange: (value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
	placeholder?: string;
};

export function MessageInput({ value, onChange, onSubmit, placeholder = "Écrivez un message..." }: MessageInputProps) {
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
		if (!hasGame) return;

		const content = `Rejoignez ma partie "${gameData.name}": [lien du jeu](https://c2r8p5.42lehavre.fr:8443/en/game/custom/${gameData.id})`;

		const payload: sendMessageData = {
			content,
			messageType: 'INVITATION',
		};

		const token = localStorage.getItem('token');

		try {
			const response = await fetch('/api/chat/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token ? `Bearer ${token}` : '',
				},
				body: JSON.stringify(payload),
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

	useEffect(() => {
		const handleLinkClick = async (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (target.tagName === 'A' && target.textContent?.includes("Rejoignez ma partie")) {
				e.preventDefault();
				try {
					await fetch('/api/game/join', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ reason: 'from-invite', content: target.textContent }),
					});
					console.log('Requête envoyée à /game/join');
				} catch (err) {
					console.error('Erreur lors de la création de la partie', err);
				}
			}
		};

		document.addEventListener('click', handleLinkClick);
		return () => document.removeEventListener('click', handleLinkClick);
	}, []);

	return (
		<form onSubmit={onSubmit} className="flex gap-2 p-2 items-center border-t-1 w-full">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						{hasGame ? (
							<Button
								variant="outline"
								size="icon"
								className="opacity-100 cursor-pointer"
								onClick={handleGameClick}
								aria-label="Partager une partie"
							>
								<Swords className="h-4 w-4" />
							</Button>
						) : (
							<span className="border opacity-50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 cursor-not-allowed">
								<Swords />
							</span>
						)}
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
