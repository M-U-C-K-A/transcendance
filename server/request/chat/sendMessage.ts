import { sendMessageData } from '@/server/request/chat/interface';
import { PrismaClient } from '@prisma/client'
import { returnData } from './interface';

const Prisma = new PrismaClient()

export default async function sendMessage(sender: number, data: sendMessageData) {
	let isGeneral: boolean = true;
	let recipientId: number | null = null;
	let returnData: returnData = {
		id: null,
		username: null
	}

	if (data.recipient) {
		const userInfo = await Prisma.user.findUnique ({
			where: {
				username: data.recipient,
			},
			select: {
				id: true,
				username: true,
			}
		})

		if (!userInfo) {
			console.log ("User not found , Could not send message")
			throw new Error ("User not found , Could not send message")
		}

		returnData.id = userInfo.id
		returnData.username = userInfo.username
		isGeneral = false
	}

	await Prisma.message.create({
		data: {
			senderId: sender,
			recipientId: returnData.id,
			content: data.content,
			isGeneral: isGeneral,
			messageType: data.messageType,
		},
	});

	return (returnData)
}
