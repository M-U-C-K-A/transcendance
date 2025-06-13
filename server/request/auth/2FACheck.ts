import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function check2FA(email: string, code: string) {
	const isValid = await Prisma.tmpUser.findFirst({
		where: {
			email: email,
		},
		select: {
			code: true,
		},
	});

	if (isValid) {
		return (true)
	}
	else {
		throw new Error ("Wrong code")
	}
}
