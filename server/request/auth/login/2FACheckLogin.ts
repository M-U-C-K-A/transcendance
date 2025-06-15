import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function checkLogin2FA(email: string, code: string) {
	const isValid = await Prisma.user.findFirst({
		where: {
			email: email,
		},
		select: {
			code: true,
		},
	});

	if (isValid?.code == code) {
		return (true)
	}
	else {
		throw new Error ("Wrong code")
	}
}
