import { PrismaClient } from "@prisma/client";
import { friendRequest } from "./interface";

const Prisma = new PrismaClient()

export default async function sendFriendRequest(request: friendRequest) {
	await Prisma.$executeRaw`
	INSERT INTO "Friends"(id1, id2)
	VALUES (
	(SELECT id FROM "User" WHERE username = ${request.adder}),
	(SELECT id FROM "User" WHERE username = ${request.newFriend}))`;

	return (true)
}
