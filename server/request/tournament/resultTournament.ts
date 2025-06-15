import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function resultTournament(winnerName: string, tournamentId: number) {
	const userId = await Prisma.user.findFirst({
		where: {
			username: winnerName,
		},
		select: {
			id: true,
		},
	});

	if (!userId) {
		throw new Error('User not found')
	}

	await Prisma.user.update({
		where: {
			id: userId.id,
		},
		data: {
			tournamentWon: +1,
		},
	});

	await Prisma.tournament.update({
		where: {
			id: tournamentId,
		},
		data: {
			winnerId: userId.id
		},
	});

	return (true)
}
