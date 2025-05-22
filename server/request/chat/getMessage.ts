// server/request/chat/getMessage.ts
import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function getMessage(username: string) {
    const messages = await Prisma.$queryRaw<any[]>`
    WITH general_messages AS (
        SELECT m.*,
        sender.username AS sender_username,
        sender.alias AS sender_alias,
        sender.win AS sender_win,
        sender.lose AS sender_lose,
        sender.elo AS sender_elo,
        sender.avatar AS sender_avatar,
        recipient.username AS recipient_username,
        recipient.alias AS recipient_alias,
        recipient.win AS recipient_win,
        recipient.lose AS recipient_lose,
        recipient.elo AS recipient_elo,
        recipient.avatar AS recipient_avatar
        FROM "Message" m
        JOIN "User" sender ON sender.id = m."senderId"
        LEFT JOIN "User" recipient ON recipient.id = m."recipientId"
        WHERE m."isGeneral" = TRUE
        ORDER BY m."sendAt" DESC
        LIMIT 100
    ),
    private_messages AS (
        SELECT m.*,
        sender.username AS sender_username,
        sender.alias AS sender_alias,
        sender.win AS sender_win,
        sender.lose AS sender_lose,
        sender.elo AS sender_elo,
        sender.avatar AS sender_avatar,
        recipient.username AS recipient_username,
        recipient.alias AS recipient_alias,
        recipient.win AS recipient_win,
        recipient.lose AS recipient_lose,
        recipient.elo AS recipient_elo,
        recipient.avatar AS recipient_avatar
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
    ORDER BY "sendAt" DESC`;

    for (const message of messages) {
        message.sender_avatar = message.sender_avatar
            ? `data:image/png;base64,${Buffer.from(message.sender_avatar).toString('base64')}`
            : `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${message.sender_username}`;

        message.recipient_avatar = message.recipient_avatar
            ? `data:image/png;base64,${Buffer.from(message.recipient_avatar).toString('base64')}`
            : (message.recipient_username
                ? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${message.recipient_username}`
                : null);
    }

    return messages;
}
