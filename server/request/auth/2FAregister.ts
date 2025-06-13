import { PrismaClient } from '@prisma/client'
import { connectionData } from '@/server/routes/auth/interface'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'

const Prisma = new PrismaClient()

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: Number(process.env.SMTP_PORT || 587),
	secure: process.env.SMTP_SECURE === 'true',
	auth: {
		user: 'pongmaster12345@gmail.com',
		pass: 'jipk czwd ozxs seys',
	},
})

export default async function register2FA(data: connectionData) {
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

	const existingUser2 = await Prisma.tmpUser.findFirst({
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
			console.log('Username already taken')
			throw new Error('Username already taken')
		}
		if (existingUser.email == data.email) {
			console.log('Email already taken')
			throw new Error('Email already taken')
		}
	}

	if (existingUser2) {
		if (existingUser2.username == data.username) {
			console.log('Username already taken')
			throw new Error('Username already taken')
		}
		if (existingUser2.email == data.email) {
			console.log('Email already taken')
			throw new Error('Email already taken')
		}
	}

	const hashedPass = await bcrypt.hash(data.pass, 10)

	const authCode = Math.floor(100000 + Math.random() * 900000).toString()

	console.log("TEST CREATION GAME")
	const newUser = await Prisma.tmpUser.create ({
		data: {
			username: data.username,
			email: data.email,
			pass: hashedPass,
			code: authCode,
		},
		select: {
			username: true,
			email: true,
			code: true,
		}
	});
	console.log("TEST APRES CREATION GAME")
	await transporter.sendMail({
		from: `"Your App Name" <pongmaster12345@gmail.com>`,
		to: newUser.email,
		subject: 'Your Two‑Factor Authentication Code',
		text: `Hello ${newUser.username},\n\nYour authentication code is: ${newUser.code}\n\nEnter this code to complete your registration.`,
		html: `
		<p>Hello <strong>${newUser.username}</strong>,</p>
		<p>Your authentication code is:</p>
		<h2>${newUser.code}</h2>
		<p>Enter this code to complete your registration.</p>
		<br/>
		<p>— The Pong Master Team</p>`,})
	console.log("LA CHANCLA", newUser)

	return (true)
}
