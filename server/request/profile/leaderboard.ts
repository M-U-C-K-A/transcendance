import { PrismaClient } from '@prisma/client'
import { userData } from './interface'

const Prisma = new PrismaClient()

export default async function leaderboard() {
	const leaderboard = await Prisma.$queryRaw<userData[]>`
	SELECT * FROM "User"
	ORDER BY "elo" DESC`

	if (!leaderboard[0]) {
		throw new Error(`Failed to get leaderboard`)
	}

	return {leaderboard}
}
