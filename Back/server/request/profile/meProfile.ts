import { PrismaClient } from '@prisma/client'
import { User } from './interface'

const Prisma = new PrismaClient()

export default async function meProfileInfo(userId: number) {
	const userInfo = await Prisma.user.findUnique ({
		where: {
			id: userId,
		},
		select: {
			id: true,
			avatar: true,
			email: true,
			username: true,
			bio: true,
			elo: true,
			win: true,
			lose: true,
			onlineStatus: true,
			tournamentWon: true,
		}
	})

	if (!userInfo) {
		throw new Error(`Failed to get user's info`)
	}

	return (userInfo)
}
