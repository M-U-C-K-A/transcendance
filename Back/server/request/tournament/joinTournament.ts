import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function joinTournament(username: string) {
	const userInfo = await Prisma.user.findFirst ({
		where: {
			username: username,
		},
		select: {
			id: true,
			username: true,
			avatar: true,
			elo: true,
			win: true,
			lose: true,
		}
	})

	if (!userInfo) {
		throw new Error('User not found')
	}

	return (userInfo)
}
