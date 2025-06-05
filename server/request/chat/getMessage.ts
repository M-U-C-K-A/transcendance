// server/request/chat/getMessage.ts
import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function getMessage(username: string) {
	const messages = await Prisma.$queryRaw<any[]>`
	WITH general_messages AS (
		SELECT
			m.id,
			m."content",
			m."sendAt",
			m."readStatus",
			m."isGeneral",
			m."messageType",
			sender.Id AS sender_id,
			sender.username AS sender_username,
			sender.win AS sender_win,
			sender.lose AS sender_lose,
			sender.elo AS sender_elo,
			recipient.Id AS recipient_id,
			recipient.username AS recipient_username,
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
			m."content",
			m."sendAt",
			m."readStatus",
			m."isGeneral",
			m."messageType",
			sender.Id AS sender_id,
			sender.username AS sender_username,
			sender.win AS sender_win,
			sender.lose AS sender_lose,
			sender.elo AS sender_elo,
			recipient.Id AS recipient_id,
			recipient.username AS recipient_username,
			recipient.win AS recipient_win,
			recipient.lose AS recipient_lose,
			recipient.elo AS recipient_elo
		FROM "Message" m
		JOIN "User" sender ON sender.id = m."senderId"
		LEFT JOIN "User" recipient ON recipient.id = m."recipientId"
		JOIN "User" currentUser ON currentUser.username = ${username}
		WHERE (m."senderId" = currentUser.id OR m."recipientId" = currentUser.id)
		AND m."isGeneral" = FALSE
	)
	SELECT * FROM general_messages
	UNION ALL
	SELECT * FROM private_messages
	ORDER BY id ASC`;

	return (messages);
}

