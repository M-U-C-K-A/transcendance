import { PrismaClient } from '@prisma/client'
import sharp from 'sharp'

const Prisma = new PrismaClient()

export async function createProfilePicture(username: string): Promise<string | null> {
  try {
	const defaultAvatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`;

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

	const base64Image = webpBuffer.toString('base64');

	return (base64Image);
  } catch (error) {
	console.error('Erreur création avatar WebP:', {
		message: (error as Error).message,
		stack: (error as Error).stack,
	});
	return (null);
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

		const avatar = await createProfilePicture(data.username)

		const newUser = await Prisma.user.create({
			data: {
				username: data.username,
				avatar: avatar,
				email: data.email,
				pass: data.pass,
				alias: data.username,
				bio: defaultBio,
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

		return (newUser)
	}
	throw new Error("Error while creating account")
}
