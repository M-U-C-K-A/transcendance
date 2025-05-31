import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const Prisma = new PrismaClient()

export default async function editProfile(id: number, username: string, newAvatar: string, newBio: string, newUsername: string) {
	console.log(`Editing profile for user ID: ${id}`)
	console.log(`Editing profile for user with username: ${username}`)
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

	let avatarPath = null;
	if (newAvatar) {
		try {
			// Générer un nom de fichier unique
			const fileHash = crypto.createHash('md5').update(newAvatar + Date.now()).digest('hex');
			const fileName = `${fileHash}.png`;
			avatarPath = `/profilepicture/${fileName}`;
			const fullPath = path.join(process.cwd(), 'public', 'profilepicture', fileName);

			// Décoder la base64 et sauvegarder l'image
			const imageBuffer = Buffer.from(newAvatar, 'base64');
			fs.writeFileSync(fullPath, imageBuffer);
			
			console.log('Avatar saved successfully at:', avatarPath);
		} catch (error) {
			console.error('Error saving avatar:', error);
			throw new Error('Failed to save avatar');
		}
	}

	console.log('Updating user profile with new avatar path, bio, and username')

	const newInfo = await Prisma.user.update({
		where: {
			id: id,
		},
		data: {
			avatar: avatarPath,
			bio: newBio || "",
			username: newUsername,
		}
	});

	console.log('Profile updated successfully')
	return (true)
}

