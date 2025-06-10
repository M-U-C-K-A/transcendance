import { PrismaClient } from '@prisma/client'
import fetch from 'node-fetch';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const Prisma = new PrismaClient()

export async function downloadImage(url: string, filename: string) {
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error(`Failed to fetch image`);
	}

	const buffer = await res.buffer();

	const outputDir = path.join(process.cwd(), 'public/profilepicture');
	await mkdir(outputDir, { recursive: true });

	const filePath = path.join(outputDir, filename);

	await sharp(buffer)
		.webp({ quality: 80 })
		.toFile(filePath);

	return (`/profilepicture/${filename}`);
}

export async function googleConnexion(email: string, username: string, googleId: string, avatar: string) {

	const isAlreadyRegister = await Prisma.user.findUnique({
		where: {
			email: email,
		},
		select: {
			id: true,
			username: true,
			email: true,
			bio: true,
		}
	})

	if (isAlreadyRegister) {
		console.log ("This user already have a logged google account")
		return {
			id: isAlreadyRegister.id,
			username: isAlreadyRegister.username,
			email: isAlreadyRegister.email,
			bio: isAlreadyRegister.bio,
		}
	}

	console.log("pas register test")
	const defaultBio = "👐 Hello i'm new here"
	const newName = username + '_' + googleId

	console.log(email, username, avatar, googleId)
	const newUser = await Prisma.user.create({
		data: {
			username: newName,
			email: email,
			alias: newName,
			bio: defaultBio,
		},
	})
	console.log("test after register")
	const user = await Prisma.user.findUnique({
		where: {
			username: newUser.username
		},
		select: {
			id: true
		},
	})

	if (!user) {
		throw new Error('User not found after insertion')
	}

	await Prisma.achievement.create({
		data: {
			id: newUser.id,
		},
	})
	console.log("test image")
	await downloadImage(avatar, user.id + ".webp")

	console.log(`User ${newName} has been registered`)
	return {
		id: user.id,
		username: newUser.username,
		email: newUser.email,
		bio: newUser.bio,
	}
}
