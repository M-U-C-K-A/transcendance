import { PrismaClient } from '@prisma/client'
import { error } from 'console';

const Prisma = new PrismaClient()

export default async function sendMessage(sender: number, recipient: number, content: string, messageType: string ) {

	if (sender == recipient) {
		throw new Error("You can't send message to yourself")
	}

	const userInfo = await Prisma.user.findUnique({
		where: {
			id: recipient
		},
		select: {
			id: true
		}
	});

	if (!userInfo) {
		throw new Error("User not found, could not send message");
	}

	const isBlocked = await Prisma.block.findFirst({
		where: {
			OR: [
				{ id1: userInfo.id, id2: sender },
				{ id1: sender, id2: userInfo.id }
			],
		},
	});

	if (isBlocked?.id1 === sender) {
		throw new Error("You blocked this user");
	} else if (isBlocked?.id2 === sender) {
		throw new Error("This user blocked you");
	}

	const message = await Prisma.message.create({
		data: {
			senderId: sender,
			recipientId: recipient,
			content: content,
			messageType: messageType,
		},
		select: {
			id: true,
			senderId: true,
			recipientId: true,
			content: true,
			sendAt: true,
		},
	});

	const senderInfo = await Prisma.user.findUnique({
		where: { id: message.senderId },
		select: {
			id: true,
			avatar: true,
			username: true,
			win: true,
			lose: true,
			elo: true,
		}
	});

	const recipientInfo = await Prisma.user.findFirst({
		where: {
			id: message.recipientId,
		},
		select: {
			id: true,
			avatar: true,
			username: true,
			win: true,
			lose: true,
			elo: true,
		},
	});

	if (!senderInfo) {
		throw new Error("Sender not found");
	}

	const wsMessage = {
		id: message.id,
		content: message.content,
		sendAt: message.sendAt,
		messageType: messageType,
		sender: {
			id: senderInfo.id,
			username: senderInfo.username,
			win: senderInfo.win,
			lose: senderInfo.lose,
			elo: senderInfo.elo,
			avatar: senderInfo.avatar,
		},
		recipient: {
			id: recipientInfo?.id,
			username: recipientInfo?.username,
			win: recipientInfo?.win,
			lose: recipientInfo?.lose,
			elo: recipientInfo?.elo,
			avatar: recipientInfo?.avatar,
		},
	};

	return (wsMessage);
}

