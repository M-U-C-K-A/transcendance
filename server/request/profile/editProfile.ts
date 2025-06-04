import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function editProfile(id: number, username: string, newAvatar: string, newBio: string, newUsername: string) {
	console.log(`Editing profile for user ID: ${id}`)
	console.log(`Editing profile for user with username: ${username}`)
	console.log(`Editing profile for user with new bio: ${newBio}`)
	console.log(`Editing profile for user with new username: ${newUsername}`)

	console.log(newBio)
	if (username != newUsername) {
		const result = await Prisma.user.findFirst({
			where: {
				username: newUsername
			},
		});
		if (result) {
			throw new Error('Username already taken')
		}
	}

	const newInfo = await Prisma.user.update({
		where: {
			id: id,
		},
		data: {
			username: newUsername,
			bio: newBio,
		}
	});

	console.log('Profile updated successfully')
	return (true)
}

