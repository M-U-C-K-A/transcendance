import { PrismaClient } from "@prisma/client";
import { id } from "../chat/interface";
import { friendIds } from "./interface";

const Prisma = new PrismaClient()

export default async function friendsList(username: string) {
	const userId = await Prisma.$queryRaw<id[]>`
	SELECT id FROM "User"
	WHERE username = ${username}`

	console.log("test")
	if (!userId[0]) {
		console.log("User not found")
		throw new Error("User not found")
	}
	console.log("test2")
	const friendsId = await Prisma.$queryRaw<friendIds[]>`
	SELECT * FROM
	WHERE id1 ==  ${userId[0].id}
	OR id2 == ${userId[0].id}`
	console.log("test3")
	if (!friendsId[0]) {
		console.log("No friends registered")
		throw new Error("No friends registered")
	}
	console.log("test4")
	let list : id[] = [];
	for (let i = 0; i < friendsId.length; i++) {
		if (friendsId[i].id1 = userId[0].id) {
			list[i].id = friendsId[i].id2
		}
		else {
			list[i].id = friendsId[i].id1
		}
	}
	console.log("test5")
	const friendsList = await Prisma.$queryRaw`
	SELECT * FROM "User"
	WHERE id = list`

	return (friendsList)
}
