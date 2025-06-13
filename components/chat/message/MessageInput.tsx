import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Swords } from "lucide-react"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

type MessageInputProps = {
	value: string
	onChange: (value: string) => void
	onSubmit: (e: React.FormEvent) => void
	placeholder?: string
}

/**
 * Renders a message input form for sending chat messages.
 *
 * @param {Object} props - The component props.
 * @param {string} props.value - The current value of the message input.
 * @param {function} props.onChange - Callback function to handle changes in the input value.
 * @param {function} props.onSubmit - Callback function to handle form submission.
 * @param {string} [props.placeholder="Écrivez un message..."] - Placeholder text for the input field.
 *
 * @returns {JSX.Element} The message input form component.
 */
export function MessageInput({ value, onChange, onSubmit, placeholder = "Écrivez un message..." }: MessageInputProps)
{
	const [hasGame, setHasGame] = useState(false);
	const [gameData, setGameData] = useState({ id: '', name: '' });

	useEffect(() => {
		// Vérifier le localStorage au montage du composant
		const gameID = localStorage.getItem('currentGameId');
		const gameNAME = localStorage.getItem('currentGameName');

		if (gameID && gameNAME) {
			setHasGame(true);
			setGameData({ id: gameID, name: gameNAME });
		}
	}, []);

	const handleGameClick = (e: React.MouseEvent) => {
		e.preventDefault();
		if (hasGame) {
			// Créer un message avec le lien du jeu
			const gameMessage = `Rejoignez ma partie "${gameData.name}": [lien du jeu](${gameData.id}) <a href="https://c2r8p5.42lehavre.fr:8443/en/game/custom/${gameData.id}">`;
			onChange(gameMessage);
		}
	};

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
	)
}
