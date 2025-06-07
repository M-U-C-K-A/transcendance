import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function getMessage(userId: number) {
  const messages = await Prisma.$queryRaw<any[]>`
	WITH general_messages AS (
	SELECT
		m.id,
		m."content" as text,
		m."sendAt" as timestamp,
		m."readStatus" as isRead,
		m."isGeneral",
		m."messageType",
		sender.id AS sender_id,
		sender.username AS sender_name,
		CONCAT('/profilepicture/', sender.id, '.webp') AS sender_avatar,
		sender.win AS sender_win,
		sender.lose AS sender_lose,
		sender.elo AS sender_elo,
		recipient.id AS recipient_id,
		recipient.username AS recipient_name,
		CONCAT('/profilepicture/', recipient.id, '.webp') AS recipient_avatar,
		recipient.win AS recipient_win,
		recipient.lose AS recipient_lose,
		recipient.elo AS recipient_elo
		FROM "Message" m
		JOIN "User" sender ON sender.id = m."senderId"
		LEFT JOIN "User" recipient ON recipient.id = m."recipientId"
		WHERE m."isGeneral" = TRUE
		ORDER BY m."id" DESC
		LIMIT 100
	),
	private_messages AS (
		SELECT
		m.id,
		m."content" as text,
		m."sendAt" as timestamp,
		m."readStatus" as isRead,
		m."isGeneral",
		m."messageType",
		sender.id AS sender_id,
		sender.username AS sender_name,
		CONCAT('/profilepicture/', sender.id, '.webp') AS sender_avatar,
		sender.win AS sender_win,
		sender.lose AS sender_lose,
		sender.elo AS sender_elo,
		recipient.id AS recipient_id,
		recipient.username AS recipient_name,
		CONCAT('/profilepicture/', recipient.id, '.webp') AS recipient_avatar,
		recipient.win AS recipient_win,
		recipient.lose AS recipient_lose,
		recipient.elo AS recipient_elo
		FROM "Message" m
		JOIN "User" sender ON sender.id = m."senderId"
		LEFT JOIN "User" recipient ON recipient.id = m."recipientId"
		WHERE (m."senderId" = ${userId} OR m."recipientId" = ${userId})
		AND m."isGeneral" = FALSE
	)
	SELECT * FROM general_messages
	UNION ALL
	SELECT * FROM private_messages
	ORDER BY id ASC`;

	return messages.map(m => ({
		id: m.id,
		user: {
			id: m.sender_id,
			name: m.sender_name,
			avatar: m.sender_avatar,
			win: m.sender_win,
			lose: m.sender_lose,
			elo: m.sender_elo,
		},
		recipient: {
			id: m.recipient_id,
			name: m.recipient_name,
			avatar: m.recipient_avatar,
			win: m.recipient_win,
			lose: m.recipient_lose,
			elo: m.recipient_elo,
		},
		text: m.text,
		timestamp: m.timestamp,
		isPrivate: !m.isGeneral,
		isRead: m.isRead,
	}));
}
