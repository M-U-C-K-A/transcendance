import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function startMatch(matchId: number) {
	const match = await Prisma.match.findFirst({
		where: {
			id: matchId
		},
		select: {
			p1Id: true,
			p2Id: true,
		},
	});

	if (!match?.p1Id || !match.p2Id) {
		throw new Error ('Match not full')
	}

	return (true);
}
