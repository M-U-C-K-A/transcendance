import { PrismaClient } from "@prisma/client";
import { id } from "../chat/interface";
import { friendIds } from "../profile/interface";

const Prisma = new PrismaClient()

export default async function friendsList(username: string) {
	const userId = await Prisma.$queryRaw<id[]>`
	SELECT id FROM "User"
	WHERE username = ${username}`

	const friendsId = await Prisma.$queryRaw<friendIds[]>`
	SELECT * FROM "Friends"
	WHERE (id1 = ${userId[0].id} OR id2 = ${userId[0].id})
	AND status = TRUE;`

	let list: number[] = [];

	for (let i = 0; i < friendsId.length; i++) {
	if (friendsId[i].id1 === userId[0].id) {
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
			username: true,
			alias: true,
			avatar: true,
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
