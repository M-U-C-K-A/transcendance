import { PrismaClient } from '@prisma/client'
import { userData } from './interface'
import { getAvatar } from '@/server/utils/getAvatar'

const Prisma = new PrismaClient()

export default async function getUserInfo(username: string) {
	const userInfo = await Prisma.$queryRaw<userData[]>`SELECT * FROM "User" WHERE username = ${username}`

	if (!userInfo[0]) {
		console.log(`Failed to get ${username} info`)
		throw new Error(`Failed to get ${username} info`)
	}

	const achievements = await Prisma.$queryRaw`SELECT * FROM "Achievement" WHERE id = ${userInfo[0].id}`;

	const matches = await Prisma.$queryRaw`SELECT * FROM "Match" WHERE id = ${userInfo[0].id}`;

	return {userInfo, matches, achievements}
}
