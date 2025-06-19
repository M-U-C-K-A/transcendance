import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function get2FAState(userId: number) {
	const userInfo = await Prisma.user.findFirst ({
		where: {
			id: userId,
		},
		select: {
			as2FA: true,
		},
	});

	if (!userInfo) {
		throw new Error('User not found')
	}

	return (userInfo.as2FA)
}
