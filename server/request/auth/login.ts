import {PrismaClient} from '@prisma/client'
import {connectionData} from '../../utils/interface'
import bcrypt from 'bcrypt'

const Prisma = new PrismaClient()

export default async function login(data: connectionData) {
	const existingUser = await Prisma.$queryRaw<connectionData[]>`
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
		console.log(`User ${existingUser[0].username} has been logged`)
		return (true)
	}
	else {
		console.log('Wrong password');
		throw new Error ('Wrong password')
	}
}
