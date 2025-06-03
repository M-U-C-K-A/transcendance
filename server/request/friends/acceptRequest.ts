import { PrismaClient } from "@prisma/client";
import { id } from "../chat/interface";

const Prisma = new PrismaClient();

export default async function acceptRequest(userId: number, friendName: string) {
	const friendId = await Prisma.$queryRaw<id[]>`
		SELECT id FROM "User"
		WHERE username = ${friendName}`;

	if (!friendId[0]) {
		console.log("Friend Id not found");
		throw new Error("Friend Id not found");
	}

	await Prisma.friends.updateMany({
		where: {
			id1: friendId[0].id,
			id2: userId,
		},
		data: {
			status: true
		}
	});

	console.log("Friend accepted successfully");
	return (true);
}
