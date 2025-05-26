import { PrismaClient } from '@prisma/client'
import { User } from './interface'

const Prisma = new PrismaClient()

export default async function meProfileInfo(username: string) {
	const userInfo = await Prisma.$queryRaw<User[]>`
	SELECT username, avatar, bio, elo, win, onlineStatus, lose, tournamentWon
	FROM "User"
	WHERE username = ${username}`

	if (!userInfo[0]) {
		console.log(`Failed to get ${username} info`)
		throw new Error(`Failed to get ${username} info`)
	}

	return (userInfo[0])
}
