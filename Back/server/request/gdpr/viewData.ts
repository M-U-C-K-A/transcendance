import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const Prisma = new PrismaClient()

export default async function viewData(userId: number, pass: string) {
	const userData = await Prisma.user.findFirst({
		where: {
			id: userId,
		},
		select: {
			email: true,
			avatar: true,
			pass: true,
			username: true,
		}
	});

	if (!userData) {
		throw new Error('This user does not exist')
	}
	if (userData.pass) {
		const hashed = await bcrypt.compare(pass, userData.pass)
		if (hashed) {
			return {id: userId, username: userData.username, email: userData.email, avatar: userData.avatar}
		} else {
			throw new Error("Wrong password")
		}
	}
	else {
		throw new Error("Google account can't edit their data")
	}
}
