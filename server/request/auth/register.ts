import {PrismaClient} from '@prisma/client'
import {connectionData} from '../../utils/interface'
import bcrypt from 'bcrypt'

const Prisma = new PrismaClient()

export async function register(data: connectionData) {
	const existingUser = await Prisma.$queryRaw<connectionData[]>`
	SELECT username, email
	FROM "User"
	WHERE username = ${data.username} OR email = ${data.email}`

	if (existingUser[0]) {
		if (existingUser[0].username == data.username) {
			console.log('Username already taken');
			throw new Error ('Username already taken')
		}
		if (existingUser[0].email) {
			console.log ('Email already taken');
			throw new Error ('Email already taken')
		}
	}

	const hashedPass = await bcrypt.hash(data.password, 10)

	await Prisma.$executeRaw`
	INSERT INTO "User" (username, email, pass)
	VALUES (${data.username}, ${data.email}, ${hashedPass})`

	await Prisma.$executeRaw`
	INSERT INTO "Achievement"(id)
	SELECT id FROM "User"
	WHERE username = ${data.username}`

	console.log(`User ${data.username} has been registered`)
	return (true)
}
