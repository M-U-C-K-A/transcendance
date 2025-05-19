import { PrismaClient } from '@prisma/client'
import { AwardIcon } from 'lucide-react'

const Prisma = new PrismaClient()

export default async function sendMessage(senderName: string, recipientName: string, content: string) {
	const message = await Prisma.$queryRaw`
	INSERT INTO "Message" ("senderId", "recipientId", "content", "status")
	SELECT sender.id, recipient.id, $3,
	CASE WHEN $2 IS NULL THEN TRUE ELSE FALSE END
	FROM "User" AS sender
	LEFT JOIN "User" AS recipient ON recipient.username = $2
	WHERE sender.username = $1`;

	return (message)
}
