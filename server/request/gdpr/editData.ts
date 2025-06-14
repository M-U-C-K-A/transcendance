import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const Prisma = new PrismaClient()

export default async function editData(
	userId: number,
	email: string,
	pass: string,
	resetAvatar: boolean)
{
	const hashedPass = await bcrypt.hash(pass, 10)

	if (resetAvatar) {
		resetAvatar(userId)
	}

	await Prisma.user.updateMany({
		where: {
			id: userId,
		},
		data: {
			email: email,
			pass: hashedPass,
		},
	});

	return (true)
}
