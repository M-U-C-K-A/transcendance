export interface BracketMatch {
	id: string;
	round: number;
	matchNumber: number;
	player1: {
		id: string;
		username: string;
		elo: number;
		win: number;
		lose: number;
	} | null;
	player2: {
		id: string;
		username: string;
		elo: number;
		win: number;
		lose: number;
	} | null;
	winner?: string;
	status: "pending" | "ongoing" | "completed";
}
