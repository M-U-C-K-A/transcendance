import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function enable2FA(userId: number, state: boolean) {

	const userInfo = await Prisma.user.findFirst ({
		where: {
			id: userId,
		},
		select: {
			as2FA: state,
		},
	});

	return (true)
}
