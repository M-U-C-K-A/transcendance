import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { createProfilePicture } from "@/server/request/auth/register/register";

const Prisma = new PrismaClient()

export default async function editData(
	userId: number,
	username: string,
	email: string,
	pass: string,
	resetAvatar: boolean)
{
	const oldData = await Prisma.user.findFirst({
		where: {
			id: userId,
		},
		select: {
			username: true,
			email: true,
		},
	});

	if (oldData?.email != email || oldData?.username != username) {
		const alreadyTaken = await Prisma.user.findFirst({
			where: {
				OR: [
					{ email: email },
					{ username: username }
				],
				NOT: {
					id: userId
				}
			}
		});

		if (alreadyTaken) {
			throw new Error('New email or username already taken')
		}
	}

	const hashedPass = await bcrypt.hash(pass, 10)

	if (resetAvatar) {
		const avatar = await createProfilePicture(username)
		await Prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				username: username,
				email: email,
				pass: hashedPass,
				avatar: avatar,
			},
		});
	} else {
		await Prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				username: username,
				email: email,
				pass: hashedPass,
			},
		});
	}

	const newToken = await Prisma.user.findFirst({
		where: {
			id: userId,
		},
		select: {
			id: true,
			username: true,
		},
	});

	return (newToken)
}
