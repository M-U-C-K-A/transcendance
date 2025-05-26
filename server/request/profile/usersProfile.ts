import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function getuser(username: string) {
	const user = await Prisma.user.findUnique({
		where: {
			username: username
		},
		select: {
			id: true,
			username: true,
			elo: true,
			avatar: true,
			bio: true,
			onlineStatus: true,
			win: true,
			lose: true,
			tournamentWon: true,
			pointScored: true,
			pointConcede: true,
		},
	});

	if (!user) {
		console.log(`Failed to get ${username} info`)
		throw new Error(`Failed to get ${username} info`)
	}

	const gameNumber = user.win + user.lose
	let winRate: number;
	if (gameNumber > 0) {
		winRate = (1.0 * user.win) / gameNumber
	} else {
		winRate = 0
	}

	const achievements = await Prisma.achievement.findUnique({
		where: {
			id: user.id,
		},
	});

	const matchHistory = await Prisma.match.findMany({
		where: {
			OR: [
				{ p1Id: user.id },
				{ p2Id: user.id },
			],
		},
	});
	console.log(achievements)
	return {user, gameNumber, winRate, achievements, matchHistory}
}
