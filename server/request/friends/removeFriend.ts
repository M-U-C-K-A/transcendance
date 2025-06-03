import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

export default async function removeFriend(userId: number, friendId: number) {
	console.log('test')
	console.log(userId)
	console.log(friendId)

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
