import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

export default async function removeFriend(userId: number, friendName: string) {
	const friend = await Prisma.user.findUnique({
		where: {
			username: friendName,
		},
		select: {
			id: true,
		}
	});

	if (!friend) {
		console.log("Could not find friend Id")
		throw new Error("Could not find friend Id")
	}

	const friendId = friend.id

	await Prisma.friends.deleteMany({
		where: {
			OR: [
				{ id1: userId, id2: friendId },
				{ id1: friendId, id2: userId }
			]
		}
	});

	console.log("Friend removed succesfully")
	return (true);
}
