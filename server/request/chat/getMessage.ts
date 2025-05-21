import { PrismaClient } from '@prisma/client'
import { messageInfo, id } from './interface'
import { matchInfo } from '../match/interface'

const Prisma = new PrismaClient()


export default async function getMessage(username: string) {
	const userId = await Prisma.$queryRaw<id[]>`
	SELECT id FROM "User"
	WHERE username = ${username}`

	if (!userId[0].id) {
		console.log("Coulndt find user in getMessage")
		throw new Error("Coulndt find user in getMessage")
	}

	const messages = await Prisma.$queryRaw<matchInfo[]>`
	SELECT * from "Message"
	WHERE senderId = ${userId[0].id}
	OR recipientId = ${userId[0].id}
	OR isGeneral = TRUE
	ORDER BY "sendAt" ASC`

	return (messages)
}