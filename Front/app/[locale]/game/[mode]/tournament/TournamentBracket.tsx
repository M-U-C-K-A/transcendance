"use client";

import { Card } from "@/components/ui/card";
import { BracketMatch } from "@/types/BracketMatch";

interface TournamentBracketProps {
	bracket: BracketMatch[];
}

export function TournamentBracket({ bracket }: TournamentBracketProps) {
	return (
		<Card className="mt-6 p-6">
			<h2 className="mb-6 font-semibold text-xl text-center">
				Aperçu du Tournoi
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{bracket.map((match) => (
					<div
						key={match.id}
						className={`p-4 rounded-lg border-2 ${match.status === "completed"
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
								className={`flex items-center space-x-3 p-2 rounded ${match.winner === match.player1?.username
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
								className={`flex items-center space-x-3 p-2 rounded ${match.winner === match.player2?.username
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
	);
}
