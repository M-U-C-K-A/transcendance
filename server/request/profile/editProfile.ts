import { PrismaClient } from '@prisma/client'
import { editProfileInfo } from './interface'

const Prisma = new PrismaClient()

export default async function editProfile(newInfo: editProfileInfo) {
	const result = await Prisma.$queryRaw`UPDATE "User"
	SET bio = ${newInfo.newBio},
	username = ${newInfo.newAlias},
	avatar = ${newInfo.newAvatar}
	WHERE username = ${newInfo.username}`

	if (!result) {
		console.log('Error while updating the profile')
		throw new Error('Error while updating the profile')
	}
	else {
		console.log(`Update of ${newInfo.username} profile successful`);
		return (result)
	}
}
