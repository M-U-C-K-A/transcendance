import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function editProfile(id: number, username: string, newAvatar: string, newBio: string, newUsername: string) {
	console.log(`Editing profile for user ID: ${id}`)
	console.log(`Editing profile for user with username: ${username}`)
	console.log(`Editing profile for user with new avatar: ${newAvatar}`)
	console.log(`Editing profile for user with new bio: ${newBio}`)
	console.log(`Editing profile for user with new username: ${newUsername}`)

	if (username != newUsername) {
		console.log(`Checking if new username "${newUsername}" is available`)
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
	console.log('Updating user profile with new avatar, bio, and username')

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

	console.log('Profile updated successfully')
	return (true)
}

