import { BracketMatch } from "@/types/BracketMatch";

export interface Participant {
  id: string;
  username: string;
  avatar: string;
  elo: number;
  win: number;
  lose: number;
}

export function createBracket(players: Participant[]): BracketMatch[] {
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
}
