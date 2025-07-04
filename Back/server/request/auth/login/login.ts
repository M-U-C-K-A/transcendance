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
			pass: true,
			as2FA: true,
			id: true,
			username: true,
		},
	});

	if (!existingUser || !existingUser.pass) {
		throw new Error('User not found')
	}
	else if (existingUser) {
		if (!existingUser.email) {
			throw new Error ('This account does not exist')
		}
	}

	const goodPass = await bcrypt.compare(pass, existingUser.pass)

	if (goodPass && existingUser.as2FA == true) {
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
				from: `"Pong Master" <pongmaster12345@gmail.com>`,
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

			return {id: existingUser.id, username: existingUser.username, as2FA: true}
		}
	}
	else if (goodPass && existingUser.as2FA == false) {
		return {id: existingUser.id, username: existingUser.username, as2FA: false}
	}
	else {
		throw new Error ('Wrong password')
	}
}
