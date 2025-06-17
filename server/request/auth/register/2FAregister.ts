import { PrismaClient } from '@prisma/client'
import { connectionData } from '@/server/routes/auth/interface'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'

const Prisma = new PrismaClient()

export const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: Number(process.env.SMTP_PORT || 587),
	secure: process.env.SMTP_SECURE === 'true',
	auth: {
		user: "pongmaster12345@gmail.com",
		pass: "jipk czwd ozxs seys",
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
			throw new Error('Username already taken')
		}
		if (existingUser.email == data.email) {
			throw new Error('Email already taken')
		}
	}

	if (existingUser2) {
		if (existingUser2.username == data.username) {
			throw new Error('Username already taken')
		}
		if (existingUser2.email == data.email) {
			throw new Error('Email already taken')
		}
	}

	const hashedPass = await bcrypt.hash(data.pass, 10)

	const authCode = Math.floor(100000 + Math.random() * 900000).toString()

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
	await transporter.sendMail({
		from: `"PongMaster" <${process.env.SMTP_USER || 'pongmaster12345@gmail.com'}>`,
		to: newUser.email,
		subject: 'Your Verification Code',
		html: `
			<div class="container" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
			<img src="https://github.com/M-U-C-K-A/transcendance/blob/main/public/school.jpeg?raw=true" alt="PongMaster Banner" style="width: 100%; max-height: 140px; max-width: 560px; display: block; object-fit:cover; margin: 0 auto 24px auto; border-radius: 8px;" />
			<h1 style="color: #1a1a1a; text-align: center; font-size: 24px; margin-bottom: 24px;">
				Welcome to PongMaster
			</h1>

			<p style="color: #404040; font-size: 16px; line-height: 24px;">
				Hello <strong>${newUser.username}</strong>,
			</p>

			<p style="color: #404040; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
				Please use the following verification code to complete your registration:
			</p>

			<div style="background: #f8f8f8; padding: 16px; text-align: center; margin: 24px 0;
						border-radius: 6px; font-size: 32px; font-weight: 600; letter-spacing: 2px;
						color: #1a1a1a; font-family: monospace;">
				${authCode}
			</div>

			<p style="color: #666; font-size: 14px; line-height: 20px; margin-bottom: 24px;">
				This code will expire in 15 minutes. If you didn't request this, please ignore this email.
			</p>

			<div style="border-top: 1px solid #eaeaea; padding-top: 16px;">
				<p style="color: #666; font-size: 12px; text-align: center;">
				© ${new Date().getFullYear()} PongMaster. All rights reserved.
				</p>
			</div>
			</div>
		`,
	});


	return (true)
}
