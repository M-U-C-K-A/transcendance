import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function editProfile(id: number, username: string, newAvatarBase64: string, newBio: string, newUsername: string){

	if (username !== newUsername) {
		const result = await Prisma.user.findFirst({
			where: { username: newUsername },
		})
		if (result) {
			throw new Error('Username already taken')
		}
	}

	await Prisma.user.update({
		where: {
			id: id
		},
		data: {
			avatar: newAvatarBase64,
			username: newUsername || username,
			bio: newBio,
		}
	})

	return (true)
}
