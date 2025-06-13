import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getPrivateChat(userId: number) {
	const rawMessages = await prisma.message.findMany({
		where: {
			isGeneral: false,
			OR: [
				{ recipientId: userId },
				{ senderId: userId },
			],
		},
		select: {
			id: true,
			content: true,
			sendAt: true,
			messageType: true,
			sender: {
				select: {
					id: true,
					username: true,
				},
			},
			recipient: {
				select: {
					id: true,
					username: true,
				},
			}
		},
		orderBy: { sendAt: 'asc' }
	});

	const chat = rawMessages.map(msg => {
		const isSender = msg.sender.id === userId;
		return {
			id: msg.id,
			content: msg.content,
			sendAt: msg.sendAt,
			user: isSender ? msg.sender : msg.recipient,
			collegue: isSender ? msg.recipient : msg.sender,
			sender: msg.sender
		};
	});

	return (chat);
}
