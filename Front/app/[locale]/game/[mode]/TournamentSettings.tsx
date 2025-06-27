"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n-client";
import { TournamentCreationDialog } from "./tournament/TournamentCreationDialog";
import { TournamentJoinDialog } from "./tournament/TournamentJoinDialog";
import { TournamentBracket } from "./tournament/TournamentBracket";
import { TournamentCurrentMatch } from "./tournament/TournamentCurrentMatch";
import { QuickMatchSettings } from "./QuickMatchSettings";
import { BracketMatch } from "@/types/BracketMatch";
import { Participant } from "./tournament/tournamentUtils";
import { createBracket } from "./tournament/tournamentUtils";

interface TournamentSettingsProps {
	bracket: BracketMatch[];
	setBracket: React.Dispatch<React.SetStateAction<BracketMatch[]>>;
	currentMatch: BracketMatch | null;
	setCurrentMatch: React.Dispatch<React.SetStateAction<BracketMatch | null>>;
	currentMatchIndex: number;
	setCurrentMatchIndex: React.Dispatch<React.SetStateAction<number>>;
	tournamentStarted: boolean;
	setTournamentStarted: React.Dispatch<React.SetStateAction<boolean>>;
	updateBracketAfterMatch: (matchId: string, winner: string) => void;
	tournamentWinner: string | null;
	showWinnerDialog: boolean;
	setShowWinnerDialog: React.Dispatch<React.SetStateAction<boolean>>;
	locale: string;
}

