import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const Prisma = new PrismaClient()

async function saveAvatarFromBase64(base64Data: string, id: number) {
	try {
		const buffer = Buffer.from(base64Data, 'base64')

		const dir = path.resolve('public/profilepicture')
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true })
		}

		const filePath = path.join(dir, `${id}.webp`)

		await sharp(buffer)
		.resize(256, 256)
		.webp({ quality: 80 })
		.toFile(filePath)

	} catch (error) {
		console.error('Erreur lors de la sauvegarde de l\'avatar :', error)
		throw error
	}
}

export default async function editProfile(id: number, username: string, newAvatarBase64: string, newBio: string, newUsername: string){
	console.log(`Editing profile for user ID: ${id}`)
	console.log(`Editing profile for user with username: ${username}`)
	console.log(`Editing profile for user with new bio: ${newBio}`)
	console.log(`Editing profile for user with new username: ${newUsername}`)

	if (username !== newUsername) {
		const result = await Prisma.user.findFirst({
			where: { username: newUsername },
		})
		if (result) {
			throw new Error('Username already taken puta')
		}
	}

	if (newAvatarBase64 && newAvatarBase64.trim() !== '') {
		await saveAvatarFromBase64(newAvatarBase64, id)
	}

	await Prisma.user.update({
		where: {
			id: id
		},
		data: {
			username: newUsername || username,
			bio: newBio,
		}
	})

	console.log('Profile updated successfully')
	return (true)
}
