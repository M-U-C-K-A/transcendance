import { PrismaClient } from '@prisma/client'
import { userData } from './interface'
import { AwardIcon, User } from 'lucide-react'
import { Erica_One } from 'next/font/google'

const Prisma = new PrismaClient()

export default async function getUserInfo(username: string) {
	const userInfo = await Prisma.$queryRaw<userData>`SELECT * FROM "User" WHERE username = ${username}`

	if (!userInfo) {
		console.log(`Failed to get ${username} info`)
		throw new Error(`Failed to get ${username} info`)
	}

	const achievements = await Prisma.$queryRaw`SELECT * FROM "Achievement" WHERE id = ${userInfo.id}`;

	const matches = await Prisma.$queryRaw`SELECT * FROM "Match" WHERE id = ${userInfo.id}`;

	return {userInfo, matches, achievements}
}
