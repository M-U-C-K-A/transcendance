import { PrismaClient } from "@prisma/client";
import { id } from "../chat/interface";
import { notifyFriend } from "@/server/routes/friends/websocketFriends";

const Prisma = new PrismaClient();

export default async function treatRequest(userId: number, friendName: string, asAccepted: boolean, username: string) {
	const friendId = await Prisma.$queryRaw<id[]>`
	SELECT id FROM "User"
	WHERE username = ${friendName}`;

	if (!friendId[0]) {
		throw new Error("Friend Id not found");
	}

	if (asAccepted) {
		await Prisma.friends.updateMany({
			where: {
				id1: friendId[0].id,
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
				id1: friendId[0].id,
				id2: userId,
			},
		});
	}

	notifyFriend(userId, {
	type: "NEW_FRIEND",
		from: {
			id: friendId[0].id,
		}
	})

	notifyFriend(friendId[0].id, {
	type: "NEW_FRIEND",
		from: {
			id: userId,
		}
	})
	return (true);
}
