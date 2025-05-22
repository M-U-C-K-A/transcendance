export interface userData{
	id: number;
	username: string;
	elo: number;
	avatar: string;
	bio: string;
	win: number;
	lose: number;
	gameNumber: number;
	winRate: number;
	tournamentWon: number;
	pointScored: number;
	pointConcede: number;
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
