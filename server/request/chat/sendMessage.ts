import { sendMessageData, id } from '@/server/request/chat/interface';
import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function sendMessage(senderId: number, data: sendMessageData) {

	console.log("test")
	let isGeneral: boolean = true;
	let recipientId: number | null = null;

	if (data.recipientId != -1) {
		isGeneral = false
		recipientId = data.recipientId
	}

	console.log("test3")
	console.log(senderId)
	console.log(data)
	console.log(isGeneral)
	await Prisma.message.create({
		data: {
			senderId,
			recipientId: recipientId,
			content: data.content,
			isGeneral: isGeneral,
		},
	});

	console.log("test4")
	return (true)
}
