import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function newMessage(recipient: string, userId: number) {
	const userInfo = await Prisma.user.findUnique ({
		where: {
			username: recipient,
		},
		select: {
			id: true,
			username: true
		}
	})

	if (!userInfo) {
		console.log("No User found")
		throw new Error ("No User found")
	}

	const isBlocked = await Prisma.block.findFirst({
	where: {
		OR: [
		{ id1: userId, id2: userInfo.id },
		{ id1: userInfo.id, id2: userId }
		],
	},
	});

	if (isBlocked) {
		throw new Error ("User blocked")
	}

	return (userInfo)
}
