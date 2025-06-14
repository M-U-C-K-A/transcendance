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
			pass: true
		}
	});

	if (!userData) {
		throw new Error('This user does not exist')
	}
	if (userData.pass) {
		const hashed = await bcrypt.compare(pass, userData.pass)
		if (hashed) {
			return {email: userData.email, pass}
		} else {
			throw new Error("Wrong password")
		}
	}
	else {
		throw new Error("Google account can't edit their data")
	}
}
