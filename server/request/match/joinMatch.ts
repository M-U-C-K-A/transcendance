import { PrismaClient } from '@prisma/client'


const Prisma = new PrismaClient()

export default async function joinMatch(userId: number, matchId: number) {
	const userInfo = await Prisma.user.findUnique ({
		where: {
			id: userId,
		},
		select: {
			username: true,
			elo: true,
		}
	});

	if (!userInfo) {
		throw new Error ("User not found")
	}

	const matchInfo = await Prisma.match.update ({
		where: {
			id: matchId,
		},
		data: {
			p2Id: userId,
			p2Elo: userInfo?.elo,
		}
	});

	console.log("Match joined succesfully")
	return (matchInfo)
}
