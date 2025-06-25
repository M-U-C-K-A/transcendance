import { PrismaClient } from '@prisma/client'
import fetch from 'node-fetch';
import sharp from 'sharp';

const Prisma = new PrismaClient()

export async function downloadImage(url: string): Promise<string> {
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error(`Failed to fetch image`);
	}

	const buffer = await res.arrayBuffer();

	const optimizedBuffer = await sharp(Buffer.from(buffer))
		.webp({ quality: 80 })
		.toBuffer();

	const base64Image = `${optimizedBuffer.toString('base64')}`;

	return (base64Image);
}



export async function googleConnexion(email: string, username: string, googleId: string, avatar: string) {

	const isAlreadyRegister = await Prisma.user.findUnique({
		where: {
			email: email,
		},
		select: {
			id: true,
			username: true,
		}
	})

	if (isAlreadyRegister) {
		return {
			id: isAlreadyRegister.id,
			username: isAlreadyRegister.username,
		}
	}

	const defaultBio = "👐 Hello i'm new here"
	const newName = username + '_' + Math.floor(100000 + Math.random() * 900000).toString()

	const base64Avatar = await downloadImage(avatar)

	const newUser = await Prisma.user.create({
		data: {
			username: newName,
			avatar: base64Avatar,
			email: email,
			alias: newName,
			bio: defaultBio,
		},
		select: {
			id: true,
			username: true,
		}
	})

	return {
		id: newUser.id,
		username: newUser.username,
	}
}
