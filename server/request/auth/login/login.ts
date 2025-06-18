import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { transporter } from '../register/2FAregister'

const Prisma = new PrismaClient()

export default async function login(email: string, pass: string) {
	const existingUser = await Prisma.user.findFirst({
		where: {
			email: email,
		},
		select: {
			email: true,
			pass: true
		},
	});

	if (!existingUser) {
		throw new Error('User not found')
	}
	else if (existingUser) {
		if (!existingUser.email) {
			throw new Error ('This account does not exist')
		}
	}

	const goodPass = await bcrypt.compare(pass, existingUser[0].pass)

	if (goodPass) {

		const userInfo = await Prisma.user.findFirst({
			where: {
				email: email,
			},
			select: {
				username: true,
			},
		});
		const authCode = Math.floor(100000 + Math.random() * 900000).toString()

		await Prisma.user.update({
			where: {
				email: email,
			},
			data: {
				code: authCode,
			},
		});

		if (userInfo?.username) {
			await transporter.sendMail({
				from: `"Your App Name" <pongmaster12345@gmail.com>`,
				to: email,
				subject: 'Your Two‑Factor Authentication Code',
				text: `Hello ${userInfo.username},\n\nYour authentication code is: ${authCode}\n\nEnter this code to complete your registration.`,
				html: `
				<p>Hello <strong>${userInfo.username}</strong>,</p>
				<p>Your authentication code is:</p>
				<h2>${authCode}</h2>
				<p>Enter this code to complete your registration.</p>
				<br/>
				<p>— The Pong Master Team</p>`,})

				return (true)
		}
	}
	else {
		throw new Error ('Wrong password')
	}
}
