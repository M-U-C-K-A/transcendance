import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function getuser(profileId: number, userId: number) {

	const userInfo = await Prisma.user.findFirst({
		where: {
			id: profileId
		},
		select: {
			id: true,
			avatar: true,
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
		throw new Error("Failed to get profile data")
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

	const isBlocked = await Prisma.block.findFirst({
		where: {
			id1: userId,
			id2: userInfo.id,
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
		include: {
		  player1: { select: { username: true } },
		  player2: { select: { username: true } }
		}
	  });

	return {userInfo, gameNumber, winRate, achievements, matchHistory, isBlocked}
}
