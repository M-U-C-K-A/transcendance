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

		const isBlocked = await Prisma.block.findFirst({
			where: {
				OR: [
				{ id1: userInfo.id, id2: sender },
				{ id1: sender, id2: userInfo.id }
				],
			},
		});

		if (isBlocked?.id1 == sender) {
			throw new Error ("You blocked this user")
		} else if (isBlocked?.id2 == sender) {
			throw new Error ("This user blocked you")
		}

		recipientId = userInfo.id
		isGeneral = false
	}

	const message = await Prisma.message.create({
		data: {
			senderId: sender,
			recipientId: recipientId,
			content: data.content,
			isGeneral: isGeneral,
			messageType: data.messageType,
		},
		select: {
			id: true,
			senderId: true,
			recipientId: true,
			content: true,
			sendAt: true,
		},
	});

	return (message)
}
