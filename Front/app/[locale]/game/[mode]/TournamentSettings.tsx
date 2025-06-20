"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n-client";
import { QuickMatchSettings, QuickMatchSettingsProps } from "./QuickMatchSettings";
import { BracketMatch } from "@/types/BracketMatch";

const gameCreationSchema = z.object({
	name: z.string().min(3, "Le nom doit faire au moins 3 caractères").max(30),
	playerCount: z.number().min(2).max(8).refine(val => val % 2 === 0, {
		message: "Le nombre de joueurs doit être un multiple de 2",
	}),
});

interface TournamentSettingsProps extends QuickMatchSettingsProps {
	bracket: BracketMatch[];
	setBracket: Dispatch<SetStateAction<BracketMatch[]>>;
	currentMatch: BracketMatch | null;
	setCurrentMatch: Dispatch<SetStateAction<BracketMatch | null>>;
	currentMatchIndex: number;
	setCurrentMatchIndex: Dispatch<SetStateAction<number>>;
	tournamentStarted: boolean;
	setTournamentStarted: Dispatch<SetStateAction<boolean>>;
	updateBracketAfterMatch: (matchId: string, winner: string) => void;
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
	...props
}: TournamentSettingsProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [showJoinDialog, setShowJoinDialog] = useState(false);
	const [participants, setParticipants] = useState<Array<{
		id: string;
		username: string;
		elo: number;
		win: number;
		lose: number;
	}>>([]);
	const [showWinnerDialog, setShowWinnerDialog] = useState(false);
	const [tournamentWinner, setTournamentWinner] = useState<string | null>(null);
	const [showCreationDialog, setShowCreationDialog] = useState(false);
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(gameCreationSchema),
		defaultValues: {
			name: "",
			playerCount: 4,
		},
	});
	const t = useI18n();

	// Vérifier si nous devons afficher la popup de création
	useEffect(() => {
		if (typeof window !== "undefined" && !localStorage.getItem("tournamentId")) {
			setShowCreationDialog(true);
		}
	}, []);

	// Initialiser le tournoi depuis le localStorage
	useEffect(() => {
		const storedBracket = localStorage.getItem("tournamentBracket");
		const storedParticipants = localStorage.getItem("tournamentParticipants");

		if (storedParticipants) {
			setParticipants(JSON.parse(storedParticipants));
		}

		if (storedBracket) {
			const parsedBracket = JSON.parse(storedBracket);

			// Réinitialiser les matchs en cours sans gagnant
			const updatedBracket = parsedBracket.map((match: BracketMatch) => {
				if (match.status === "ongoing" && !match.winner) {
					return { ...match, status: "pending" };
				}
				return match;
			});

			setBracket(updatedBracket);

			// Trouver le prochain match à jouer
			const nextMatch = updatedBracket.find((match: BracketMatch) =>
				match.status === "pending" && match.player1 && match.player2
			);

			if (nextMatch) {
				const nextMatchIndex = updatedBracket.findIndex((m: BracketMatch) => m.id === nextMatch.id);
				setCurrentMatch(nextMatch);
				setCurrentMatchIndex(nextMatchIndex);
				setTournamentStarted(true);
			}
		}
	}, [setBracket, setCurrentMatch, setCurrentMatchIndex, setTournamentStarted]);

	// Sauvegarder le bracket dans localStorage quand il change
	useEffect(() => {
		if (bracket.length > 0) {
			localStorage.setItem("tournamentBracket", JSON.stringify(bracket));
		}
	}, [bracket]);

	// Créer un tournoi local
	const createLocalTournament = (data: any) => {
		setIsLoading(true);
		const tournamentId = `local-tournament-${Date.now()}`;
		localStorage.setItem("tournamentId", tournamentId);
		localStorage.setItem("tournamentSlot", data.playerCount.toString());

		const hostParticipant = {
			id: `user-${Date.now()}`,
			username: data.name || "Host Player",
			elo: Math.floor(Math.random() * 500) + 800,
			win: 0,
			lose: 0
		};

		localStorage.setItem("tournamentParticipants", JSON.stringify([hostParticipant]));
		setParticipants([hostParticipant]);
		setShowCreationDialog(false);
		setShowJoinDialog(true);
		setIsLoading(false);
	};

	// Rejoindre un tournoi
	const joinLocalTournament = (username: string) => {
		const newParticipant = {
			id: `user-${Date.now()}`,
			username,
			elo: Math.floor(Math.random() * 500) + 800,
			win: 0,
			lose: 0
		};

		setParticipants(prev => {
			const newParticipants = [...prev, newParticipant];
			localStorage.setItem("tournamentParticipants", JSON.stringify(newParticipants));
			return newParticipants;
		});
	};

	// Démarrer le tournoi quand tous les joueurs sont prêts
	useEffect(() => {
		const tournamentSlot = Number(localStorage.getItem("tournamentSlot") || "0");
		if (participants.length >= tournamentSlot && tournamentSlot > 0) {
			const matches = createBracket(participants);
			setBracket(matches);
			setCurrentMatch(matches[0]);
			setCurrentMatchIndex(0);
			setShowJoinDialog(false);
			setTournamentStarted(true);
			localStorage.setItem("tournamentBracket", JSON.stringify(matches));
		}
	}, [participants, setBracket, setCurrentMatch, setCurrentMatchIndex, setTournamentStarted]);

	// Créer le bracket
	const createBracket = (players: any[]) => {
		const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
		const matches: BracketMatch[] = [];
		const totalRounds = Math.ceil(Math.log2(players.length));

		// Créer les matchs du premier tour
		for (let i = 0; i < players.length; i += 2) {
			if (i + 1 < players.length) {
				matches.push({
					id: `match-${matches.length + 1}`,
					round: 1,
					matchNumber: matches.length + 1,
					player1: shuffledPlayers[i],
					player2: shuffledPlayers[i + 1],
					status: "pending",
					winner: null
				});
			}
		}

		// Créer les matchs suivants
		let currentRoundMatches = matches.length;
		for (let round = 2; round <= totalRounds; round++) {
			const matchesInRound = Math.ceil(currentRoundMatches / 2);
			for (let i = 0; i < matchesInRound; i++) {
				matches.push({
					id: `match-${matches.length + 1}`,
					round,
					matchNumber: i + 1,
					player1: null,
					player2: null,
					status: "pending",
					winner: null
				});
			}
			currentRoundMatches = matchesInRound;
		}

		return matches;
	};

	// Fonction pour simuler la fin d'un match
	const simulateMatchEnd = () => {
		if (!currentMatch) return;

		// Choisir un gagnant aléatoire
		const winner = Math.random() > 0.5
			? currentMatch.player1?.username
			: currentMatch.player2?.username;

		if (winner) {
			updateBracketAfterMatch(currentMatch.id, winner);

			// Vérifier si c'est le dernier match
			const nextMatch = bracket.find(match =>
				match.status === "pending" && match.player1 && match.player2
			);

			if (!nextMatch) {
				// Trouver le match final
				const finalMatch = bracket[bracket.length - 1];
				if (finalMatch.winner) {
					setTournamentWinner(finalMatch.winner);
					setShowWinnerDialog(true);
				}
			}
		}
	};

	// Fermer le tournoi et nettoyer
	const closeTournament = () => {
		setShowWinnerDialog(false);
		setTournamentStarted(false);
		setBracket([]);
		setCurrentMatch(null);
		setParticipants([]);
		localStorage.removeItem("tournamentId");
		localStorage.removeItem("tournamentParticipants");
		localStorage.removeItem("tournamentBracket");
		localStorage.removeItem("tournamentSlot");
		router.push("/");
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-10xl">
			{/* Popup de création de tournoi */}
			<Dialog
				open={showCreationDialog}
				onOpenChange={(open) => {
					if (!open && typeof window !== 'undefined' && !localStorage.getItem("tournamentId")) {
						router.push("/");
					} else {
						setShowCreationDialog(open);
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t('game.tournament.create.title')}</DialogTitle>
						<DialogDescription>
							{t('game.tournament.create.description')}
						</DialogDescription>
					</DialogHeader>

					<form
						onSubmit={form.handleSubmit(createLocalTournament)}
						className="space-y-6"
					>
						<div className="space-y-3">
							<Label htmlFor="gameName">{t('game.tournament.create.name')}</Label>
							<Input
								id="gameName"
								placeholder={t('game.tournament.create.placeholder')}
								{...form.register("name")}
								disabled={isLoading}
							/>
							{form.formState.errors.name && (
								<p className="text-sm text-red-500">
									{form.formState.errors.name.message}
								</p>
							)}
						</div>

						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<Label>{t('game.tournament.create.playerCount')}</Label>
								<span className="font-bold text-lg">
									{form.watch("playerCount")}
								</span>
							</div>
							<Slider
								defaultValue={[4]}
								min={4}
								max={8}
								step={4}
								onValueChange={(value) => form.setValue("playerCount", value[0])}
								value={[form.watch("playerCount")]}
								className="w-full"
							/>
							<div className="flex justify-between text-xs text-muted-foreground px-2">
								{[4, 8].map(num => (
									<span key={num}>{num}</span>
								))}
							</div>
						</div>

						<Button
							type="submit"
							className="w-full py-6 text-lg"
							disabled={isLoading}
						>
							{isLoading ? (
								<span className="animate-pulse">{t('game.tournament.create.loading')}</span>
							) : (
								t('game.tournament.create.create')
							)}
						</Button>
					</form>
				</DialogContent>
			</Dialog>

			{/* Popup de join */}
			<Dialog
				open={showJoinDialog}
				onOpenChange={(open) => {
					if (!open && participants.length < Number(localStorage.getItem("tournamentSlot") || "0")) {
						return;
					}
					setShowJoinDialog(open);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t('game.tournament.create.join')}</DialogTitle>
						<DialogDescription>
							{t('game.tournament.create.joinDescription')}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={(e) => {
						e.preventDefault();
						const formData = new FormData(e.target as HTMLFormElement);
						const username = formData.get("username") as string;
						if (username.trim()) {
							joinLocalTournament(username.trim());
							(e.target as HTMLFormElement).reset();
						}
					}}>
						<Input
							id="username"
							name="username"
							placeholder={t('game.tournament.create.username')}
							required
						/>
						<Button className="w-full mt-4" type="submit">
							{t('game.tournament.create.joinBtn')}
						</Button>
					</form>

					<div className="mt-6">
						<h3 className="mb-2 font-semibold">{t('game.tournament.create.players')} ({participants.length}/{localStorage.getItem("tournamentSlot")})</h3>
						<ul className="space-y-2">
							{participants.map((player) => (
								<li key={player.id} className="flex justify-between items-center p-2 bg-muted rounded">
									<span>{player.username}</span>
									<span className="text-sm text-muted-foreground">ELO: {player.elo}</span>
								</li>
							))}
						</ul>
					</div>
				</DialogContent>
			</Dialog>

			{/* Popup du gagnant */}
			<Dialog open={showWinnerDialog} onOpenChange={setShowWinnerDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t('game.tournament.winner.title')}</DialogTitle>
						<DialogDescription>
							{t('game.tournament.winner.congratulations')}
						</DialogDescription>
					</DialogHeader>
					<div className="text-center py-4">
						<div className="text-2xl font-bold text-primary mb-2">{tournamentWinner}</div>
						<p className="text-muted-foreground">{t('game.tournament.winner.champion')}</p>
					</div>
					<Button onClick={closeTournament} className="w-full mt-6">
						{t('game.tournament.winner.close')}
					</Button>
				</DialogContent>
			</Dialog>

			{/* Affichage du tournoi */}
			{tournamentStarted && currentMatch && (
				<Card className="mb-6 p-6">
					<h2 className="mb-4 font-semibold text-xl">
						{t('game.tournament.currentMatch')} (Round {currentMatch.round}, Match {currentMatch.matchNumber})
					</h2>
					<div className="flex justify-between space-x-4">
						<div className={`flex flex-col items-center w-1/2 p-4 rounded-lg ${currentMatch.winner === currentMatch.player1?.username ? "bg-green-100 dark:bg-green-900" : "bg-muted"}`}>
							{currentMatch.player1 ? (
								<div className="text-center">
									<p className="font-medium text-lg">{currentMatch.player1.username}</p>
									<p className="text-sm text-muted-foreground">
										ELO: {currentMatch.player1.elo} | {currentMatch.player1.win}W/{currentMatch.player1.lose}L
									</p>
								</div>
							) : (
								<span className="text-muted-foreground">{t('game.tournament.create.waiting')}</span>
							)}
						</div>
						<div className="flex items-center justify-center text-xl font-bold">VS</div>
						<div className={`flex flex-col items-center w-1/2 p-4 rounded-lg ${currentMatch.winner === currentMatch.player2?.username ? "bg-green-100 dark:bg-green-900" : "bg-muted"}`}>
							{currentMatch.player2 ? (
								<div className="text-center">
									<p className="font-medium text-lg">{currentMatch.player2.username}</p>
									<p className="text-sm text-muted-foreground">
										ELO: {currentMatch.player2.elo} | {currentMatch.player2.win}W/{currentMatch.player2.lose}L
									</p>
								</div>
							) : (
								<span className="text-muted-foreground">{t('game.tournament.create.waiting')}</span>
							)}
						</div>
					</div>
					<Button onClick={simulateMatchEnd} className="mt-6 w-full" disabled={currentMatch.status !== "pending"}>
						{currentMatch.status === "ongoing" ? t('game.tournament.matchInProgress') : t('game.tournament.simulateMatch')}
					</Button>
				</Card>
			)}

			{/* QuickMatchSettings */}
			<QuickMatchSettings {...props} />
		</div>
	);
}
