import { removeChatConnection, removeFriendConnection } from "@/server/websocket/notifications";
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient()

export default async function deleteData(userId: number, username: string) {

	const isNotGoogle = await Prisma.user.findFirst({
		where: {
			id: userId,
		},
		select: {
			pass: true,
		},
	});

	await Prisma.friends.deleteMany({
		where: {
			OR: [
				{id1: userId},
				{id2: userId},
			],
		},
	});

	await Prisma.block.deleteMany({
		where: {
			OR: [
				{id1: userId},
				{id2: userId},
			],
		},
	});

	await Prisma.match.deleteMany({
		where: {
			OR: [
				{p1Id: userId},
				{p2Id: userId},
			],
		},
	});

	await Prisma.message.deleteMany({
		where: {
			OR: [
				{senderId: userId},
				{recipientId: userId},
			],
		},
	});

	await Prisma.user.delete({
		where: {
			id: userId,
		},
	});

	if (isNotGoogle?.pass) {
		await Prisma.tmpUser.delete({
			where: {
				username: username,
			},
		});
	}

	return (true)
}
