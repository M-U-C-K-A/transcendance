"use client";

import { Card } from "@/components/ui/card";
import { BracketMatch } from "@/types/BracketMatch";
import { useI18n } from "@/i18n-client";

interface TournamentCurrentMatchProps {
	currentMatch: BracketMatch;
}

export function TournamentCurrentMatch({
	currentMatch,
}: TournamentCurrentMatchProps) {
	const t = useI18n();

	return (
		<Card className="mt-6 p-6">
			<h2 className="mb-4 font-semibold text-xl text-center">
				Match en cours (Round {currentMatch.round}, Match{" "}
				{currentMatch.matchNumber})
			</h2>
			<div className="flex justify-between items-center space-x-6">
				<div
					className={`flex flex-col items-center w-1/2 p-6 rounded-lg ${currentMatch.winner === currentMatch.player1?.username
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
					<div className="text-sm text-muted-foreground">Match en cours</div>
				</div>

				<div
					className={`flex flex-col items-center w-1/2 p-6 rounded-lg ${currentMatch.winner === currentMatch.player2?.username
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
	);
}
