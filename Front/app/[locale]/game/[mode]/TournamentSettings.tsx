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
import {
	QuickMatchSettings,
	QuickMatchSettingsProps,
} from "./QuickMatchSettings";
import { BracketMatch } from "@/types/BracketMatch";

const gameCreationSchema = z.object({
	name: z.string().min(3, "Le nom doit faire au moins 3 caractères").max(30),
	playerCount: z
		.number()
		.min(2)
		.max(8)
		.refine((val) => val % 2 === 0, {
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

interface Participant {
	id: string;
	username: string;
	avatar: string;
	elo: number;
	win: number;
	lose: number;
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
	const [participants, setParticipants] = useState<Participant[]>([]);
	const [showWinnerDialog, setShowWinnerDialog] = useState(false);
	const [tournamentWinner, setTournamentWinner] = useState<string | null>(null);
	const [showCreationDialog, setShowCreationDialog] = useState(false);
	const [joinError, setJoinError] = useState<string | null>(null);
	const [joinSuccess, setJoinSuccess] = useState<string | null>(null);
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(gameCreationSchema),
		defaultValues: {
			name: "",
			playerCount: 4,
		},
	});
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
				parsedBracket.forEach((match: BracketMatch, index: number) => {});

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

	const createBracket = (players: Participant[]) => {
		// Utiliser un ordre déterministe basé sur l'ordre d'arrivée des joueurs
		// plutôt qu'un mélange aléatoire pour éviter les problèmes de cohérence
		const orderedPlayers = [...players];
		const matches: BracketMatch[] = [];
		const totalRounds = Math.ceil(Math.log2(players.length));

		// Premier tour
		for (let i = 0; i < orderedPlayers.length; i += 2) {
			const match = {
				id: `match-${matches.length + 1}`,
				round: 1,
				matchNumber: matches.length + 1,
				player1: orderedPlayers[i],
				player2: orderedPlayers[i + 1] || null,
				status: "pending",
				winner: null,
			};
			matches.push(match);
		}

		// Tours suivants
		let currentCount = matches.length;
		for (let round = 2; round <= totalRounds; round++) {
			const nextCount = Math.ceil(currentCount / 2);
			for (let i = 0; i < nextCount; i++) {
				const match = {
					id: `match-${matches.length + 1}`,
					round,
					matchNumber: i + 1,
					player1: null,
					player2: null,
					status: "pending",
					winner: null,
				};
				matches.push(match);
			}
			currentCount = nextCount;
		}

		return matches;
	};

	const closeTournament = () => {
		setShowWinnerDialog(false);
		setTournamentStarted(false);
		setBracket([]);
		setCurrentMatch(null);
		setParticipants([]);
		localStorage.clear();
		router.push("/");
	};

	const removeParticipant = (participantId: string) => {
		setParticipants((prev) => {
			const updated = prev.filter((p) => p.id !== participantId);
			localStorage.setItem("tournamentParticipants", JSON.stringify(updated));
			return updated;
		});
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-10xl">
			{/* Creation Dialog */}
			<Dialog
				open={showCreationDialog}
				onOpenChange={(open) => {
					if (!open && !localStorage.getItem("tournamentId")) router.push("/");
					else setShowCreationDialog(open);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("game.tournament.create.title")}</DialogTitle>
						<DialogDescription>
							{t("game.tournament.create.description")}
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={form.handleSubmit(createLocalTournament)}
						className="space-y-6"
					>
						<div className="space-y-3">
							<Label htmlFor="gameName">
								{t("game.tournament.create.name")}
							</Label>
							<Input
								id="gameName"
								placeholder={t("game.tournament.create.placeholder")}
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
								<Label>{t("game.tournament.create.playerCount")}</Label>
								<span className="font-bold text-lg">
									{form.watch("playerCount")}
								</span>
							</div>
							<Slider
								defaultValue={[4]}
								min={4}
								max={8}
								step={4}
								onValueChange={(v) => form.setValue("playerCount", v[0])}
								value={[form.watch("playerCount")]}
								className="w-full"
							/>
							<div className="flex justify-between text-xs text-muted-foreground px-2">
								<span>4</span>
								<span>8</span>
							</div>
						</div>
						<Button
							type="submit"
							className="w-full py-6 text-lg"
							disabled={isLoading}
						>
							{isLoading ? (
								<span className="animate-pulse">
									{t("game.tournament.create.loading")}
								</span>
							) : (
								t("game.tournament.create.create")
							)}
						</Button>
					</form>
				</DialogContent>
			</Dialog>

			{/* Join Dialog */}
			<Dialog
				open={showJoinDialog}
				onOpenChange={(open) => setShowJoinDialog(open)}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>{t("game.tournament.create.join")}</DialogTitle>
						<DialogDescription>
							{t("game.tournament.create.joinDescription")}
						</DialogDescription>
					</DialogHeader>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							const fd = new FormData(e.currentTarget);
							const name = (fd.get("username") || "").toString().trim();
							if (name) joinTournament(name);
							e.currentTarget.reset();
						}}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Input
								id="username"
								name="username"
								placeholder={t("game.tournament.create.username")}
								required
								disabled={isLoading}
							/>
							{joinError && <p className="text-sm text-red-500">{joinError}</p>}
							{joinSuccess && (
								<p className="text-sm text-green-600 dark:text-green-400">
									{joinSuccess}
								</p>
							)}
						</div>
						<Button className="w-full" type="submit" disabled={isLoading}>
							{isLoading ? "Connexion..." : t("game.tournament.create.joinBtn")}
						</Button>
					</form>

					<div className="mt-6">
						<h3 className="mb-4 font-semibold text-lg">
							Participants ({participants.length}/
							{localStorage.getItem("tournamentSlot")})
						</h3>
						<div className="space-y-3 max-h-64 overflow-y-auto">
							{participants.map((participant, index) => (
								<div
									key={participant.id}
									className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
								>
									<div className="flex items-center space-x-3">
										<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
											{index + 1}
										</div>
										<img
											src={participant.avatar}
											alt={participant.username}
											className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
										/>
										<div>
											<p className="font-medium text-sm text-primary">
												{participant.username}
											</p>
											<p className="text-xs text-muted-foreground">
												ELO: {participant.elo} | {participant.win}W/
												{participant.lose}L
											</p>
										</div>
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={() => removeParticipant(participant.id)}
										className="text-red-500 hover:text-red-700"
									>
										Retirer
									</Button>
								</div>
							))}
							{participants.length === 0 && (
								<p className="text-center text-muted-foreground py-4">
									Aucun participant pour le moment
								</p>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* QuickMatchSettings */}
			<QuickMatchSettings
				{...props}
				tournamentWinner={tournamentWinner}
				showWinnerDialog={showWinnerDialog}
				setShowWinnerDialog={setShowWinnerDialog}
			/>

			{/* Tournament Bracket Preview */}
			{tournamentStarted && (
				<Card className="mt-6 p-6">
					<h2 className="mb-6 font-semibold text-xl text-center">
						Aperçu du Tournoi
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{bracket.map((match) => (
							<div
								key={match.id}
								className={`p-4 rounded-lg border-2 ${
									match.status === "completed"
										? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
										: match.status === "ongoing"
										? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
										: "bg-muted border-border"
								}`}
							>
								<div className="flex items-center justify-between mb-3">
									<p className="font-semibold text-sm">Round {match.round}</p>
									<p className="text-xs text-muted-foreground">
										Match {match.matchNumber}
									</p>
								</div>
								<div className="space-y-3">
									<div
										className={`flex items-center space-x-3 p-2 rounded ${
											match.winner === match.player1?.username
												? "bg-green-100 dark:bg-green-800/30"
												: ""
										}`}
									>
										{match.player1 ? (
											<>
												<div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-xs font-bold">
													P1
												</div>
												<img
													src={match.player1.avatar}
													alt={match.player1.username}
													className="w-8 h-8 rounded-full object-cover border border-border"
												/>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium truncate">
														{match.player1.username}
													</p>
													<p className="text-xs text-muted-foreground">
														ELO: {match.player1.elo}
													</p>
												</div>
											</>
										) : (
											<div className="flex items-center space-x-3 w-full">
												<div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground">
													P1
												</div>
												<span className="text-sm text-muted-foreground">
													En attente...
												</span>
											</div>
										)}
									</div>
									<div className="flex justify-center">
										<span className="text-xs font-bold text-muted-foreground">
											VS
										</span>
									</div>
									<div
										className={`flex items-center space-x-3 p-2 rounded ${
											match.winner === match.player2?.username
												? "bg-green-100 dark:bg-green-800/30"
												: ""
										}`}
									>
										{match.player2 ? (
											<>
												<div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white text-xs font-bold">
													P2
												</div>
												<img
													src={match.player2.avatar}
													alt={match.player2.username}
													className="w-8 h-8 rounded-full object-cover border border-border"
												/>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium truncate">
														{match.player2.username}
													</p>
													<p className="text-xs text-muted-foreground">
														ELO: {match.player2.elo}
													</p>
												</div>
											</>
										) : (
											<div className="flex items-center space-x-3 w-full">
												<div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground">
													P2
												</div>
												<span className="text-sm text-muted-foreground">
													En attente...
												</span>
											</div>
										)}
									</div>
								</div>
								{match.winner && (
									<div className="mt-3 pt-2 border-t border-border">
										<div className="flex items-center space-x-2">
											<div className="w-4 h-4 rounded-full bg-green-500"></div>
											<p className="text-xs text-green-600 dark:text-green-400 font-medium truncate">
												Vainqueur: {match.winner}
											</p>
										</div>
									</div>
								)}
								{match.status === "ongoing" && (
									<div className="mt-2 pt-2 border-t border-border">
										<p className="text-xs text-blue-600 dark:text-blue-400 font-medium text-center">
											Match en cours
										</p>
									</div>
								)}
							</div>
						))}
					</div>
				</Card>
			)}

			{/* Current Match */}
			{tournamentStarted && currentMatch && (
				<Card className="mt-6 p-6">
					<h2 className="mb-4 font-semibold text-xl text-center">
						Match en cours (Round {currentMatch.round}, Match{" "}
						{currentMatch.matchNumber})
					</h2>
					<div className="flex justify-between items-center space-x-6">
						<div
							className={`flex flex-col items-center w-1/2 p-6 rounded-lg ${
								currentMatch.winner === currentMatch.player1?.username
									? "bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700"
									: "bg-muted border-2 border-border"
							}`}
						>
							{currentMatch.player1 ? (
								<>
									<div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold mb-2">
										P1
									</div>
									<img
										src={currentMatch.player1.avatar}
										alt={currentMatch.player1.username}
										className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-primary/20"
									/>
									<p className="font-medium text-lg text-center">
										{currentMatch.player1.username}
									</p>
									<p className="text-sm text-muted-foreground text-center">
										ELO: {currentMatch.player1.elo} | {currentMatch.player1.win}
										W/{currentMatch.player1.lose}L
									</p>
								</>
							) : (
								<span className="text-muted-foreground">
									{t("game.tournament.create.waiting")}
								</span>
							)}
						</div>

						<div className="flex flex-col items-center">
							<div className="text-3xl font-bold text-primary mb-2">VS</div>
							<div className="text-sm text-muted-foreground">
								Match en cours
							</div>
						</div>

						<div
							className={`flex flex-col items-center w-1/2 p-6 rounded-lg ${
								currentMatch.winner === currentMatch.player2?.username
									? "bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700"
									: "bg-muted border-2 border-border"
							}`}
						>
							{currentMatch.player2 ? (
								<>
									<div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white text-sm font-bold mb-2">
										P2
									</div>
									<img
										src={currentMatch.player2.avatar}
										alt={currentMatch.player2.username}
										className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-primary/20"
									/>
									<p className="font-medium text-lg text-center">
										{currentMatch.player2.username}
									</p>
									<p className="text-sm text-muted-foreground text-center">
										ELO: {currentMatch.player2.elo} | {currentMatch.player2.win}
										W/{currentMatch.player2.lose}L
									</p>
								</>
							) : (
								<span className="text-muted-foreground">
									{t("game.tournament.create.waiting")}
								</span>
							)}
						</div>
					</div>

					<div className="mt-6 flex justify-center">
						<p className="text-sm text-muted-foreground text-center">
							Cliquez sur "Commencer le match" ci-dessus pour jouer ce match
						</p>
					</div>
				</Card>
			)}
		</div>
	);
}
