import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function getMessage(username: string) {
	const message = await Prisma.$queryRaw`SELECT m.*,
	sender.username as sender_username,
	recipient.username as recipient_username
	FROM Message m
	JOIN User sender ON m.senderId = sender.id
	JOIN User recipient ON m.recipientId = recipient.id
	WHERE m.status = true
	OR sender.username = :votre_username
	OR recipient.username = :votre_username
	ORDER BY m.sendAt DESC;`

	return (message)
}
