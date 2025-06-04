import { PrismaClient } from '@prisma/client'
import { loginData } from '@/server/routes/auth/interface'
import { returnData } from './interface'
import bcrypt from 'bcrypt'

const Prisma = new PrismaClient()

export default async function login(data: loginData) {
	const existingUser = await Prisma.$queryRaw<loginData[]>`
	SELECT pass, email
	FROM "User"
	WHERE email = ${data.email}`

	if (existingUser[0]) {
		if (!existingUser[0].email) {
			console.log('This account does not exist');
			throw new Error ('This account does not exist')
		}
	}

	const goodPass = await bcrypt.compare(data.pass, existingUser[0].pass)

	if (goodPass) {
		console.log(`User has been logged`)
		const userInfo = await Prisma.$queryRaw<returnData[]>`
		SELECT id, email, username, bio
		FROM "User" WHERE email = ${data.email}`

		return (userInfo)

	}
	else {
		console.log('Wrong password');
		throw new Error ('Wrong password')
	}
}
