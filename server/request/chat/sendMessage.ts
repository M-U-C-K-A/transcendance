import { sendMessageData, id } from '@/server/request/chat/interface';
import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function sendMessage(data: sendMessageData) {
	console.log("test1")
	const senderId = await Prisma.$queryRaw<id[]>`
  	SELECT id FROM "User" WHERE username = ${data.senderName}`
	console.log("test2")
	const recipientId = await Prisma.$queryRaw<id[]>`
  	SELECT id FROM "User" WHERE username = ${data.recipientName}`
	console.log("test3")

	if (senderId[0]) {
		if (!senderId[0].id) {
			console.log("User not found in sendMessage")
			throw new Error("User not found in sendMessage")
		}
	}
	console.log("test4")

	let isGeneral: Boolean = true;
	let recipient: number | null = null
	if (recipientId[0]) {
		if (recipientId[0].id) {
			recipient = recipientId[0].id
			isGeneral = false
		}
	}
	console.log("test5")

	await Prisma.$queryRaw`
	INSERT INTO "Message" ("senderId", "recipientId", "content", "isGeneral")
	VALUES (${senderId[0].id}, ${recipient}, ${data.content}, ${isGeneral})`

	return (true)
}
