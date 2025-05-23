import { PrismaClient } from '@prisma/client'
import { userData } from './interface'
import { getAvatar } from '@/server/utils/getAvatar'

const Prisma = new PrismaClient()

export default async function getUserInfo(username: string) {
	console.log(`${username}`)
	const userInfo = await Prisma.$queryRaw<userData[]>`
	SELECT * FROM "User"
	WHERE username = ${username}`
	console.log("test1")
	if (!userInfo[0]) {
		console.log(`Failed to get ${username} info`)
		throw new Error(`Failed to get ${username} info`)
	}
	console.log("test2")
	const achievements = await Prisma.$queryRaw`SELECT * FROM "Achievement" WHERE id = ${userInfo[0].id}`;
	console.log("test3")
	const matches = await Prisma.$queryRaw`SELECT * FROM "Match" WHERE id = ${userInfo[0].id}`;
	console.log("test4")
	return {userInfo, matches, achievements}
}
