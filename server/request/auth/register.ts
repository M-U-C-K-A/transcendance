import { PrismaClient } from '@prisma/client'
import { connectionData } from '../../utils/interface'
import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'


const Prisma = new PrismaClient()

async function createProfilePicture(username: string, id: number) {
  try {
	const defaultAvatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`

	const dir = path.resolve('public/profilePicture')
	if (!fs.existsSync(dir)) {
	  fs.mkdirSync(dir, { recursive: true })
	}

	const response = await fetch(defaultAvatar)
	if (!response.ok) throw new Error(`Erreur téléchargement avatar: ${response.statusText}`)
	const svgText = await response.text()

	const webpBuffer = await sharp(Buffer.from(svgText))
	  .resize(256, 256)
	  .webp({ quality: 80 })
	  .toBuffer()

	const filePath = path.join(dir, `${id}.webp`)
	await fs.promises.writeFile(filePath, webpBuffer)

	console.log(`Avatar WebP créé pour ${username} dans ${filePath}`)
	} catch (error) {
		console.error('Erreur création avatar WebP:', error)
	}
}

export default async function register(data: connectionData) {
  const existingUser = await Prisma.$queryRaw<connectionData[]>`
	SELECT username, email
	FROM "User"
	WHERE username = ${data.username}
	OR email = ${data.email}`

	if (existingUser[0]) {
		if (existingUser[0].username == data.username) {
			console.log('Username already taken')
			throw new Error('Username already taken')
		}
		if (existingUser[0].email) {
			console.log('Email already taken')
			throw new Error('Email already taken')
		}
	}

	const hashedPass = await bcrypt.hash(data.pass, 10)
	const defaultBio = "👐 Hello i'm new here"

	await Prisma.$executeRaw`
	INSERT INTO "User" (username, email, pass, alias, bio)
	VALUES (${data.username}, ${data.email}, ${hashedPass}, ${data.username}, ${defaultBio})`

	await Prisma.$executeRaw`
	INSERT INTO "Achievement"(id)
	SELECT id FROM "User"
	WHERE username = ${data.username}`

	const user = await Prisma.user.findUnique({
		where: { username: data.username },
		select: { id: true },
	})

	if (!user) throw new Error('User not found after insertion')

	const id = user.id

	await createProfilePicture(data.username, id)

	console.log(`User ${data.username} has been registered`)
	return (true)
}
