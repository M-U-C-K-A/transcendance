import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function getuser(username: string) {
	const userInfo = await Prisma.user.findUnique({
		where: {
			username: username
		},
		select: {
			id: true,
			username: true,
			elo: true,
			bio: true,
			onlineStatus: true,
			win: true,
			lose: true,
			tournamentWon: true,
			pointScored: true,
			pointConcede: true,
		},
	});

	if (!userInfo) {
		console.log(`Failed to get ${username} info`)
		throw new Error(`Failed to get ${username} info`)
	}

	const gameNumber = userInfo.win + userInfo.lose
	let winRate: number;
	if (gameNumber > 0) {
		winRate = (1.0 * userInfo.win) / gameNumber
	} else {
		winRate = 0
	}

	const achievements = await Prisma.achievement.findUnique({
		where: {
			id: userInfo.id,
		},
	});

	const matchHistory = await Prisma.match.findMany({
	where: {
		OR: [
		{ p1Id: userInfo.id },
		{ p2Id: userInfo.id },
		],
		winnerId: {
			not: null
		}
	},
	});
	return {userInfo, gameNumber, winRate, achievements, matchHistory}
}
