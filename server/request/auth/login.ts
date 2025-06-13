import { PrismaClient } from '@prisma/client'
import { loginData } from '@/server/routes/auth/interface'
import { returnData } from './interface'
import bcrypt from 'bcrypt'
import { transporter } from './2FAregister'

const Prisma = new PrismaClient()

export default async function login(data: loginData) {
	const existingUser = await Prisma.$queryRaw<loginData[]>`
	SELECT pass, email
	FROM "User"
	WHERE email = ${data.email}`

	if (existingUser[0]) {
		if (!existingUser[0].email) {
			console.log('This account does not exist');
			throw new Error ('This account does not exist')
		}
	}

	const goodPass = await bcrypt.compare(data.pass, existingUser[0].pass)

	if (goodPass) {
		console.log(`User has been logged`)
		const userInfo = await Prisma.$queryRaw<returnData[]>`
		SELECT id, email, username, bio
		FROM "User" WHERE email = ${data.email}`

		const authCode = Math.floor(100000 + Math.random() * 900000).toString()

		await transporter.sendMail({
			from: `"Your App Name" <pongmaster12345@gmail.com>`,
			to: data.email,
			subject: 'Your Two‑Factor Authentication Code',
			text: `Hello ${userInfo[0].username},\n\nYour authentication code is: ${authCode}\n\nEnter this code to complete your registration.`,
			html: `
			<p>Hello <strong>${userInfo[0].username}</strong>,</p>
			<p>Your authentication code is:</p>
			<h2>${authCode}</h2>
			<p>Enter this code to complete your registration.</p>
			<br/>
			<p>— The Pong Master Team</p>`,})
		return (userInfo)

	}
	else {
		throw new Error ('Wrong password')
	}
}
