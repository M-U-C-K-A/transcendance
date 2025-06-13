import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function matchCreate(matchName: string, hostId: number) {
	const hostData = await Prisma.user.findUnique ({
		where: {
			id: hostId,
		},
		select: {
			elo: true,
		}
	});

	if (!hostData) {
		throw new Error ("t'es qui ptdrrrrrr ?")
	}

	const matchInfo = await Prisma.match.create ({
		data: {
			name: matchName,
			p1Id: hostId,
			p1Elo: hostData.elo
		},
		select: {
			id: true,
		},
	});

	return (matchInfo)
}
