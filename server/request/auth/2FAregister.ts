import { PrismaClient } from '@prisma/client'
import { connectionData } from '@/server/routes/auth/interface'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'

const Prisma = new PrismaClient()

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'pongmaster12345@gmail.com',
    pass: process.env.SMTP_PASS || 'jipk czwd ozxs seys',
  },
})

export default async function register2FA(data: connectionData) {
  try {
    // Vérification de l'existence de l'utilisateur
    const [existingUser, existingTempUser] = await Promise.all([
      Prisma.user.findFirst({
        where: { OR: [{ username: data.username }, { email: data.email }] },
        select: { username: true, email: true },
      }),
      Prisma.tmpUser.findFirst({
        where: { OR: [{ username: data.username }, { email: data.email }] },
        select: { username: true, email: true },
      }),
    ])

    // Gestion des erreurs de doublon
    const checkDuplicate = (user: { username?: string; email?: string }, type: string) => {
      if (user?.username === data.username) {
        throw new Error('Username already taken')
      }
      if (user?.email === data.email) {
        throw new Error('Email already taken')
      }
    }

    checkDuplicate(existingUser, 'User')
    checkDuplicate(existingTempUser, 'Temp user')

    // Création de l'utilisateur temporaire
    const hashedPass = await bcrypt.hash(data.pass, 10)
    const authCode = Math.floor(100000 + Math.random() * 900000).toString()
    const formattedCode = `${authCode.slice(0, 3)} ${authCode.slice(3)}` // Formatage du code

    const newUser = await Prisma.tmpUser.create({
      data: {
        username: data.username,
        email: data.email,
        pass: hashedPass,
        code: authCode,
      },
      select: { username: true, email: true, code: true }
    })

    // Configuration de l'email
    const mailOptions = {
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
            ${formattedCode}
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
    }

    // Envoi de l'email
    await transporter.sendMail(mailOptions)
    return true

  } catch (error) {
    console.error("Error during 2FA registration:", error)
    throw error
  } finally {
    await Prisma.$disconnect()
  }
}
