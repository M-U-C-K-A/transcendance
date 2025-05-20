import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function getMessage(username: string) {
  try {
	const messages = await Prisma.$queryRaw`
	  SELECT
		m.*,
		sender.username as sender_username,
		recipient.username as recipient_username
	  FROM
		Message m
	  JOIN
		User sender ON m.senderId = sender.id
	  LEFT JOIN
		User recipient ON m.recipientId = recipient.id
	  WHERE
		m.isGeneral = true
		OR sender.username = ${username}
		OR recipient.username = ${username}
	  ORDER BY
		m.sendAt DESC
	`
	return messages
  } catch (error) {
	console.error("Error fetching messages:", error)
	throw error
  }
}
