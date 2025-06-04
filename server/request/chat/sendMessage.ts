import { sendMessageData, id } from '@/server/request/chat/interface';
import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function sendMessage(senderId: number, data: sendMessageData) {

	let isGeneral: boolean = true;
	let recipientId: number | null = null;

	if (data.recipientId != -1) {
		isGeneral = false
		recipientId = data.recipientId
	}

	await Prisma.message.create({
		data: {
			senderId,
			recipientId: recipientId,
			content: data.content,
			isGeneral: isGeneral,
			messageType: data.messageType,
		},
	});

	return (true)
}
