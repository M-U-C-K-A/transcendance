import { PrismaClient } from '@prisma/client'
import { messageInfo, id } from './interface'
import { userData } from '../user/interface'
import { getAvatar } from '@/server/utils/getAvatar'
import { send } from 'process'

const Prisma = new PrismaClient()

export default async function getMessage(username: string) {
	const userId = await Prisma.$queryRaw<id[]>`
	SELECT id FROM "User"
	WHERE username = ${username}`

	if (!userId[0].id) {
		console.log("Coulndt find user in getMessage")
		throw new Error("Coulndt find user in getMessage")
	}

	const messages = await Prisma.$queryRaw<messageInfo[]>`
	SELECT * from "Message"
	WHERE senderId = ${userId[0].id}
	OR recipientId = ${userId[0].id}
	OR isGeneral = TRUE
	ORDER BY "sendAt" ASC`

	const users: userData[] = [];

	for (const message of messages) {
	const sender = await Prisma.$queryRaw<userData[]>`
		SELECT * FROM "User" WHERE id = ${message.senderId}`
	const recipient = await Prisma.$queryRaw<userData[]>`
		SELECT * FROM "User" WHERE id = ${message.recipientId}`

		if (sender[0]) {
			sender[0].avatar = await getAvatar(sender[0]);
			users.push(sender[0]);
		}
		if (recipient[0]) {
			recipient[0].avatar = await getAvatar(recipient[0]);
			users.push(recipient[0]);
		}
	}
	return {messages, users}
}