export default function TournamentSettings({
	bracket,
	setBracket,
	currentMatch,
	setCurrentMatch,
	currentMatchIndex,
	setCurrentMatchIndex,
	tournamentStarted,
	setTournamentStarted,
	updateBracketAfterMatch,
	tournamentWinner,
	showWinnerDialog,
	setShowWinnerDialog,
	...props
}: TournamentSettingsProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [showJoinDialog, setShowJoinDialog] = useState(false);
	const [showCreationDialog, setShowCreationDialog] = useState(false);
	const [participants, setParticipants] = useState<Participant[]>([]);
	const [joinError, setJoinError] = useState<string | null>(null);
	const [joinSuccess, setJoinSuccess] = useState<string | null>(null);
	const [tournamentWin, setTournamentWinner] = useState<string | null>(null);
	const router = useRouter();
	const t = useI18n();

	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			!localStorage.getItem("tournamentId")
		) {
			setShowCreationDialog(true);
		}
	}, []);

	// Initialize bracket and participants from storage
	useEffect(() => {
		const storedBracket = localStorage.getItem("tournamentBracket");
		const storedParticipants = localStorage.getItem("tournamentParticipants");

		if (storedParticipants) {
			setParticipants(JSON.parse(storedParticipants));
		}

		if (storedBracket) {
			const parsedBracket = JSON.parse(storedBracket);

			// Vérifier que le bracket est valide
			if (Array.isArray(parsedBracket) && parsedBracket.length > 0) {
				const updatedBracket = parsedBracket.map((match: BracketMatch) => {
					if (match.status === "ongoing" && !match.winner) {
						return { ...match, status: "pending" };
					}
					return match;
				});
				setBracket(updatedBracket);

				// Trouver le prochain match à jouer
				const nextMatch = updatedBracket.find(
					(m: BracketMatch) => m.status === "pending" && m.player1 && m.player2
				);
				if (nextMatch) {
					setCurrentMatch(nextMatch);
					setCurrentMatchIndex(
						updatedBracket.findIndex((m: BracketMatch) => m.id === nextMatch.id)
					);
					setTournamentStarted(true);
				}
			} else {
				localStorage.removeItem("tournamentBracket");
			}
		}
	}, [setBracket, setCurrentMatch, setCurrentMatchIndex, setTournamentStarted]);

	// Détecter les changements dans le bracket et mettre à jour le match en cours
	useEffect(() => {
		if (bracket.length > 0) {
			// Trouver le prochain match à jouer
			const nextMatch = bracket.find(
				(m: BracketMatch) => m.status === "pending" && m.player1 && m.player2
			);
			if (nextMatch && (!currentMatch || currentMatch.id !== nextMatch.id)) {
				setCurrentMatch(nextMatch);
				setCurrentMatchIndex(
					bracket.findIndex((m: BracketMatch) => m.id === nextMatch.id)
				);
			}
		}
	}, [bracket, currentMatch, setCurrentMatch, setCurrentMatchIndex]);

	useEffect(() => {
		if (bracket.length > 0) {
			localStorage.setItem("tournamentBracket", JSON.stringify(bracket));
		}
	}, [bracket]);

	// Détecter quand le tournoi est terminé
	useEffect(() => {
		if (tournamentStarted && bracket.length > 0) {
			// Vérifier si tous les matchs sont terminés
			const allMatchesCompleted = bracket.every(
				(match) => match.status === "completed"
			);
			const finalMatch = bracket[bracket.length - 1];

			if (allMatchesCompleted && finalMatch && finalMatch.winner) {
				setTournamentWinner(finalMatch.winner);
			}
		}
	}, [bracket, tournamentStarted]);

	const createLocalTournament = (data: any) => {
		setIsLoading(true);
		const tournamentId = `local-tournament-${Date.now()}`;
		localStorage.setItem("tournamentId", tournamentId);
		localStorage.setItem("tournamentSlot", data.playerCount.toString());

		setParticipants([]);
		localStorage.setItem("tournamentParticipants", JSON.stringify([]));
		setShowCreationDialog(false);
		setShowJoinDialog(true);
		setIsLoading(false);
	};

	const joinTournament = async (username: string) => {
		setIsLoading(true);
		setJoinError(null);
		setJoinSuccess(null);

		try {
			// Vérifier si l'utilisateur est déjà dans le tournoi
			const isAlreadyParticipant = participants.some(
				(p) => p.username.toLowerCase() === username.toLowerCase()
			);
			if (isAlreadyParticipant) {
				throw new Error("Ce joueur est déjà dans le tournoi");
			}

			const response = await fetch("/api/tournament/join", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username }),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData.message || "Erreur lors de la connexion au tournoi"
				);
			}

			const user = await response.json();

			// Vérifier à nouveau si l'utilisateur n'a pas été ajouté entre temps
			const isAlreadyParticipantAfterAPI = participants.some(
				(p) => p.username.toLowerCase() === user.username.toLowerCase()
			);
			if (isAlreadyParticipantAfterAPI) {
				throw new Error("Ce joueur est déjà dans le tournoi");
			}

			// Convert base64 avatar to webp
			const avatarSrc = `data:image/webp;base64,${user.avatar}`;

			setParticipants((prev) => {
				const updated = [
					...prev,
					{
						id: user.id,
						username: user.username,
						avatar: avatarSrc,
						elo: user.elo,
						win: user.win,
						lose: user.lose,
					},
				];
				localStorage.setItem("tournamentParticipants", JSON.stringify(updated));
				return updated;
			});

			setJoinSuccess(`Joueur ${user.username} ajouté au tournoi avec succès!`);

			// Nettoyer le message de succès après 3 secondes
			setTimeout(() => setJoinSuccess(null), 3000);
		} catch (error) {
			setJoinError(error instanceof Error ? error.message : "Erreur inconnue");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const tournamentSlot = Number(
			localStorage.getItem("tournamentSlot") || "0"
		);
		const existingBracket = localStorage.getItem("tournamentBracket");

		// Ne créer le bracket que si on a assez de participants ET qu'il n'existe pas déjà
		if (
			participants.length >= tournamentSlot &&
			tournamentSlot > 0 &&
			!existingBracket
		) {
			const matches = createBracket(participants);
			setBracket(matches);
			setCurrentMatch(matches[0]);
			setCurrentMatchIndex(0);
			setShowJoinDialog(false);
			setTournamentStarted(true);
			localStorage.setItem("tournamentBracket", JSON.stringify(matches));
		} else if (
			participants.length >= tournamentSlot &&
			tournamentSlot > 0 &&
			existingBracket
		) {
			// Si le bracket existe déjà, on ferme juste le dialog de connexion
			setShowJoinDialog(false);
			setTournamentStarted(true);
		}
	}, [participants]);

	const removeParticipant = (participantId: string) => {
		setParticipants((prev) => {
			const updated = prev.filter((p) => p.id !== participantId);
			localStorage.setItem("tournamentParticipants", JSON.stringify(updated));
			return updated;
		});
	};

	const tournamentSlot = Number(
		localStorage.getItem("tournamentSlot") || "0"
	);

	const closeTournament = () => {
		setShowWinnerDialog(false);
		setTournamentStarted(false);
		setBracket([]);
		setCurrentMatch(null);
		setParticipants([]);
		localStorage.clear();
		router.push("/");
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-10xl">
			<TournamentCreationDialog
				open={showCreationDialog}
				onOpenChange={(open) => {
					if (!open && !localStorage.getItem("tournamentId")) router.push("/");
					else setShowCreationDialog(open);
				}}
				onCreate={createLocalTournament}
				isLoading={isLoading}
			/>

			<TournamentJoinDialog
				open={showJoinDialog}
				onOpenChange={setShowJoinDialog}
				onJoin={joinTournament}
				isLoading={isLoading}
				participants={participants}
				onRemoveParticipant={removeParticipant}
				tournamentSlot={tournamentSlot}
				joinError={joinError}
				joinSuccess={joinSuccess}
			/>

			<QuickMatchSettings
				{...props}
				tournamentWinner={tournamentWin}
				showWinnerDialog={showWinnerDialog}
				setShowWinnerDialog={setShowWinnerDialog}
				closeTournament={closeTournament}
			/>

			{tournamentStarted && <TournamentBracket bracket={bracket} />}

			{tournamentStarted && currentMatch && (
				<TournamentCurrentMatch currentMatch={currentMatch} />
			)}
		</div>
	);
}
