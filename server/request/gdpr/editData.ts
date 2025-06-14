import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import { createProfilePicture } from "../auth/register/register";

const Prisma = new PrismaClient()

export default async function editData(
	userId: number,
	username: string,
	email: string,
	pass: string,
	resetAvatar: boolean)
{
	const hashedPass = await bcrypt.hash(pass, 10)

	if (resetAvatar) {
		createProfilePicture(username, userId)
	}

	await Prisma.user.updateMany({
		where: {
			id: userId,
		},
		data: {
			username: username,
			email: email,
			pass: hashedPass,
		},
	});

	return (true)
}
