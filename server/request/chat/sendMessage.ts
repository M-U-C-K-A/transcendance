import { sendMessageData } from '@/server/request/chat/interface';
import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function sendMessage(sender: number, data: sendMessageData) {
	let isGeneral: boolean = true;
	let recipientId: number | null = null;

	if (data.recipient) {
		const userInfo = await Prisma.user.findUnique ({
			where: {
				id: data.recipient,
			},
			select: {
				id: true,
			}
		})

		if (!userInfo) {
			console.log ("User not found , Could not send message")
			throw new Error ("User not found , Could not send message")
		}

		recipientId = userInfo.id
		isGeneral = false
	}

	await Prisma.message.create({
		data: {
			senderId: sender,
			recipientId: recipientId,
			content: data.content,
			isGeneral: isGeneral,
			messageType: data.messageType,
		},
	});

	return (true)
}
