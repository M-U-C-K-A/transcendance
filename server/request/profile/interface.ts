export interface userData{
	id: number
	username: string;
	elo: number;
	avatar: string;
	bio: string;
	win: number;
	lose: number;
	tournamentWon: number;
	pointScored: number;
	pointConcede: number;
}

export interface User {
	id: number
	email: number
	username: string
	bio?: string
	onlineStatus: boolean
	elo: number
	win: number
	lose: number
	tournamentWon: number
}

export interface AchievementsData {
	beginner: boolean;
	humiliation: boolean;
	shamefullLose: boolean;
	rivality: boolean;
	fairPlay: boolean;
	lastSecond: boolean;
	comeback: boolean;
	longGame: boolean;
	winTournament: boolean;
	friendly: boolean;
	rank1: boolean;
	looser: boolean;
	winner: boolean;
	scorer: boolean;
	emoji: boolean;
	rage: boolean;
}

export interface editProfileInfo{
	username: string,
	newAlias: string,
	newBio: string,
	newAvatar: string,
}

export interface friendIds{
	id1: number;
	id2: number;
}
