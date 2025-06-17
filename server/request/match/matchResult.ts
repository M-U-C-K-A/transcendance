import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function matchResult(p1Score: number, p2Score: number, gameId: number, userId: number) {
	if (gameId == -1) {
		const userInfo = await Prisma.user.findFirst({
			where: {
				id: userId,
			},
			select: {
				elo: true,
			},
		});

		if (!userInfo) {
			throw new Error("User not found");
		}

		let winnerId: number;
		if (p1Score > p2Score) {
			winnerId = userId;
		} else {
			winnerId = 1;
		}

		await Prisma.match.create({
			data: {
				name: "Partie Privee",
				p1Id: userId,
				p2Id: 1,
				p1Elo: userInfo.elo,
				p2Elo: 2500,
				p1Score: p1Score,
				p2Score: p2Score,
				p1EloGain: 0,
				p2EloGain: 0,
				winnerId: winnerId,
			},
		});

		if (winnerId == userId) {
			await Prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					pointScored: +p1Score,
					pointConcede: +p2Score,
					win: +1,
				}
			});
		} else {
			await Prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					pointScored: +p1Score,
					pointConcede: +p2Score,
					lose: +1,
				}
			});
		}
	}
	else {

		let winnerId: number;
		if (p1Score > p2Score) {
			winnerId = userId;
		} else {
			winnerId = 1;
		}

		await Prisma.match.update({
			where: {
				id: gameId,
			},
			data: {
				winnerId: winnerId,
				p1Score: p1Score,
				p2Score: p2Score,
				p1EloGain: 0,
				p2EloGain: 0,
			},
		});
	}

	return (true);
}
