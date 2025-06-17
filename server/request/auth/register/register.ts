import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const Prisma = new PrismaClient()

export async function createProfilePicture(username: string, id: number) {
try {

	const defaultAvatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`;

	const dir = path.resolve(process.cwd(), 'public', 'profilepicture');

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	const response = await fetch(defaultAvatar);

	if (!response.ok) {
	  throw new Error(`Erreur téléchargement avatar: ${response.statusText}`);
	}

	const svgText = await response.text();

	const buffer = Buffer.from(svgText, 'utf-8');

	const webpBuffer = await sharp(buffer, { density: 300 })
		.resize(256, 256)
		.webp({ quality: 80 })
		.toBuffer();

	const filePath = path.join(dir, `${id}.webp`);

	await fs.promises.writeFile(filePath, webpBuffer);

	} catch (error) {
			console.error('Erreur création avatar WebP:', {
			message: (error as Error).message,
			stack: (error as Error).stack,
		});
	}
}

export async function register(email: string) {

	const data = await Prisma.tmpUser.findFirst({
		where: {
			email: email,
		},
		select: {
			username: true,
			email: true,
			pass: true,
		},
	});

	if (data) {
		const existingUser = await Prisma.user.findFirst({
			where: {
				OR: [
				{ username: data.username },
				{ email: data.email },
				],
			},
			select: {
				username: true,
				email: true,
			},
		})


		if (existingUser) {
			if (existingUser.username == data.username) {
				throw new Error('Username already taken')
			}
			if (existingUser.email == data.email) {
				throw new Error('Email already taken')
			}
		}

		const defaultBio = "👐 Hello i'm new here"

		const newUser = await Prisma.user.create({
			data: {
				username: data.username,
				email: data.email,
				pass: data.pass,
				alias: data.username,
				bio: defaultBio,
			},
		})

		await Prisma.achievement.create({
			data: {
				id: newUser.id,
			},
		})

		const user = await Prisma.user.findUnique({
			where: { username: data.username },
			select: { id: true },
		})

		if (!user) {
			throw new Error('User not found after insertion')
		}

		const id = user.id

		await createProfilePicture(data.username, id)

		return (newUser)
	}
	throw new Error("Error while creating account")
}
