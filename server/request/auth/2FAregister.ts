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

	const existingUser2 = await Prisma.tmpUser.findFirst({
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

	if (existingUser2) {
		if (existingUser2.username == data.username) {
			console.log('Username already taken')
			throw new Error('Username already taken')
		}
		if (existingUser2.email == data.email) {
			console.log('Email already taken')
			throw new Error('Email already taken')
		}
	}

	const hashedPass = await bcrypt.hash(data.pass, 10)

	const authCode = Math.floor(100000 + Math.random() * 900000).toString()

	console.log("TEST CREATION GAME")
	const newUser = await Prisma.tmpUser.create ({
		data: {
			username: data.username,
			email: data.email,
			pass: hashedPass,
			code: authCode,
		},
		select: {
			username: true,
			email: true,
			code: true,
		}
	});
	console.log("TEST APRES CREATION GAME")
	console.log(newUser)
	return (newUser)
}
