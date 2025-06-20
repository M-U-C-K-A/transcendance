import { PrismaClient } from "@prisma/client";
import { friendIds } from "@/server/request/profile/interface";

const Prisma = new PrismaClient()

export default async function friendsList(userId: number) {
	const friendsId = await Prisma.friends.findMany({
		where: {
			status: true,
			OR: [
			{ id1: userId },
			{ id2: userId },
			],
		},
	});

	let list: number[] = [];

	for (let i = 0; i < friendsId.length; i++) {
	if (friendsId[i].id1 === userId) {
		list.push(friendsId[i].id2);
	} else {
		list.push(friendsId[i].id1);
	}
}
	const friendsList = await Prisma.user.findMany({
		where: {
			id: { in: list }
		},
		select: {
			id: true,
			username: true,
			avatar: true,
			alias: true,
			bio: true,
			onlineStatus: true,
			elo: true,
			win: true,
			lose: true,
			tournamentWon: true,
			pointScored: true,
			pointConcede: true,
		}
	});
	return (friendsList)
}
