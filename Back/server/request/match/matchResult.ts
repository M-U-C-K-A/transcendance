import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function matchResult(p1Score: number, p2Score: number, gameId: number, userId: number) {
	const user = await Prisma.match.findFirst({
		where: {
			id: gameId,
		},
		select: {
			p2Id: true,
			p1Elo: true,
			p2Elo: true,
		},
	});

	if (!user?.p2Id) {
		throw new Error ('Player not found')
	}

	let winnerId: number
	let p1EloGain: number
	let p2EloGain: number
	if (p1Score > p2Score) {
		winnerId = userId
		p1EloGain = 20
		p2EloGain = -20
	} else {
		winnerId = user.p2Id
		p1EloGain = -20
		p2EloGain = 20
	}

	if (winnerId === userId) {
		await Prisma.user.update({
			where: { id: userId },
			data: {
				pointScored: { increment: p1Score },
				pointConcede: { increment: p2Score },
				elo: { increment: p1EloGain },
				win: { increment: 1 },
			},
		});

		await Prisma.user.update({
			where: { id: user.p2Id },
			data: {
				pointScored: { increment: p2Score },
				pointConcede: { increment: p1Score },
				elo: { increment: p2EloGain },
				lose: { increment: 1 },
			},
		});
	} else {
		await Prisma.user.update({
			where: { id: userId },
			data: {
				pointScored: { increment: p1Score },
				pointConcede: { increment: p2Score },
				elo: { increment: p1EloGain },
				lose: { increment: 1 },
			},
		});

		await Prisma.user.update({
			where: { id: user.p2Id },
			data: {
				pointScored: { increment: p2Score },
				pointConcede: { increment: p1Score },
				elo: { increment: p2EloGain },
				win: { increment: 1 },
			},
		});
	}


	await Prisma.match.update({
		where: {
			id: gameId,
		},
		data: {
			winnerId: winnerId,
			p1Score: p1Score,
			p2Score: p2Score,
			p1EloGain: p1EloGain,
			p2EloGain: p2EloGain,
		},
	});

	return (true);
}
