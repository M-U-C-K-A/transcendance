import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function editProfile(username: string, newAlias: string, newBio: string, newAvatar: string) {
	const result = await Prisma.$queryRaw`UPDATE "User"
	SET bio = ${newBio}, username = ${newAlias}, avatar = ${newAvatar}
	WHERE username = ${username}`

	if (!result) {
		console.log('Error while updating the profile')
		throw new Error('Error while updating the profile')
	}
	else {
		console.log(`Update of ${username} profile successful`);
		return (result)
	}
}
