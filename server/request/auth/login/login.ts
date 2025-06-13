import { PrismaClient } from '@prisma/client'
import { loginData } from '@/server/routes/auth/interface'
import { returnData } from '../interface'
import bcrypt from 'bcrypt'
import { transporter } from '../register/2FAregister'
import { emit } from 'process'

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

		const userInfo = await Prisma.user.findFirst({
			where: {
				email: data.email,
			},
			select: {
				username: true,
			},
		});
		const authCode = Math.floor(100000 + Math.random() * 900000).toString()

		await Prisma.user.update({
			where: {
				email: data.email,
			},
			data: {
				code: authCode,
			},
		});

		if (userInfo?.username) {
			await transporter.sendMail({
				from: `"Your App Name" <pongmaster12345@gmail.com>`,
				to: data.email,
				subject: 'Your Two‑Factor Authentication Code',
				text: `Hello ${userInfo.username},\n\nYour authentication code is: ${authCode}\n\nEnter this code to complete your registration.`,
				html: `
				<p>Hello <strong>${userInfo.username}</strong>,</p>
				<p>Your authentication code is:</p>
				<h2>${authCode}</h2>
				<p>Enter this code to complete your registration.</p>
				<br/>
				<p>— The Pong Master Team</p>`,})

				return {code: authCode, emit: data.email}
		}

	}
	else {
		throw new Error ('Wrong password')
	}
}
