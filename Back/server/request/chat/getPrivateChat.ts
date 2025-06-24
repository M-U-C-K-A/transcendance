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
				},
			},
			recipient: {
				select: {
					id: true,
					username: true,
					avatar: true
				},
			}
		},
		orderBy: { sendAt: 'asc' }
	});

	const username = await prisma.user.findFirst({
		where: {
			id: userId,
		},
		select: {
			username: true,
		},
	});

	const chat = rawMessages.map(msg => {
		const isSender = msg.sender.id === userId;
		return {
		id: msg.id,
		content: msg.content,
		sendAt: msg.sendAt,
		messageType: msg.messageType,
		sender: {
			id: msg.sender.id,
			username: msg.sender.username,
			avatar: msg.sender.avatar,
		},
		recipient: {
				id: msg.recipient.id,
				username: msg.recipient.username,
				avatar: msg.recipient.avatar,
			},
		user: {
			id: userId,
			username: username?.username,
		},
	}});

	return (chat);
}
