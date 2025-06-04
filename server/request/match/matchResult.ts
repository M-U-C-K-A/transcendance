import { PrismaClient } from '@prisma/client'
import { resultData } from './interface'

const Prisma = new PrismaClient()

export default async function matchResult(matchData: resultData) {
	const matchResult = await Prisma.match.update ({
		where: {
			id: matchData.matchId,
		},
		data: {
			winnerId: matchData.winnerId,
			p1Score: matchData.p1Score,
			p2Score: matchData.p2Score,
			p1EloGain: matchData.p1EloGain,
			p2EloGain: matchData.p2EloGain,
		}
	});

	return (matchResult)
}
