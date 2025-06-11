import { broadcastMessage } from "@/server/routes/chat/websocketChat";
import { notifyFriend } from "@/server/routes/friends/websocketFriends";
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

export default async function removeFriend(userId: number, friendId: number, username: string) {

	await Prisma.friends.deleteMany({
		where: {
			OR: [
				{ id1: userId, id2: friendId },
				{ id1: friendId, id2: userId }
			]
		}
	});

	notifyFriend(friendId, {
	type: "REMOVED_FRIEND",
		from: {
			id: userId,
		}
	})

	notifyFriend(userId, {
	type: "REMOVED_FRIEND",
		from: {
			id: friendId,
		}
	})

	return (true);
}
