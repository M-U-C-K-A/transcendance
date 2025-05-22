import { sendMessageData, id } from '@/server/request/chat/interface';
import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function sendMessage(data: sendMessageData) {
	const senderId = await Prisma.$queryRaw<id[]>`
  	SELECT id FROM "User" WHERE username = ${data.senderName}`
	const recipientId = await Prisma.$queryRaw<id[]>`
  	SELECT id FROM "User" WHERE username = ${data.recipientName}`

	if (senderId[0]) {
		if (!senderId[0].id) {
			console.log("User not found in sendMessage")
			throw new Error("User not found in sendMessage")
		}
	}

	let isGeneral: Boolean = true;
	let recipient: number | null = null
	if (recipientId[0]) {
		if (recipientId[0].id) {
			recipient = recipientId[0].id
			isGeneral = false
		}
	}

	await Prisma.$queryRaw`
	INSERT INTO "Message" ("senderId", "recipientId", "content", "isGeneral")
	VALUES (${senderId[0].id}, ${recipient}, ${data.content}, ${isGeneral})`

	return (true)
}
