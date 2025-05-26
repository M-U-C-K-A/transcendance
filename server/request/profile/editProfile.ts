import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function editProfile(id: number, username: string, newAvatar: string, newBio: string, newUsername: string) {
	console.log(`${username}\n ${newUsername}\n`)

	if (username != newUsername) {
		const result = await Prisma.user.findFirst({
			where: {
				username: newUsername
			},
		});

		if (result) {
			console.log('Username already taken')
			throw new Error('Username already taken')
		}
	}

	const avatar = Buffer.from(newAvatar);

	const newInfo = await Prisma.user.update({
		where: {
			id: id,
		},
		data: {
			avatar: avatar,
			bio: newBio,
			username: newUsername,
		}
	});

	return (true)
}
