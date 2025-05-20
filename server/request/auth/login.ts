import {PrismaClient} from '@prisma/client'
import {connectionData} from '../../utils/interface'
import bcrypt from 'bcrypt'

const Prisma = new PrismaClient()

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
