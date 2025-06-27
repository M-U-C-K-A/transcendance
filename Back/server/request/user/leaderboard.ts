import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function leaderboard() {
	const leaderboard = await Prisma.user.findMany({
		select: {
			id: true,
			username: true,
			avatar: true,
			win: true,
			lose: true,
			elo: true,
			pointScored: true,
			pointConcede: true,
		},
		orderBy: { elo: 'asc' },
	});

	if (!leaderboard) {
		throw new Error(`Failed to get leaderboard`)
	}

	return (leaderboard)
}
