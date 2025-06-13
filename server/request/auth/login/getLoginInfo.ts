import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function getLoginData(email: string) {
	const user = Prisma.user.findFirst ({
		where: {
			email: email,
		},
		select: {
			id: true,
			email: true,
			username: true,
			bio: true
		},
	});

	if (!user) {
		throw new Error("User not found")
	}
	return (user)
}
