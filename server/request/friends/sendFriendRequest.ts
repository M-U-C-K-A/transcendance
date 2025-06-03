import { PrismaClient } from "@prisma/client";
import { id } from "../chat/interface";

const Prisma = new PrismaClient()

export default async function sendFriendRequest(userId: number, friendName: string) {

	console.log(friendName)
	const newFriend = await Prisma.$queryRaw<id[]>`
	SELECT id FROM "User"
	WHERE username = ${friendName}`

	if (!newFriend[0]) {
		console.log("This user does not exist")
		throw new Error("This user does not exist")
	}

	const isAlreadyFriend = await Prisma.$queryRaw<any[]>`
	SELECT * FROM "Friends"
	WHERE id1 = userId AND id2 = newFriend[0].id
	OR id1 = newFriend[0].id OR id2 = userId`

	if (isAlreadyFriend[0]) {
		console.log("This user is already a friend")
		throw new Error("This user is already a friend")
	}

	await Prisma.$executeRaw`
	INSERT INTO "Friends"(id1, id2)
	VALUES (${userId}, ${newFriend[0].id})`

	return (true)
}
