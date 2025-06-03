import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

export default async function seeFriendRequest(userId: number) {
	const friendsRequests = await Prisma.friends.findMany({
		where: {
			id2: userId,
			status: false,
		},
		select: {
			id1: true,
		}
	});

	if (!friendsRequests) {
		console.log("No invitation in pending")
		throw new Error("No invitation in pending")
	}
	const requesterIds = friendsRequests.map(friend => friend.id1);

	const requestStatus = await Prisma.user.findMany({
		where: {
			id: {in: requesterIds}
		},
		select: {
			id: true,
			username: true,
			elo: true,
			bio: true,
			onlineStatus: true,
			win: true,
			lose: true,
			tournamentWon: true,
			pointScored: true,
			pointConcede: true,
		},
	})
	return (requestStatus);
}
