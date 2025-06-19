import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function enable2FA(userId: number) {
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

	let as2FA : boolean
	if (userInfo.as2FA == true) {
		as2FA = false
	} else {
		as2FA = true
	}

	await Prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			as2FA: as2FA,
		}
	});

	return (true)
}
