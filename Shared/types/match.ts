import { z } from "zod";

//	the path of where the schema are used is specified above it

// /game/custom
export const matchName = z.object({
	name: z.string()
	.min(1, { message: "Match name can't be empty" })
	.max(30, { message: 'Match name too long' }),
})

// /game/travel
export const matchCode = z.object({
	code: z.string()
	.min(1, { message: "Code can't be empty"})
	.max(50, { message: 'Code too long'}),
})

// /game/result
export const matchResultData = z.object({
	player1Score: z.number(),
	player2Score: z.number(),
	gameId: z.string()
	.min(1, { message: "gameId can't be empty"})
	.max(50, { message: 'gameId too long'}),
})

// /game/start
export const matchIdOnly = z.object({
	matchId: z.string()
	.min(8, { message: "gameId too short" })
	.max(8, { message: "gameId too long" })
})
