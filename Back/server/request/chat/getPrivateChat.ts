import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getPrivateChat(userId: number) {
	const rawMessages = await prisma.message.findMany({
		where: {
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
					avatar: true,
					win: true,
					lose: true,
					elo: true,
				},
			},
			recipient: {
				select: {
					id: true,
					username: true,
					avatar: true,
					win: true,
					lose: true,
					elo: true,
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
			messageType: msg.messageType,
			user: isSender ? msg.sender : msg.recipient,
			collegue: isSender ? msg.recipient : msg.sender,
			sender: msg.sender
		};
	});

	return (chat);
}
