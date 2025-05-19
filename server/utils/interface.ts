import {z} from 'zod'

export interface userData{
	id: number;
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

export interface matchHistory{
	Id: number;
	p1Id: number;
	p2Id: number;
	p1Elo: number;
	p2Elo: number;
	winnerId: number;
	p1Score: number;
	p2Score: number;
	p1EloGain: number;
	p2EloGain: number;
	mDate: Date;
	matchType: string;
}

export interface friendTab{
	Id1: number;
	Id2: number;
}

export interface friendList{
	Id: number;
	onlineStatus: Boolean;
	avatar: string;
}

export interface connectionData{
	username: string;
	password: string;
	email: string;
}

export const connectionSchema = z.object({
	username: z.string().min(3, {message : "Username must be 3 or more characters long"}).max(16, {message :"Username must be 16 or less characters long"}).optional(),
	password: z.string().min(12, {message: "Password must be 12 or more characters"}),
	email: z.string().email({message: "Invalid Email"}),
})

export interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  content: string;
  readStatus: boolean;
  status: boolean;
  messageType: number;
  dateCreated: Date;
}
