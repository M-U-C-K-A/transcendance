import { PrismaClient } from '@prisma/client'
import { connectionData } from '@/server/routes/auth/interface'
import bcrypt from 'bcrypt'

const Prisma = new PrismaClient()

export default async function register2FA(data: connectionData) {
	const existingUser = await Prisma.user.findFirst({
		where: {
			OR: [
			{ username: data.username },
			{ email: data.email },
			],
		},
		select: {
			username: true,
			email: true,
		},
	})


	if (existingUser) {
		if (existingUser.username == data.username) {
			console.log('Username already taken')
			throw new Error('Username already taken')
		}
		if (existingUser.email == data.email) {
			console.log('Email already taken')
			throw new Error('Email already taken')
		}
	}


	return (true)
}
