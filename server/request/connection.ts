import {PrismaClient} from '@prisma/client'
import {connectionData} from '../utils/interface'
import bcrypt from 'bcrypt'
import { PRERENDER_MANIFEST } from 'next/dist/shared/lib/constants'
import { AwardIcon } from 'lucide-react'

const Prisma = new PrismaClient()

export async function register(data: connectionData) {
	const getRequest = await Prisma.$queryRaw<connectionData[]>`SELECT username, email FROM "User" WHERE username = ${data.username}`

	if (getRequest[0].username) {console.log('Username already taken'); throw Error ('Username already taken')}

	if (getRequest[0].email) {console.log ('Email already taken'); throw Error ('Email already taken')}

	const hashedPass = await bcrypt.hash(data.password, 10)

	await Prisma.$executeRaw`INSERT INTO "User"(username, email, password)
	VALUES (${data.username}, ${data.email}, ${hashedPass})`

	await Prisma.$executeRaw`INSERT INTO "Achievement"(id)
	SELECT id FROM "User"
	WHERE username = ${data.username}`

	console.log(`User ${getRequest[0].username} has been registered`)

	return (true)
}

export async function login(data: connectionData) {
	const getRequest = await Prisma.$queryRaw<connectionData[]>`SELECT email, password FROM "User" WHERE email = ${data.email}`

	if (!getRequest[0].email) {console.log('This account does not exist'); throw Error ('This account does not exist')}

	const goodPass = await bcrypt.compare(data.password, getRequest[0].password)

	if (goodPass)
	{
		console.log(`User ${getRequest[0].username} has been logged`)
		return (true)
	}
	else
		{console.log('Wrong password'); throw Error ('Wrong password')}
}
