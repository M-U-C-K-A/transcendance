// server/request/chat/getMessage.ts
import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function getMessage(userId: number) {
	const messages = await Prisma.$queryRaw<any[]>`
		WITH general_messages AS (
			SELECT
				m.id,
				m."content" AS text,
				m."sendAt" AS timestamp,
				m."readStatus" AS "isRead",
				NOT m."isGeneral" AS "isPrivate",
				sender.id AS sender_user_id,
				sender.username AS sender_name,
				sender.win AS sender_win,
				sender.lose AS sender_lose,
				sender.elo AS sender_elo,
				'/profilepicture/' || sender.id || '.webp' AS sender_avatar,
				recipient.id AS recipient_user_id,
				recipient.username AS recipient_name,
				recipient.win AS recipient_win,
				recipient.lose AS recipient_lose,
				recipient.elo AS recipient_elo,
				'/profilepicture/' || recipient.id || '.webp' AS recipient_avatar
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
				m."content" AS text,
				m."sendAt" AS timestamp,
				m."readStatus" AS "isRead",
				NOT m."isGeneral" AS "isPrivate",
				sender.id AS sender_user_id,
				sender.username AS sender_name,
				sender.win AS sender_win,
				sender.lose AS sender_lose,
				sender.elo AS sender_elo,
				'/profilepicture/' || sender.id || '.webp' AS sender_avatar,
				recipient.id AS recipient_user_id,
				recipient.username AS recipient_name,
				recipient.win AS recipient_win,
				recipient.lose AS recipient_lose,
				recipient.elo AS recipient_elo,
				'/profilepicture/' || recipient.id || '.webp' AS recipient_avatar
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

	const messageInfo = messages.map(m => ({
		id: Number(m.id),
		user: {
			id: Number(m.sender_user_id),
			name: m.sender_name,
			avatar: m.sender_avatar,
			win: Number(m.sender_win),
			lose: Number(m.sender_lose),
			elo: Number(m.sender_elo),
		},
		recipient: m.recipient_user_id ? {
			id: m.recipient_user_id,
			name: m.recipient_name,
			avatar: m.recipient_avatar,
			win: Number(m.recipient_win),
			lose: Number(m.recipient_lose),
			elo: Number(m.recipient_elo),
		} : null,
		text: m.text,
		timestamp: m.timestamp,
		isPrivate: Number(m.isPrivate),
		isRead: m.isRead,
	}))


	return messageInfo;
}
