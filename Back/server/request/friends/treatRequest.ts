import { PrismaClient } from "@prisma/client";
import { notifyFriend } from "@/server/routes/friends/websocketFriends";

const Prisma = new PrismaClient();

export default async function treatRequest(userId: number, friendName: string, asAccepted: boolean, username: string) {
	const friendId = await Prisma.user.findFirst({
		where: {
			username: friendName,
		},
		select: {
			id: true,
		},
	});

	if (!friendId) {
		throw new Error("Friend Id not found");
	}

	if (asAccepted) {
		await Prisma.friends.updateMany({
			where: {
				id1: friendId.id,
				id2: userId,
			},
			data: {
				status: true
			}
		});
	}
	else {
		await Prisma.friends.deleteMany({
			where: {
				id1: friendId.id,
				id2: userId,
			},
		});
	}

	notifyFriend(userId, {
	type: "NEW_FRIEND",
		from: {
			id: friendId.id,
		}
	})

	notifyFriend(friendId.id, {
	type: "NEW_FRIEND",
		from: {
			id: userId,
		}
	})
	return (true);
}
