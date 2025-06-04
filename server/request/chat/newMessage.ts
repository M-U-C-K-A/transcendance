import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function newMessage(recipient: string) {
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

	return (userInfo)
}
