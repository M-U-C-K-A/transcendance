import { PrismaClient } from "@prisma/client";
import { AwardIcon } from "lucide-react";
import { Erica_One } from "next/font/google";

const Prisma = new PrismaClient()

export default async function friendsList(username: string) {
	const userId = await Prisma.$queryRaw<number[]>`SELECT id FROM "User"
	WHERE username = ${username}`

	if (!userId[0]){
		console.log("User not found")
		throw new Error("User not found")
	}

	const friendsId = await Prisma.$queryRaw<number[]>`SELECT * FROM
	WHERE id1 ==  userId[0] OR id2 == userId[0]`

	if (!friendsId[0]){
		console.log("No friends registered")
		throw new Error("No friends registered")
	}
	const friendsList = await Prisma.$queryRaw`SELECT * FROM "User"
	WHERE id = friendsId`

	return (friendsList)
}
