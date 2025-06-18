import { PrismaClient } from "@prisma/client";
import { id } from "@/server/request/chat/interface";
import { notifyFriend } from "@/server/websocket/notifications";

const Prisma = new PrismaClient()

export default async function sendFriendRequest(userId: number, friendName: string) {
	const newFriend = await Prisma.$queryRaw<id[]>`
	SELECT id FROM "User"
	WHERE username = ${friendName}`

	if (!newFriend[0]) {
		throw new Error("This user does not exist")
	}

	const isAlreadyFriend = await Prisma.$queryRaw<any[]>`
	SELECT * FROM "Friends"
	WHERE (id1 = ${userId} AND id2 = ${newFriend[0].id})
	OR (id1 = ${newFriend[0].id} AND id2 = ${userId})`;

	if (isAlreadyFriend[0]) {
		throw new Error("This user is already a friend")
	}

	await Prisma.$executeRaw`
	INSERT INTO "Friends"(id1, id2)
	VALUES (${userId}, ${newFriend[0].id})`

	const currentUser = await Prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			username: true,
		},
	});

	notifyFriend(newFriend[0].id, {
	type: "NEW_FRIEND_REQUEST",
		from: {
			id: userId,
		}
	})

	return (true)
}
