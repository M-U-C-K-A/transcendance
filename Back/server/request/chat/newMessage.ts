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
		throw new Error ("No User found")
	}

	if (userInfo.id == userId) {
		throw new Error ("You can't send message to yourself")
	}
	const isBlocked = await Prisma.block.findFirst({
		where: {
			OR: [
			{ id1: userId, id2: userInfo.id },
			{ id1: userInfo.id, id2: userId }
			],
		},
	});

	if (isBlocked?.id1 == userId) {
		throw new Error ("You blocked this user")
	} else if (isBlocked?.id2 == userId) {
		throw new Error ("This user blocked you")
	}

	return (userInfo)
}
